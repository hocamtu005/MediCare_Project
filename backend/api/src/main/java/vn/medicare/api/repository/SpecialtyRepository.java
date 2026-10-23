package vn.medicare.api.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import vn.medicare.api.entity.Specialty;

public interface SpecialtyRepository extends JpaRepository<Specialty, UUID> {
    // Kiểm tra xem tên chuyên khoa đã tồn tại chưa
    boolean existsByName(String name);
}