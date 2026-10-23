package vn.medicare.api.controller;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.medicare.api.entity.Appointment;
import vn.medicare.api.entity.AppointmentStatus;
import vn.medicare.api.entity.AppointmentType;
import vn.medicare.api.entity.Role;
import vn.medicare.api.entity.Specialty;
import vn.medicare.api.entity.TimeSlot;
import vn.medicare.api.entity.TimeSlotStatus;
import vn.medicare.api.entity.User;
import vn.medicare.api.repository.AppointmentRepository;
import vn.medicare.api.repository.SpecialtyRepository;
import vn.medicare.api.repository.TimeSlotRepository;
import vn.medicare.api.repository.UserRepository;

@RestController
@RequestMapping("/api/v1/booking")
@RequiredArgsConstructor
public class BookingController {

    private final SpecialtyRepository specialtyRepository;
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final TimeSlotRepository timeSlotRepository; 

    @GetMapping("/specialties")
    public ResponseEntity<List<Specialty>> getAllSpecialties() {
        return ResponseEntity.ok(specialtyRepository.findAll());
    }

    @GetMapping("/doctors")
    public ResponseEntity<?> getDoctorsBySpecialty(@RequestParam UUID specialtyId) {
        // Lọc lấy danh sách, nhưng chỉ trả về user có role là DOCTOR và đang active
        List<User> doctors = userRepository.findBySpecialtyId(specialtyId).stream()
                .filter(u -> u.getRole() == Role.DOCTOR && (u.getIsActive() == null || u.getIsActive()))
                .toList();
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/available-slots")
    public ResponseEntity<?> getAvailableSlots(
            @RequestParam UUID doctorId, 
            @RequestParam String date) {
        try {
            LocalDate workDate = LocalDate.parse(date);
            List<TimeSlot> slots = timeSlotRepository.findAvailableSlotsByDoctorAndDate(
                    doctorId, workDate, TimeSlotStatus.OPEN);
            return ResponseEntity.ok(slots);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi tải khung giờ: " + e.getMessage());
        }
    }

    @PostMapping("/create")
    @Transactional // Đảm bảo toàn vẹn dữ liệu: lỗi ở đâu thì rollback toàn bộ ở đó
    public ResponseEntity<?> bookAppointment(Principal principal, @RequestBody Map<String, String> payload) {
        try {
            User patient = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản bệnh nhân"));

            User doctor = userRepository.findById(UUID.fromString(payload.get("doctorId")))
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ"));

            TimeSlot timeSlot = timeSlotRepository.findById(UUID.fromString(payload.get("timeSlotId")))
                    .orElseThrow(() -> new RuntimeException("Khung giờ không tồn tại"));

            // Xác thực: Đảm bảo slot này thực sự thuộc về Bác sĩ đã gửi lên
            if (!timeSlot.getSchedule().getStaff().getId().equals(doctor.getId())) {
                return ResponseEntity.badRequest().body("Khung giờ không hợp lệ hoặc không thuộc về bác sĩ này.");
            }

            // Kiểm tra trạng thái Slot
            if (timeSlot.getStatus() != TimeSlotStatus.OPEN) {
                return ResponseEntity.status(409).body("Rất tiếc, khung giờ này đã có người đặt. Vui lòng chọn giờ khác.");
            }

            // Tạo Appointment
            Appointment appointment = Appointment.builder()
                    .patient(patient)
                    .doctor(doctor)
                    .timeSlot(timeSlot)
                    .type(AppointmentType.OFFLINE)
                    .status(AppointmentStatus.PENDING)
                    .reason(payload.get("reason"))
                    .build();

            appointmentRepository.save(appointment);

            // Khóa Slot lại thành BOOKED
            timeSlot.setStatus(TimeSlotStatus.BOOKED);
            timeSlotRepository.save(timeSlot);

            return ResponseEntity.ok("{\"message\": \"Đặt lịch khám thành công!\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi đặt lịch: " + e.getMessage());
        }
    }

    @PostMapping("/cancel/{id}")
    @Transactional
    public ResponseEntity<?> cancelAppointment(Principal principal, @PathVariable UUID id) {
        try {
            User patient = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản bệnh nhân"));

            Appointment appointment = appointmentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn"));

            // Xác thực quyền sở hữu
            if (!appointment.getPatient().getId().equals(patient.getId())) {
                return ResponseEntity.status(403).body("Bạn không có quyền hủy lịch hẹn này!");
            }

            // Chỉ cho phép hủy nếu lịch đang chờ hoặc đã xác nhận
            if (appointment.getStatus() != AppointmentStatus.PENDING && appointment.getStatus() != AppointmentStatus.CONFIRMED) {
                return ResponseEntity.badRequest().body("Không thể hủy lịch hẹn ở trạng thái hiện tại.");
            }

            // 1. Chuyển trạng thái sang CANCELLED
            appointment.setStatus(AppointmentStatus.CANCELLED);
            appointmentRepository.save(appointment);

            // 2. Mở lại Slot cho người khác đặt
            TimeSlot timeSlot = appointment.getTimeSlot();
            if (timeSlot != null) {
                timeSlot.setStatus(TimeSlotStatus.OPEN);
                timeSlotRepository.save(timeSlot);
            }

            return ResponseEntity.ok("{\"message\": \"Hủy lịch khám thành công!\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi hủy lịch: " + e.getMessage());
        }
    }
}