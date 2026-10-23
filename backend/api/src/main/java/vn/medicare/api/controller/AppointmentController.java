package vn.medicare.api.controller;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.medicare.api.dto.AppointmentResponse;
import vn.medicare.api.entity.Appointment;
import vn.medicare.api.entity.AppointmentStatus;
import vn.medicare.api.repository.AppointmentRepository;
import vn.medicare.api.service.AppointmentService;

@RestController
@RequestMapping("/api/v1/appointments")
@RequiredArgsConstructor
public class AppointmentController {
    
    private final AppointmentService appointmentService;
    private final AppointmentRepository appointmentRepository;

    @GetMapping("/my-appointments")
    public ResponseEntity<List<AppointmentResponse>> getMyAppointments() {
        return ResponseEntity.ok(appointmentService.getMyAppointments());
    }

    // API HỦY LỊCH KHÁM
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(@PathVariable UUID id, Principal principal) {
        try {
            Appointment appointment = appointmentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch khám"));
            
            // 1. Kiểm tra xem lịch này có đúng của bệnh nhân đang đăng nhập không
            if (!appointment.getPatient().getEmail().equals(principal.getName())) {
                return ResponseEntity.status(403).body("Bạn không có quyền hủy lịch khám này!");
            }

            // 2. Kiểm tra quy tắc 2 tiếng
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime aptTime = appointment.getAppointmentDate();
            
            if (now.plusHours(2).isAfter(aptTime)) {
                return ResponseEntity.badRequest().body("Bạn chỉ có thể hủy lịch khám trước 2 tiếng!");
            }

            // 3. Tiến hành hủy
            appointment.setStatus(AppointmentStatus.CANCELLED);
            appointmentRepository.save(appointment);
            
            return ResponseEntity.ok("Hủy lịch khám thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}