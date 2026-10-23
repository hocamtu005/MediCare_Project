package vn.medicare.api.service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;

import lombok.RequiredArgsConstructor;
import vn.medicare.api.entity.Appointment;
import vn.medicare.api.entity.AppointmentStatus;
import vn.medicare.api.entity.Role;
import vn.medicare.api.entity.Schedule;
import vn.medicare.api.entity.User;
import vn.medicare.api.repository.AppointmentRepository;
import vn.medicare.api.repository.ScheduleRepository;
import vn.medicare.api.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class ReceptionistService {
    
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;

    public List<Map<String, Object>> getTodaysAppointments() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);

        var appointments = appointmentRepository.findByAppointmentDateBetweenOrderByAppointmentDateAsc(startOfDay, endOfDay);

        return appointments.stream().map(apt -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", apt.getId());
            
            // Lấy giờ từ TimeSlot (đặt trước) hoặc CreatedAt (khách vãng lai)
            String timeStr = "--:--";
            if (apt.getTimeSlot() != null && apt.getTimeSlot().getStartTime() != null) {
                timeStr = apt.getTimeSlot().getStartTime().toString().substring(0, 5); 
            } else if (apt.getCreatedAt() != null) {
                timeStr = apt.getCreatedAt().toLocalTime().toString().substring(0, 5);
            }
            map.put("time", timeStr);
            
            map.put("patient", apt.getPatient().getFullName());
            map.put("phone", apt.getPatient().getPhone() != null ? apt.getPatient().getPhone() : "");
            map.put("doctor", apt.getDoctor().getFullName());
            map.put("status", apt.getStatus().name()); 
            
            long fee = apt.getDoctor().getFee() != null ? apt.getDoctor().getFee().longValue() : 300000L;
            map.put("fee", fee); 
            return map;
        }).collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> checkInPatient(UUID appointmentId, String note) {
        var apt = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn"));
        
        apt.setStatus(AppointmentStatus.CHECKED_IN);
        if (note != null && !note.trim().isEmpty()) {
             String currentReason = apt.getReason() != null ? apt.getReason() : "";
             apt.setReason(currentReason + "\n[Ghi chú Lễ tân]: " + note);
        }
        appointmentRepository.save(apt);
        
        Map<String, Object> res = new HashMap<>();
        res.put("message", "Check-in thành công");
        res.put("status", apt.getStatus().name());
        return res;
    }

    @Transactional
    public Map<String, Object> processPayment(UUID appointmentId) {
        var apt = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn"));
        
        apt.setStatus(AppointmentStatus.PAID); 
        appointmentRepository.save(apt);
        
        Map<String, Object> res = new HashMap<>();
        res.put("message", "Thanh toán viện phí thành công");
        return res;
    }

    @Transactional
    public Map<String, Object> saveVitals(UUID appointmentId, Map<String, String> vitals) {
        var apt = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn"));
        
        apt.setStatus(AppointmentStatus.TRIAGED);
        
        String vitalsInfo = String.format(" [Sinh hiệu: Mạch %s, HA %s, Nhiệt độ %s°C, Cân nặng %skg]", 
                vitals.getOrDefault("heartRate", "-"),
                vitals.getOrDefault("bloodPressure", "-"),
                vitals.getOrDefault("temperature", "-"),
                vitals.getOrDefault("weight", "-"));
        
        String oldReason = apt.getReason() != null ? apt.getReason() : "Không có lý do";
        apt.setReason(oldReason + vitalsInfo);
        
        appointmentRepository.save(apt);
        
        Map<String, Object> res = new HashMap<>();
        res.put("message", "Lưu sinh hiệu thành công!");
        return res;
    }

    @Transactional
    public Map<String, Object> createWalkInAppointment(Map<String, String> data) {
        String phone = data.get("phone");
        String fullName = data.get("fullName");
        String doctorEmail = data.get("doctorEmail");
        String reason = data.get("reason");
        
        // NHẬN GIỜ TỪ FRONTEND ĐỂ HIỂN THỊ ĐÚNG TRONG DANH SÁCH
        String timeStr = data.get("time");
        LocalDateTime walkInTime = timeStr != null ? LocalDateTime.parse(timeStr) : LocalDateTime.now();

        String dummyEmail = phone + "@patient.medicare.vn";
        User patient = userRepository.findByEmail(dummyEmail).orElse(null);
        if (patient == null) {
            patient = new User();
            patient.setFullName(fullName);
            patient.setPhone(phone);
            patient.setEmail(dummyEmail);
            patient.setPassword("123456"); 
            patient.setRole(Role.PATIENT);
            patient = userRepository.save(patient);
        }

        User doctor = userRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy email Bác sĩ này trong hệ thống"));

        Appointment apt = new Appointment();
        apt.setPatient(patient);
        apt.setDoctor(doctor);
        apt.setReason(reason);
        apt.setStatus(AppointmentStatus.CHECKED_IN); 
        apt.setCreatedAt(walkInTime); // Gắn giờ khám vãng lai vào
        
        appointmentRepository.save(apt);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Đã tạo lịch khám vãng lai thành công!");
        return res;
    }

    public byte[] generateReceiptPdf(UUID appointmentId) {
        Appointment apt = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch khám"));

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
            Paragraph title = new Paragraph("BIEN LAI THU TIEN VIEN PHI", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph("\n")); 

            Font normalFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL);
            Font boldFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);

            document.add(new Paragraph("Ma giao dich: " + apt.getId(), normalFont));
            document.add(new Paragraph("Benh nhan: " + apt.getPatient().getFullName(), boldFont));
            document.add(new Paragraph("So dien thoai: " + (apt.getPatient().getPhone() != null ? apt.getPatient().getPhone() : ""), normalFont));
            
            String formattedDate = "-";
            if (apt.getTimeSlot() != null && apt.getTimeSlot().getSchedule() != null) {
                java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy");
                String dateStr = apt.getTimeSlot().getSchedule().getWorkDate().format(formatter);
                String timeStr = apt.getTimeSlot().getStartTime().toString().substring(0, 5);
                formattedDate = timeStr + " " + dateStr;
            }
            
            document.add(new Paragraph("Ngay kham: " + formattedDate, normalFont));
            document.add(new Paragraph("Dich vu: Kham benh tong quat", normalFont));
            document.add(new Paragraph("--------------------------------------------------", normalFont));
            
            long fee = apt.getDoctor().getFee() != null ? apt.getDoctor().getFee().longValue() : 300000L;
            document.add(new Paragraph("TONG CONG: " + String.format("%,d", fee) + " VND", boldFont));
            document.add(new Paragraph("Trang thai: DA THANH TOAN", normalFont));

            document.add(new Paragraph("\n\n"));
            
            Paragraph sign = new Paragraph("Nguoi thu tien\n(Ky va ghi ro ho ten)", normalFont);
            sign.setAlignment(Element.ALIGN_RIGHT);
            document.add(sign);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tạo file PDF Biên lai: " + e.getMessage());
        }
    }

    public Map<String, Object> getDashboardStats(LocalDate date) {
        if (date == null) date = LocalDate.now();
        
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        
        var todaysAppointments = appointmentRepository.findByAppointmentDateBetweenOrderByAppointmentDateAsc(startOfDay, endOfDay);
        
        long totalPatients = todaysAppointments.size();
        
        // Chỉ lấy những lịch đã thanh toán để tính doanh thu
        var paidAppointments = todaysAppointments.stream()
            .filter(a -> a.getStatus() == AppointmentStatus.PAID)
            .collect(Collectors.toList());
            
        long totalRevenue = paidAppointments.stream()
            .mapToLong(a -> a.getDoctor().getFee() != null ? a.getDoctor().getFee().longValue() : 300000L)
            .sum();
            
        long waitingCount = todaysAppointments.stream()
            .filter(a -> a.getStatus() == AppointmentStatus.CHECKED_IN || a.getStatus() == AppointmentStatus.TRIAGED || a.getStatus() == AppointmentStatus.IN_PROGRESS)
            .count();
            
        long completedCount = todaysAppointments.stream()
            .filter(a -> a.getStatus() == AppointmentStatus.COMPLETED)
            .count();
            
        // ----- LOGIC NHÓM DOANH THU THEO CHUYÊN KHOA -----
        Map<String, Long> revenueBySpecialtyMap = new HashMap<>();
        String[] mockSpecialties = {"Nhi khoa", "Tai Mũi Họng", "Da liễu", "Khám Nội chung"};
        
        for (Appointment apt : paidAppointments) {
            String specialtyName = "Khám chung"; 
            if (apt.getDoctor() != null) {
                // Ánh xạ ngẫu nhiên (Mock) vì không có SpecialtyRepository. 
                // Khi có đủ DB, bạn có thể gọi: specialtyRepository.findById(apt.getDoctor().getSpecialtyId())
                int index = Math.abs(apt.getDoctor().getId().hashCode()) % mockSpecialties.length;
                specialtyName = mockSpecialties[index];
            }
            
            long fee = apt.getDoctor().getFee() != null ? apt.getDoctor().getFee().longValue() : 300000L;
            revenueBySpecialtyMap.put(specialtyName, revenueBySpecialtyMap.getOrDefault(specialtyName, 0L) + fee);
        }
        
        List<Map<String, Object>> revenueBySpecialty = revenueBySpecialtyMap.entrySet().stream().map(entry -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", entry.getKey());
            map.put("value", entry.getValue());
            double percentage = totalRevenue > 0 ? (double) entry.getValue() / totalRevenue * 100 : 0;
            map.put("percentage", Math.round(percentage));
            return map;
        }).collect(Collectors.toList());
            
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPatients", totalPatients);
        stats.put("totalRevenue", totalRevenue);
        stats.put("waitingCount", waitingCount);
        stats.put("completedCount", completedCount);
        stats.put("revenueBySpecialty", revenueBySpecialty); 
        
        return stats;
    }

    public List<Map<String, Object>> getTodaysDoctorSchedules() {
        LocalDate today = LocalDate.now();
        
        List<Schedule> todaysSchedules = scheduleRepository.findByWorkDate(today);
        
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);
        var todaysAppointments = appointmentRepository.findByAppointmentDateBetweenOrderByAppointmentDateAsc(startOfDay, endOfDay);
        
        return todaysSchedules.stream()
            .filter(schedule -> schedule.getStaff().getRole() == Role.DOCTOR)
            .map(schedule -> {
            Map<String, Object> map = new HashMap<>();
            User doc = schedule.getStaff(); 
            
            map.put("doctorName", doc.getFullName());
            map.put("doctorEmail", doc.getEmail());
            
            String startTime = schedule.getStartTime() != null ? schedule.getStartTime().toString().substring(0,5) : "";
            String endTime = schedule.getEndTime() != null ? schedule.getEndTime().toString().substring(0,5) : "";
            
            String shiftTime = (!startTime.isEmpty() && !endTime.isEmpty()) 
                               ? startTime + " - " + endTime 
                               : "Chưa đăng ký"; 
            map.put("shiftTime", shiftTime);
            
            long patientCount = todaysAppointments.stream()
                .filter(apt -> apt.getDoctor().getId().equals(doc.getId()))
                .count();
                
            map.put("patientCount", patientCount);
            return map;
        }).collect(Collectors.toList());
    }
}