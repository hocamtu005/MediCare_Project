package vn.medicare.api.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                // 1. MỞ KHÓA HOÀN TOÀN CHO GIAO DIỆN REACT, TÀI NGUYÊN TĨNH VÀ CÁC TRANG SPA
                .requestMatchers(
                    "/", "/index.html", "/assets/**", "/uploads/**",
                    "/*.png", "/*.jpg", "/*.jpeg", "/*.svg", "/*.ico", // <--- Bao trùm toàn bộ ảnh ở public
                    "/login", "/register", "/403",
                    "/admin/**", "/doctor/**", "/patient/**", "/receptionist/**"
                ).permitAll()

                // 2. CÁC API CÔNG KHAI (Đăng nhập, Đăng ký, Báo lỗi)
                .requestMatchers("/api/v1/auth/**", "/error").permitAll()
                
                // 3. BẢO VỆ NGHIÊM NGẶT CÁC ENDPOINT API THỰC TẾ
                .requestMatchers("/api/v1/admin/**").hasAuthority("ADMIN") 
                .requestMatchers("/api/v1/doctor/**").hasAuthority("DOCTOR") 
                .requestMatchers("/api/v1/patient/**").hasAuthority("PATIENT")
                
                // 4. KHÓA MỌI REQUEST CÒN LẠI YÊU CẦU TOKEN
                .anyRequest().authenticated()
            )
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Cho phép frontend chạy ở cổng 5173 và 8080 gọi được API
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:8080")); 
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}