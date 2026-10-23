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
import vn.medicare.api.service.ClinicService;

@RestController
@RequestMapping("/admin/clinics") // Đã cấu hình phân quyền Admin trong SecurityConfig
@RequiredArgsConstructor
public class ClinicAdminController {

    private final ClinicService clinicService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(clinicService.getAllClinics());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, String> request) {
        try {
            return ResponseEntity.ok(clinicService.createClinic(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable UUID id, @RequestBody Map<String, String> request) {
        try {
            return ResponseEntity.ok(clinicService.updateClinic(id, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleStatus(@PathVariable UUID id) {
        try {
            String message = clinicService.toggleClinicStatus(id);
            return ResponseEntity.ok().body("{\"message\": \"" + message + "\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}