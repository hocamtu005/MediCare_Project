package vn.medicare.api.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import vn.medicare.api.service.PatientService;

@RestController
@RequestMapping("/api/v1/patient")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Principal principal) {
        return ResponseEntity.ok(patientService.getProfile(principal.getName()));
    }

    @PostMapping("/profile/update")
    public ResponseEntity<?> updateProfileWithImage(
            Principal principal,
            @RequestParam("fullName") String fullName,
            @RequestParam("phone") String phone,
            @RequestParam("gender") String gender,
            @RequestParam("dob") String dob,
            @RequestParam("idNumber") String idNumber,
            @RequestParam("address") String address,
            @RequestParam("bloodType") String bloodType,
            @RequestParam("allergies") String allergies,
            @RequestParam("chronicConditions") String chronic,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "avatarUrl", required = false) String avatarUrl) {
        try {
            String finalAvatarUrl = avatarUrl;
            
            if (file != null && !file.isEmpty()) {
                String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                Path uploadPath = Paths.get("uploads");
                if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                finalAvatarUrl = "http://localhost:8080/uploads/" + fileName;
            }

            patientService.updateProfile(
                principal.getName(), fullName, phone, finalAvatarUrl,
                gender, dob, idNumber, address, bloodType, allergies, chronic
            );
            return ResponseEntity.ok("Cập nhật hồ sơ bệnh nhân thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @GetMapping("/records")
    public ResponseEntity<?> getMyRecords(Principal principal) {
        return ResponseEntity.ok(patientService.getMyMedicalRecords(principal.getName()));
    }

    // --- ĐÃ BỔ SUNG: API LẤY CHỈ SỐ CƠ THỂ ---
    @GetMapping("/health-profile")
    public ResponseEntity<?> getHealthProfile(Principal principal) {
        return ResponseEntity.ok(patientService.getHealthProfile(principal.getName()));
    }

    // --- ĐÃ BỔ SUNG: API CẬP NHẬT CHỈ SỐ CƠ THỂ ---
    @PostMapping("/health-profile")
    public ResponseEntity<?> updateHealthProfile(
            Principal principal,
            @RequestBody Map<String, String> payload) {
        try {
            return ResponseEntity.ok(patientService.updateHealthProfile(
                principal.getName(),
                payload.get("bloodType"),
                payload.get("bloodPressure"),
                payload.get("height"),
                payload.get("weight")
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}