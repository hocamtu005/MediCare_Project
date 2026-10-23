package vn.medicare.api.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.medicare.api.entity.Role;
import vn.medicare.api.entity.User;
import vn.medicare.api.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; 

    public List<Map<String, Object>> getAllStaff() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() != Role.PATIENT)
                .map(user -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", user.getId());
                    map.put("fullName", user.getFullName());
                    map.put("email", user.getEmail());
                    map.put("role", user.getRole().name());
                    map.put("active", user.getIsActive() != null ? user.getIsActive() : true);
                    map.put("specialtyId", user.getSpecialtyId()); // Chỉ giữ lại Chuyên khoa
                    return map;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public String toggleUserStatus(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        
        boolean currentStatus = user.getIsActive() != null ? user.getIsActive() : true;
        user.setIsActive(!currentStatus);
        userRepository.save(user);
        
        return user.getIsActive() ? "Đã mở khóa tài khoản" : "Đã khóa tài khoản";
    }

    @Transactional
    public void createStaff(Map<String, String> data) {
        if (userRepository.findByEmail(data.get("email")).isPresent()) {
            throw new RuntimeException("Email này đã tồn tại trong hệ thống!");
        }
        User user = new User();
        user.setFullName(data.get("fullName"));
        user.setEmail(data.get("email"));
        user.setRole(Role.valueOf(data.get("role"))); 
        user.setPassword(passwordEncoder.encode("medicare@123")); 
        user.setIsActive(true);

        if (user.getRole() == Role.DOCTOR && data.containsKey("specialtyId") && !data.get("specialtyId").isEmpty()) {
            user.setSpecialtyId(UUID.fromString(data.get("specialtyId")));
        }
        userRepository.save(user);
    }

    @Transactional
    public void updateStaff(UUID id, Map<String, String> data) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        
        user.setFullName(data.get("fullName"));
        user.setRole(Role.valueOf(data.get("role")));

        if (user.getRole() == Role.DOCTOR && data.containsKey("specialtyId") && !data.get("specialtyId").isEmpty()) {
            user.setSpecialtyId(UUID.fromString(data.get("specialtyId")));
        } else {
            user.setSpecialtyId(null);
        }
        userRepository.save(user);
    }

    @Transactional
    public void deleteStaff(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        
        // Kiểm tra bảo vệ: Không cho phép xóa chính Admin đang thao tác (hoặc Admin gốc)
        if ("admin@medicare.vn".equals(user.getEmail())) {
            throw new RuntimeException("Không thể xóa tài khoản Quản trị viên hệ thống!");
        }

        try {
            userRepository.delete(user);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            throw new RuntimeException("Không thể xóa nhân sự này vì đã có dữ liệu ràng buộc (Lịch khám, Lịch trực). Vui lòng Khóa tài khoản thay vì Xóa.");
        }
    }
}