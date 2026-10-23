package vn.medicare.api.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import vn.medicare.api.dto.DoctorAppointmentResponse;
import vn.medicare.api.service.DoctorService;

@RestController
@RequestMapping("/api/v1/doctor")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping("/schedule")
    public ResponseEntity<List<DoctorAppointmentResponse>> getSchedule(Principal principal) {
        return ResponseEntity.ok(doctorService.getDoctorSchedule(principal.getName()));
    }

    // Cập nhật trạng thái (Gọi khám, Hoàn tất...)
    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable UUID id, 
            @RequestParam String status, 
            Principal principal) {
        try {
            doctorService.updateAppointmentStatus(id, principal.getName(), status);
            return ResponseEntity.ok("Cập nhật trạng thái thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Lấy danh sách lịch chờ duyệt
    @GetMapping("/appointments/pending")
    public ResponseEntity<?> getPending(Principal principal) {
        return ResponseEntity.ok(doctorService.getPendingAppointments(principal.getName()));
    }

    // Lấy thông tin hồ sơ bác sĩ
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Principal principal) {
        return ResponseEntity.ok(doctorService.getProfile(principal.getName()));
    }

    // Cập nhật hồ sơ (Hỗ trợ upload file ảnh từ máy tính)
    @PostMapping("/profile/update")
    public ResponseEntity<?> updateProfileWithImage(
            Principal principal, 
            @RequestParam("phone") String phone, 
            @RequestParam("bio") String bio, 
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "avatarUrl", required = false) String avatarUrl) {
        try {
            String finalAvatarUrl = avatarUrl;
            
            // Xử lý lưu file ảnh xuống thư mục 'uploads' của server
            if (file != null && !file.isEmpty()) {
                String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                Path uploadPath = Paths.get("uploads");
                
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                
                // Trả về đường dẫn để React có thể hiển thị ảnh
                finalAvatarUrl = "http://localhost:8080/uploads/" + fileName;
            }

            doctorService.updateProfile(principal.getName(), phone, bio, finalAvatarUrl);
            return ResponseEntity.ok("Cập nhật hồ sơ thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats(Principal principal) {
        return ResponseEntity.ok(doctorService.getDashboardStats(principal.getName()));
    }
    
}