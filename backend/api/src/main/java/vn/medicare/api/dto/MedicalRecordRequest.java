package vn.medicare.api.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@Builder 
@AllArgsConstructor 
@NoArgsConstructor
public class MedicalRecordRequest {
    private UUID appointmentId; // Thêm trường này để mapping với Entity mới
    private UUID patientId;
    private String diagnosis;
    private String treatmentPlan;
    private String notes;
}