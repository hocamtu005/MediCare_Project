package vn.medicare.api.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import vn.medicare.api.entity.Schedule;
import vn.medicare.api.entity.TimeSlot;
import vn.medicare.api.entity.TimeSlotStatus;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, UUID> {
    
    // Hàm cũ của bạn: Lấy danh sách khung giờ xếp tăng dần theo thời gian
    List<TimeSlot> findByScheduleOrderByStartTimeAsc(Schedule schedule);

    // CÁC HÀM MỚI BỔ SUNG CHO ADMIN:
    List<TimeSlot> findByScheduleId(UUID scheduleId);
    void deleteByScheduleId(UUID scheduleId);

    @Query("SELECT ts FROM TimeSlot ts JOIN ts.schedule s WHERE s.staff.id = :doctorId AND s.workDate = :workDate AND ts.status = :status ORDER BY ts.startTime ASC")
    List<TimeSlot> findAvailableSlotsByDoctorAndDate(
            @Param("doctorId") UUID doctorId, 
            @Param("workDate") LocalDate workDate, 
            @Param("status") TimeSlotStatus status);

    boolean existsByScheduleIdAndStatus(UUID scheduleId, TimeSlotStatus status);
    
}