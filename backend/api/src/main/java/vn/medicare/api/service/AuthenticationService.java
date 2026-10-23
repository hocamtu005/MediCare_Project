package vn.medicare.api.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.medicare.api.dto.AuthenticationRequest;
import vn.medicare.api.dto.AuthenticationResponse;
import vn.medicare.api.dto.RegisterRequest;
import vn.medicare.api.entity.User;
import vn.medicare.api.repository.UserRepository;
import vn.medicare.api.security.JwtService;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .isActive(true)
                .build();
        repository.save(user); // Lưu xuống Database
        var jwtToken = jwtService.generateToken(user); // Tạo thẻ thông hành
        return AuthenticationResponse.builder()
            .token(jwtToken)
            .id(user.getId())
            .fullName(user.getFullName())
            .email(user.getEmail())
            .role(user.getRole())
            .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        // Kiểm tra email và password có khớp không, sai sẽ báo lỗi ngay
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        var user = repository.findByEmail(request.getEmail()).orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
            .token(jwtToken)
            .id(user.getId())
            .fullName(user.getFullName())
            .email(user.getEmail())
            .role(user.getRole())
            .build();
    }
}