package vn.medicare.api.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID; // Cần import thêm Role

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.medicare.api.entity.Role;
import vn.medicare.api.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    
    // Thêm dòng này để lấy danh sách User theo Role (VD: Lọc toàn bộ PATIENT)
    List<User> findByRole(Role role);
    // Tìm danh sách bác sĩ thuộc một chuyên khoa cụ thể
    List<User> findBySpecialtyId(UUID specialtyId);
}