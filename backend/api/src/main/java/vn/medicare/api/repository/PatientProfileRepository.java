package vn.medicare.api.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import vn.medicare.api.entity.PatientProfile;
import vn.medicare.api.entity.User;

public interface PatientProfileRepository extends JpaRepository<PatientProfile, UUID> {
    Optional<PatientProfile> findByUser(User user);
}