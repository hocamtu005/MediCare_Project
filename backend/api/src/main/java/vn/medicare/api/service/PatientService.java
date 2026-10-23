package vn.medicare.api.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.medicare.api.entity.PatientProfile;
import vn.medicare.api.entity.User;
import vn.medicare.api.repository.AppointmentRepository;
import vn.medicare.api.repository.MedicalRecordRepository;
import vn.medicare.api.repository.PatientProfileRepository;
import vn.medicare.api.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class PatientService {
    private final UserRepository userRepository;
    private final PatientProfileRepository profileRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository; // Đã thêm dòng này để hết báo lỗi

    public Map<String, Object> getProfile(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        PatientProfile profile = profileRepository.findByUser(user).orElse(new PatientProfile());
        
        Map<String, Object> data = new HashMap<>();
        data.put("fullName", user.getFullName());
        data.put("phone", user.getPhone());
        data.put("avatarUrl", user.getAvatarUrl());
        data.put("gender", profile.getGender());
        data.put("dateOfBirth", profile.getDateOfBirth());
        data.put("idNumber", profile.getIdNumber());
        data.put("address", profile.getAddress());
        data.put("bloodType", profile.getBloodType());
        data.put("allergies", profile.getAllergies());
        data.put("chronicConditions", profile.getChronicConditions());
        return data;
    }

    @Transactional
    public void updateProfile(String email, String fullName, String phone, String avatarUrl, 
                            String gender, String dob, String idNumber, String address, 
                            String bloodType, String allergies, String chronic) {
        User user = userRepository.findByEmail(email).orElseThrow();
        user.setFullName(fullName);
        user.setPhone(phone);
        if (avatarUrl != null) user.setAvatarUrl(avatarUrl);
        userRepository.save(user);

        PatientProfile profile = profileRepository.findByUser(user).orElse(new PatientProfile());
        profile.setUser(user);
        profile.setGender(gender);
        profile.setDateOfBirth(dob);
        profile.setIdNumber(idNumber);
        profile.setAddress(address);
        profile.setBloodType(bloodType);
        profile.setAllergies(allergies);
        profile.setChronicConditions(chronic);
        profileRepository.save(profile);
    }

    public List<Map<String, Object>> getMyMedicalRecords(String email) {
        User patient = userRepository.findByEmail(email).orElseThrow();
        // Lấy danh sách bệnh án đã chốt (COMPLETED) của bệnh nhân này
        var records = medicalRecordRepository.findByPatientIdOrderByCreatedAtDesc(patient.getId());

        return records.stream()
                .filter(r -> "COMPLETED".equals(r.getStatus()))
                .map(r -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", r.getId());
                    map.put("createdAt", r.getCreatedAt().toString());
                    map.put("doctorName", r.getDoctor().getFullName());
                    
                    // Ánh xạ tên biến Backend (SOAP) sang Frontend
                    map.put("diagnosis", r.getDiagnosisIcd10()); 
                    map.put("treatmentPlan", r.getPlan());
                    map.put("notes", "Lý do: " + r.getSubjective() + " | Sinh hiệu: " + r.getVitals()); 
                    return map;
                })
                .toList();
    }

    // --- ĐÃ BỔ SUNG: XỬ LÝ CHỈ SỐ SỨC KHỎE ---
    public Map<String, Object> getHealthProfile(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        PatientProfile profile = profileRepository.findByUser(user).orElse(new PatientProfile());
        
        return Map.of(
            "bloodType", profile.getBloodType() != null ? profile.getBloodType() : "",
            "bloodPressure", profile.getBloodPressure() != null ? profile.getBloodPressure() : "",
            "height", profile.getHeight() != null ? profile.getHeight() : "",
            "weight", profile.getWeight() != null ? profile.getWeight() : ""
        );
    }

    @Transactional
    public Map<String, Object> updateHealthProfile(String email, String bloodType, String bloodPressure, String height, String weight) {
        User user = userRepository.findByEmail(email).orElseThrow();
        PatientProfile profile = profileRepository.findByUser(user).orElse(new PatientProfile());
        
        profile.setUser(user);
        profile.setBloodType(bloodType);
        profile.setBloodPressure(bloodPressure);
        profile.setHeight(height);
        profile.setWeight(weight);
        
        profileRepository.save(profile);
        
        return getHealthProfile(email);
    }
}