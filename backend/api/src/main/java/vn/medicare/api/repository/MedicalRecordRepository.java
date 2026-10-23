package vn.medicare.api.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import vn.medicare.api.entity.MedicalRecord;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, UUID> {
    List<MedicalRecord> findByPatientIdOrderByCreatedAtDesc(UUID patientId);
    
    // Tìm bệnh án theo lịch khám để xuất PDF
    Optional<MedicalRecord> findByAppointmentId(UUID appointmentId); 
}