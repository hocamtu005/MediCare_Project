package vn.medicare.api.security;

import java.io.IOException;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        
        // 1. Lấy token từ header của request
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;
        
        // 2. Nếu không có header hoặc header không bắt đầu bằng "Bearer ", bỏ qua và đi tiếp
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // 3. Cắt bỏ chữ "Bearer " (7 ký tự) để lấy chuỗi token gốc
        jwt = authHeader.substring(7);
        
        // 4. Giải mã token để lấy email
        userEmail = jwtService.extractUsername(jwt);
        
        // 5. Nếu email tồn tại và người dùng chưa được xác thực trong phiên này
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Tìm kiếm thông tin user trong Database
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
            
            // 6. Nếu token hợp lệ, thiết lập quyền truy cập cho user này
            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                // Cập nhật SecurityContext báo hiệu user đã đăng nhập thành công
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        // 7. Chuyển request cho các bộ lọc hoặc API tiếp theo xử lý
        filterChain.doFilter(request, response);
    }
}