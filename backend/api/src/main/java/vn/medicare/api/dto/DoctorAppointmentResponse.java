package vn.medicare.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class DoctorAppointmentResponse {
    private UUID id;
    private UUID patientId;
    private String patientName;
    private String patientPhone;
    private LocalDateTime appointmentDate;
    private String status;
    private String reason; // Lý do khám (thay thế cho notes)
}