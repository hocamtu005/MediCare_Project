package vn.medicare.api.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.medicare.api.entity.Specialty;
import vn.medicare.api.entity.User;
import vn.medicare.api.repository.SpecialtyRepository;
import vn.medicare.api.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AIService {
    private final SpecialtyRepository specialtyRepository;
    private final UserRepository userRepository;

    public Map<String, Object> chatWithAI(String message) {
        String msg = message.toLowerCase();
        Map<String, Object> response = new HashMap<>();

        // 1. NHẬN DIỆN CẤP CỨU (Quy tắc sinh tử theo User Story)
        if (msg.contains("đau ngực") || msg.contains("khó thở") || msg.contains("đột quỵ") || msg.contains("cấp cứu")) {
            response.put("isEmergency", true);
            response.put("reply", "CẢNH BÁO: Triệu chứng của bạn rất nguy hiểm! Vui lòng NGỪNG đặt lịch và đến ngay cơ sở y tế gần nhất hoặc gọi cấp cứu 115.");
            return response;
        }

        // 2. NHẬN DIỆN CHUYÊN KHOA DỰA TRÊN TRIỆU CHỨNG
        String targetSpecialty = "";
        String replyText = "";

        if (msg.contains("đau đầu") || msg.contains("chóng mặt") || msg.contains("mất ngủ")) {
            targetSpecialty = "Thần kinh";
            replyText = "Với triệu chứng này, bạn nên khám chuyên khoa Thần kinh. Dưới đây là các bác sĩ phù hợp:";
        } else if (msg.contains("tim") || msg.contains("huyết áp")) {
            targetSpecialty = "Tim mạch";
            replyText = "Vấn đề này thuộc chuyên khoa Tim mạch. Tôi xin gợi ý các bác sĩ sau:";
        } else if (msg.contains("con") || msg.contains("trẻ") || msg.contains("bé")) {
            targetSpecialty = "Nhi";
            replyText = "Có vẻ bạn đang tìm lịch khám cho bé. Hãy chọn bác sĩ chuyên khoa Nhi dưới đây:";
        } else {
            // Không rõ ràng -> Gợi ý Nội tổng quát
            targetSpecialty = "Nội";
            replyText = "Tôi đã ghi nhận triệu chứng. Bạn nên đăng ký khám Nội tổng quát để bác sĩ kiểm tra kỹ hơn nhé.";
        }

        response.put("isEmergency", false);
        response.put("reply", replyText);
        
        // 3. TÌM BÁC SĨ BẰNG CÁCH QUEREY SPECIALTY TRƯỚC (Sửa lỗi getSpecialty)
        final String specMatch = targetSpecialty;
        List<Map<String, Object>> suggestedDoctors = new ArrayList<>();
        
        // Tìm chuyên khoa có tên chứa từ khóa
        Optional<Specialty> matchedSpec = specialtyRepository.findAll().stream()
                .filter(s -> s.getName().contains(specMatch))
                .findFirst();

        // Nếu tìm thấy chuyên khoa, lấy danh sách bác sĩ thuộc chuyên khoa đó
        if (matchedSpec.isPresent()) {
            List<User> doctors = userRepository.findBySpecialtyId(matchedSpec.get().getId());
            suggestedDoctors = doctors.stream().map(d -> {
                Map<String, Object> doc = new HashMap<>();
                doc.put("id", d.getId());
                doc.put("fullName", d.getFullName());
                doc.put("avatarUrl", d.getAvatarUrl());
                return doc;
            }).collect(Collectors.toList());
        }

        response.put("suggestedDoctors", suggestedDoctors);
        return response;
    }
}