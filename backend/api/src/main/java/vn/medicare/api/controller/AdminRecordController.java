package vn.medicare.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import vn.medicare.api.service.AdminRecordService;

@RestController
@RequestMapping("/admin/records")
@RequiredArgsConstructor
public class AdminRecordController {
    
    private final AdminRecordService adminRecordService;

    @GetMapping("/patients")
    public ResponseEntity<?> getPatients() {
        return ResponseEntity.ok(adminRecordService.getAllPatients());
    }

    @GetMapping("/appointments")
    public ResponseEntity<?> getAppointments() {
        return ResponseEntity.ok(adminRecordService.getAllAppointments());
    }

    // --- API MỚI CHO SPRINT 2 ---

    // 1. Lấy chi tiết lịch sử khám bệnh của một bệnh nhân
    @GetMapping("/patients/{patientId}/emr")
    public ResponseEntity<?> getPatientMedicalRecords(@PathVariable UUID patientId) {
        try {
            return ResponseEntity.ok(adminRecordService.getPatientRecords(patientId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi tải hồ sơ: " + e.getMessage());
        }
    }

    // 2. Cập nhật trạng thái lịch hẹn
    @PutMapping("/appointments/{appointmentId}/status")
    public ResponseEntity<?> updateAppointmentStatus(
            @PathVariable UUID appointmentId, 
            @RequestParam String status) {
        try {
            adminRecordService.updateAppointmentStatus(appointmentId, status);
            return ResponseEntity.ok().body("{\"message\": \"Cập nhật trạng thái thành công\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}