package vn.medicare.api.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import vn.medicare.api.entity.Role;
import vn.medicare.api.entity.Appointment;
import vn.medicare.api.entity.AppointmentStatus;
import vn.medicare.api.entity.TimeSlot;
import vn.medicare.api.entity.TimeSlotStatus;
import vn.medicare.api.repository.AppointmentRepository;
import vn.medicare.api.repository.UserRepository;
import vn.medicare.api.repository.MedicalRecordRepository;
import vn.medicare.api.repository.TimeSlotRepository;

@Service
@RequiredArgsConstructor
public class AdminRecordService {
    
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository; // Thêm repo này
    private final TimeSlotRepository timeSlotRepository; // Thêm repo này

    public List<Map<String, Object>> getAllPatients() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.PATIENT)
                .map(u -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", u.getId());
                    map.put("fullName", u.getFullName());
                    map.put("email", u.getEmail());
                    map.put("active", u.getIsActive() != null ? u.getIsActive() : true);
                    return map;
                }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(a -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", a.getId());
                    map.put("patientName", a.getPatient() != null ? a.getPatient().getFullName() : "Khách vãng lai");
                    map.put("doctorName", a.getDoctor() != null ? a.getDoctor().getFullName() : "N/A");
                    map.put("appointmentDate", a.getAppointmentDate() != null ? a.getAppointmentDate().toString() : "Chưa xếp lịch");
                    map.put("status", a.getStatus() != null ? a.getStatus().name() : "");
                    map.put("reason", a.getReason());
                    return map;
                }).collect(Collectors.toList());
    }

    // --- LOGIC MỚI SPRINT 2 ---

    // Lấy hồ sơ bệnh án
    public List<Map<String, Object>> getPatientRecords(UUID patientId) {
        return medicalRecordRepository.findByPatientIdOrderByCreatedAtDesc(patientId).stream()
            .map(r -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", r.getId());
                map.put("date", r.getCreatedAt().toString());
                map.put("doctorName", "BS. " + r.getDoctor().getFullName());
                map.put("subjective", r.getSubjective());
                map.put("objective", r.getObjective());
                map.put("vitals", r.getVitals());
                map.put("diagnosis", r.getDiagnosisIcd10());
                map.put("plan", r.getPlan());
                return map;
            }).collect(Collectors.toList());
    }

    // Cập nhật trạng thái lịch hẹn (Có kèm theo logic nhả TimeSlot nếu hủy)
    @Transactional
    public void updateAppointmentStatus(UUID appointmentId, String newStatus) {
        Appointment apt = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn"));
        
        apt.setStatus(AppointmentStatus.valueOf(newStatus));
        appointmentRepository.save(apt);

        // Nếu Admin HỦY lịch -> Cần mở lại TimeSlot
        if ("CANCELLED".equals(newStatus)) {
            TimeSlot timeSlot = apt.getTimeSlot();
            if (timeSlot != null) {
                timeSlot.setStatus(TimeSlotStatus.OPEN);
                timeSlotRepository.save(timeSlot);
            }
        }
    }
}