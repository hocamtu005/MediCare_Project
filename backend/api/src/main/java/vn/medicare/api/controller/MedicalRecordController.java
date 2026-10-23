package vn.medicare.api.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.medicare.api.dto.MedicalRecordRequest;
import vn.medicare.api.dto.MedicalRecordResponse;
import vn.medicare.api.entity.MedicalRecord;
import vn.medicare.api.repository.MedicalRecordRepository;
import vn.medicare.api.service.MedicalRecordService;
import vn.medicare.api.service.PdfService;

@RestController
@RequestMapping("/api/v1/medical-records")
@RequiredArgsConstructor
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;
    private final PdfService pdfService; // Đã được di chuyển vào bên trong class
    private final MedicalRecordRepository medicalRecordRepository; // Đã thêm repository để tìm bệnh án

    // API: Bệnh nhân tự lấy hồ sơ của mình
    @GetMapping("/my-records")
    public ResponseEntity<List<MedicalRecordResponse>> getMyRecords() {
        return ResponseEntity.ok(medicalRecordService.getMyRecords());
    }

    // API tải PDF
    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadPrescriptionPdf(@PathVariable UUID id) {
        // Tìm bệnh án
        MedicalRecord record = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ bệnh án"));

        byte[] pdfBytes = pdfService.generatePrescriptionPdf(record);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"Toa_Thuoc_Medicare.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
    
    // Thêm 2 API này vào bên trong class MedicalRecordController
    @GetMapping("/appointment/{appointmentId}/pdf")
    public ResponseEntity<byte[]> downloadPdfByAppointment(@PathVariable UUID appointmentId) {
        MedicalRecord record = medicalRecordRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new RuntimeException("Chưa có hồ sơ bệnh án cho ca khám này"));

        byte[] pdfBytes = pdfService.generatePrescriptionPdf(record);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"Toa_Thuoc_Medicare.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicalRecordResponse>> getPatientRecords(@PathVariable UUID patientId) {
        return ResponseEntity.ok(medicalRecordService.getPatientRecords(patientId));
    }

    // API: Bác sĩ tạo hồ sơ mới
    @PostMapping("/create")
    public ResponseEntity<?> createRecord(@RequestBody MedicalRecordRequest request) {
        try {
            // In thử ra màn hình console xem Spring có nhận được ID không
            System.out.println("ID Bệnh nhân gửi lên: - MedicalRecordController.java:78" + request.getPatientId());
            
            return ResponseEntity.ok(medicalRecordService.createRecord(request));
        } catch (Exception e) {
            // Ném thẳng lỗi chi tiết ra Thunder Client
            String errorMessage = "Lỗi Backend: " + e.getMessage();
            if (e.getCause() != null) {
                errorMessage += " | Nguyên nhân sâu xa: " + e.getCause().getMessage();
            }
            return ResponseEntity.internalServerError().body(errorMessage);
        }
    }
}