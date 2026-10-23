package vn.medicare.api.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import vn.medicare.api.entity.Clinic;

public interface ClinicRepository extends JpaRepository<Clinic, UUID> {
    boolean existsByName(String name);
}