package vn.medicare.api.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "appointments")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private User doctor;

    @OneToOne
    @JoinColumn(name = "time_slot_id", nullable = true, unique = true)
    private TimeSlot timeSlot;

    @Enumerated(EnumType.STRING)
    private AppointmentType type; 

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    @Column(columnDefinition = "TEXT")
    private String reason; 
    
    @Column(name = "parent_visit_id")
    private UUID parentVisitId; 

    // BỔ SUNG LƯU THỜI GIAN CHO KHÁCH VÃNG LAI
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public java.time.LocalDateTime getAppointmentDate() {
        if (this.timeSlot != null && this.timeSlot.getSchedule() != null) {
            return java.time.LocalDateTime.of(
                this.timeSlot.getSchedule().getWorkDate(), 
                this.timeSlot.getStartTime()
            );
        }
        return this.createdAt; // Trả về thời gian vãng lai nếu không có TimeSlot
    }
}