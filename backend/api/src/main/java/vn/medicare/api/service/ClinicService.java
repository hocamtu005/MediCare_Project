package vn.medicare.api.service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.medicare.api.entity.Clinic;
import vn.medicare.api.repository.ClinicRepository;

@Service
@RequiredArgsConstructor
public class ClinicService {

    private final ClinicRepository clinicRepository;

    public List<Clinic> getAllClinics() {
        return clinicRepository.findAll();
    }

    @Transactional
    public Clinic createClinic(Map<String, String> data) {
        if (clinicRepository.existsByName(data.get("name"))) {
            throw new RuntimeException("Tên cơ sở đã tồn tại!");
        }
        Clinic clinic = Clinic.builder()
                .name(data.get("name"))
                .address(data.get("address"))
                .phone(data.get("phone"))
                .email(data.get("email"))
                .isActive(true)
                .build();
        return clinicRepository.save(clinic);
    }

    @Transactional
    public Clinic updateClinic(UUID id, Map<String, String> data) {
        Clinic clinic = clinicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cơ sở!"));
        
        clinic.setName(data.get("name"));
        clinic.setAddress(data.get("address"));
        clinic.setPhone(data.get("phone"));
        clinic.setEmail(data.get("email"));
        return clinicRepository.save(clinic);
    }

    @Transactional
    public String toggleClinicStatus(UUID id) {
        Clinic clinic = clinicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cơ sở!"));
        
        boolean currentStatus = clinic.getIsActive() != null ? clinic.getIsActive() : true;
        clinic.setIsActive(!currentStatus);
        clinicRepository.save(clinic);
        return clinic.getIsActive() ? "Đã hiện cơ sở" : "Đã ẩn cơ sở";
    }
}