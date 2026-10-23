package vn.medicare.api.controller;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.medicare.api.dto.UserResponse;
import vn.medicare.api.entity.User;
import vn.medicare.api.repository.UserRepository;
import vn.medicare.api.service.UserService;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/patients")
    public ResponseEntity<List<UserResponse>> getAllPatients() {
        return ResponseEntity.ok(userService.getAllPatients());
    }

    // --- 3 API MỚI DÀNH CHO TRANG CÀI ĐẶT TÀI KHOẢN ---

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));
        return ResponseEntity.ok(Map.of(
                "email", user.getEmail(),
                "fullName", user.getFullName()
        ));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Principal principal, @RequestBody Map<String, String> request) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        user.setFullName(request.get("fullName"));
        userRepository.save(user);
        return ResponseEntity.ok("Cập nhật thông tin thành công");
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(Principal principal, @RequestBody Map<String, String> request) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        
        String oldPass = request.get("oldPassword");
        String newPass = request.get("newPassword");

        if (!passwordEncoder.matches(oldPass, user.getPassword())) {
            return ResponseEntity.badRequest().body("Mật khẩu cũ không chính xác!");
        }

        user.setPassword(passwordEncoder.encode(newPass));
        userRepository.save(user);
        return ResponseEntity.ok("Đổi mật khẩu thành công!");
    }
}