package vn.medicare.api.controller;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.medicare.api.service.ReceptionistService;

@RestController
@RequestMapping("/api/v1/receptionist")
@RequiredArgsConstructor
public class ReceptionistController {
    
    private final ReceptionistService receptionistService;

    @GetMapping("/appointments/today")
    public ResponseEntity<?> getTodaysAppointments() {
        try {
            return ResponseEntity.ok(receptionistService.getTodaysAppointments());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi lấy danh sách bệnh nhân: " + e.getMessage());
        }
    }

    @PostMapping("/appointments/{id}/check-in")
    public ResponseEntity<?> checkInPatient(@PathVariable UUID id, @RequestBody(required = false) Map<String, String> payload) {
        try {
            String note = payload != null ? payload.getOrDefault("note", "") : "";
            return ResponseEntity.ok(receptionistService.checkInPatient(id, note));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi Check-in: " + e.getMessage());
        }
    }

    @PostMapping("/appointments/{id}/pay")
    public ResponseEntity<?> processPayment(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(receptionistService.processPayment(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi Thanh toán: " + e.getMessage());
        }
    }

    @PostMapping("/appointments/{id}/vitals")
    public ResponseEntity<?> saveVitals(@PathVariable UUID id, @RequestBody Map<String, String> vitals) {
        try {
            return ResponseEntity.ok(receptionistService.saveVitals(id, vitals));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi lưu sinh hiệu: " + e.getMessage());
        }
    }

    @PostMapping("/appointments/walk-in")
    public ResponseEntity<?> createWalkInAppointment(@RequestBody Map<String, String> data) {
        try {
            return ResponseEntity.ok(receptionistService.createWalkInAppointment(data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi tạo lịch: " + e.getMessage());
        }
    }

    @GetMapping("/appointments/{id}/receipt")
    public ResponseEntity<byte[]> downloadReceipt(@PathVariable UUID id) {
        try {
            byte[] pdfBytes = receptionistService.generateReceiptPdf(id);
            
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "Bien_lai.pdf");
            
            return ResponseEntity.ok().headers(headers).body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            return ResponseEntity.ok(receptionistService.getDashboardStats(date));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi tải thống kê: " + e.getMessage());
        }
    }

    @GetMapping("/doctors/today")
    public ResponseEntity<?> getTodaysDoctorSchedules() {
        try {
            return ResponseEntity.ok(receptionistService.getTodaysDoctorSchedules());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi tải lịch Bác sĩ: " + e.getMessage());
        }
    }
}