package vn.medicare.api.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.time.LocalTime;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.medicare.api.entity.Schedule;
import vn.medicare.api.entity.User;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, UUID> {
    
    List<Schedule> findByWorkDate(LocalDate workDate);

    // ĐÃ ĐỔI TÊN HÀM TỪ Doctor SANG Staff
    List<Schedule> findByStaffOrderByWorkDateDesc(User staff);
    boolean existsByStaffAndWorkDate(User staff, LocalDate workDate);

    List<Schedule> findByWorkDateBetween(LocalDate startDate, LocalDate endDate);
    
    // ĐÃ ĐỔI TÊN HÀM
    List<Schedule> findByStaffIdAndWorkDateBetween(UUID staffId, LocalDate startDate, LocalDate endDate);
    
    // ĐÃ ĐỔI TÊN HÀM
    boolean existsByStaffIdAndWorkDate(UUID staffId, LocalDate workDate);

    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM Schedule s " +
           "WHERE s.room.id = :roomId AND s.workDate = :workDate " +
           "AND (s.startTime < :endTime AND s.endTime > :startTime)")
    boolean existsRoomConflict(@Param("roomId") UUID roomId, 
                               @Param("workDate") LocalDate workDate, 
                               @Param("startTime") LocalTime startTime, 
                               @Param("endTime") LocalTime endTime);
}