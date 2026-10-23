package vn.medicare.api.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class AppointmentRequest {
    private UUID doctorId;
    private String appointmentDate; // Nhận chuỗi định dạng "yyyy-MM-dd HH:mm" từ Frontend
    private String notes;
}