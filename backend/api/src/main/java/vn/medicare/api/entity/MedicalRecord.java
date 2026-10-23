package vn.medicare.api.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "visits") // Đổi tên bảng thành visits cho chuẩn nghiệp vụ
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class MedicalRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment; // 1 ca khám = 1 lịch hẹn

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private User doctor;

    // --- CẤU TRÚC BỆNH ÁN SOAP ---
    
    @Column(columnDefinition = "TEXT")
    private String subjective; // S - Chủ quan: Lý do khám, lời khai bệnh nhân

    @Column(columnDefinition = "TEXT")
    private String objective; // O - Khách quan: Triệu chứng lâm sàng bác sĩ thấy

    @Column(columnDefinition = "TEXT")
    private String vitals; // Sinh hiệu (Lưu chuỗi JSON: Huyết áp, nhịp tim, SpO2)

    private String diagnosisIcd10; // A - Đánh giá: Mã bệnh ICD-10 hoặc Chẩn đoán sơ bộ

    @Column(columnDefinition = "TEXT")
    private String plan; // P - Kế hoạch: Phác đồ, chỉ định, lời dặn

    // --- QUẢN LÝ PHIÊN BẢN ---
    private String status; // DRAFT (Lưu nháp), COMPLETED (Chốt hồ sơ)
    
    @Builder.Default
    private Integer revision = 1; // Số lần chỉnh sửa

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}