package vn.medicare.api.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.medicare.api.dto.UserResponse;
import vn.medicare.api.entity.Role;
import vn.medicare.api.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // Hàm lấy danh sách bệnh nhân
    public List<UserResponse> getAllPatients() {
        return userRepository.findByRole(Role.PATIENT)
                .stream()
                .map(user -> UserResponse.builder()
                        .id(user.getId())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .status(user.getIsActive())
                        .build())
                .collect(Collectors.toList());
    }
}