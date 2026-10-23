package vn.medicare.api.controller;

import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.medicare.api.service.AdminScheduleService;

@RestController
@RequestMapping("/admin/schedules")
@RequiredArgsConstructor
public class AdminScheduleController {

    private final AdminScheduleService adminScheduleService;

    @GetMapping
    public ResponseEntity<?> getAllSchedules() {
        try {
            return ResponseEntity.ok(adminScheduleService.getAllSchedules());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createSchedule(@RequestBody Map<String, String> request) {
        try {
            adminScheduleService.createSchedule(request);
            return ResponseEntity.ok().body("{\"message\": \"Tạo lịch làm việc thành công\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSchedule(@PathVariable UUID id) {
        try {
            adminScheduleService.deleteSchedule(id);
            return ResponseEntity.ok().body("{\"message\": \"Hủy lịch thành công\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}