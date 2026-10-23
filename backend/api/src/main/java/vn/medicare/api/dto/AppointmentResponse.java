package vn.medicare.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AppointmentResponse {
    private UUID id;
    private String doctorName;
    private LocalDateTime appointmentDate;
    private String status;
    private String notes;
}