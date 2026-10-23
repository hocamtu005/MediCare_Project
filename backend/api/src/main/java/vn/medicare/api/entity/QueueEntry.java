package vn.medicare.api.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "queue_entries")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class QueueEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @Column(name = "queue_number", nullable = false)
    private Integer queueNumber; // Số thứ tự khám

    private LocalDateTime checkedInAt; // Lễ tân bấm check-in lúc mấy giờ
    private LocalDateTime calledAt; // Bác sĩ gọi vào phòng lúc mấy giờ

    @Builder.Default
    private Boolean isPriority = false; // Ca ưu tiên (người già, cấp cứu)

    private String priorityReason; // Lý do ưu tiên
}