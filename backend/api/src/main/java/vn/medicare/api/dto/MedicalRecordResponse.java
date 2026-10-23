package vn.medicare.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MedicalRecordResponse {
    private UUID id;
    private String doctorName;
    private String diagnosis;
    private String treatmentPlan;
    private String notes;
    private LocalDateTime createdAt;
}