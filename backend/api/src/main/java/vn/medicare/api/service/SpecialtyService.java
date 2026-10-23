package vn.medicare.api.service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.medicare.api.entity.Specialty;
import vn.medicare.api.repository.SpecialtyRepository;

@Service
@RequiredArgsConstructor
public class SpecialtyService {

    private final SpecialtyRepository specialtyRepository;

    public List<Specialty> getAllSpecialties() {
        return specialtyRepository.findAll();
    }

    @Transactional
    public Specialty createSpecialty(Map<String, String> data) {
        if (specialtyRepository.existsByName(data.get("name"))) {
            throw new RuntimeException("Tên chuyên khoa đã tồn tại!");
        }
        Specialty specialty = Specialty.builder()
                .name(data.get("name"))
                .description(data.get("description"))
                .imageUrl(data.get("imageUrl"))
                .isActive(true)
                .build();
        return specialtyRepository.save(specialty);
    }

    @Transactional
    public Specialty updateSpecialty(UUID id, Map<String, String> data) {
        Specialty specialty = specialtyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyên khoa!"));
        
        // Cập nhật thông tin
        specialty.setName(data.get("name"));
        specialty.setDescription(data.get("description"));
        if(data.containsKey("imageUrl")) {
            specialty.setImageUrl(data.get("imageUrl"));
        }
        return specialtyRepository.save(specialty);
    }

    @Transactional
    public String toggleSpecialtyStatus(UUID id) {
        Specialty specialty = specialtyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyên khoa!"));
        
        boolean currentStatus = specialty.getIsActive() != null ? specialty.getIsActive() : true;
        specialty.setIsActive(!currentStatus);
        specialtyRepository.save(specialty);
        
        return specialty.getIsActive() ? "Đã hiện chuyên khoa" : "Đã ẩn chuyên khoa";
    }

    @Transactional
    public void deleteSpecialty(UUID id) {
        Specialty specialty = specialtyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyên khoa!"));
        specialtyRepository.delete(specialty);
    }
}