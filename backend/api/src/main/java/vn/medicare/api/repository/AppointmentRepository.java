package vn.medicare.api.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.medicare.api.entity.Appointment;
import vn.medicare.api.entity.AppointmentStatus;
import vn.medicare.api.entity.User;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    
    // Đã đổi thành LEFT JOIN cho truy vấn của Bệnh nhân
    @Query("SELECT a FROM Appointment a LEFT JOIN a.timeSlot ts LEFT JOIN ts.schedule s WHERE a.patient = :patient ORDER BY s.workDate DESC, ts.startTime DESC, a.createdAt DESC")
    List<Appointment> findByPatientOrderByAppointmentDateDesc(@Param("patient") User patient);
    
    // Đã đổi thành LEFT JOIN cho truy vấn danh sách tổng của Bác sĩ
    @Query("SELECT a FROM Appointment a LEFT JOIN a.timeSlot ts LEFT JOIN ts.schedule s WHERE a.doctor = :doctor ORDER BY s.workDate ASC, ts.startTime ASC, a.createdAt ASC")
    List<Appointment> findByDoctorOrderByAppointmentDateAsc(@Param("doctor") User doctor);
    
    // Đã đổi thành LEFT JOIN cho truy vấn lọc theo trạng thái của Bác sĩ (hàm getPendingAppointments)
    @Query("SELECT a FROM Appointment a LEFT JOIN a.timeSlot ts LEFT JOIN ts.schedule s WHERE a.doctor = :doctor AND a.status = :status ORDER BY s.workDate ASC, ts.startTime ASC, a.createdAt ASC")
    List<Appointment> findByDoctorAndStatusOrderByAppointmentDateAsc(@Param("doctor") User doctor, @Param("status") AppointmentStatus status);

    // Truy vấn dành cho Lễ tân
    @Query("SELECT a FROM Appointment a LEFT JOIN a.timeSlot ts LEFT JOIN ts.schedule s " +
           "WHERE (s.workDate BETWEEN CAST(:start AS date) AND CAST(:end AS date)) " +
           "OR (a.timeSlot IS NULL AND a.createdAt BETWEEN :start AND :end) " +
           "ORDER BY s.workDate ASC, ts.startTime ASC, a.createdAt ASC")
    List<Appointment> findByAppointmentDateBetweenOrderByAppointmentDateAsc(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}