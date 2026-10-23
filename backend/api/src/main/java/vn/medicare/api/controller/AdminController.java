package vn.medicare.api.controller;

import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.medicare.api.service.AdminService;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/staff")
    public ResponseEntity<?> getStaffList() {
        try {
            return ResponseEntity.ok(adminService.getAllStaff());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @PutMapping("/staff/{id}/toggle-status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable UUID id) {
        try {
            String message = adminService.toggleUserStatus(id);
            return ResponseEntity.ok().body("{\"message\": \"" + message + "\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/staff")
    public ResponseEntity<?> createStaff(@RequestBody Map<String, String> request) {
        try {
            adminService.createStaff(request);
            return ResponseEntity.ok().body("{\"message\": \"Tạo tài khoản thành công\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/staff/{id}")
    public ResponseEntity<?> updateStaff(@PathVariable UUID id, @RequestBody Map<String, String> request) {
        try {
            adminService.updateStaff(id, request);
            return ResponseEntity.ok().body("{\"message\": \"Cập nhật thành công\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/staff/{id}")
    public ResponseEntity<?> deleteStaff(@PathVariable UUID id) {
        try {
            adminService.deleteStaff(id);
            return ResponseEntity.ok().body("{\"message\": \"Xóa tài khoản thành công\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}