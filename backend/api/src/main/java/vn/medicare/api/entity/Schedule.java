package vn.medicare.api.entity;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "schedules")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "staff_id", nullable = false) // ĐÃ ĐỔI THÀNH staff_id
    private User staff; // ĐÃ ĐỔI TÊN BIẾN THÀNH staff

    @Column(nullable = false)
    private LocalDate workDate;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = true) // Của điều dưỡng có thể không có thời lượng slot
    private Integer slotDuration; 

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = true) 
    private Room room;
}