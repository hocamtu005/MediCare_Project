package vn.medicare.api.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import vn.medicare.api.entity.Role;
import vn.medicare.api.repository.AppointmentRepository;
import vn.medicare.api.repository.UserRepository;

@RestController
@RequestMapping("/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // 1. Thống kê 4 thẻ chỉ số cơ bản
            long totalPatients = userRepository.findAll().stream().filter(u -> u.getRole() == Role.PATIENT).count();
            long totalDoctors = userRepository.findAll().stream().filter(u -> u.getRole() == Role.DOCTOR).count();
            long totalAppointments = appointmentRepository.count();
            long pendingAppointments = appointmentRepository.findAll().stream()
                    .filter(a -> a.getStatus() != null && "PENDING".equals(a.getStatus().name())).count();
            
            // 2. Thuật toán tính Doanh thu thực tế 12 tháng (Dựa trên ca khám COMPLETED/PAID)
            List<Map<String, Object>> chartData = new ArrayList<>();
            int currentYear = LocalDate.now().getYear();
            
            for (int i = 1; i <= 12; i++) {
                final int month = i;
                
                // Đếm số ca khám HOÀN TẤT trong tháng
                long completedInMonth = appointmentRepository.findAll().stream()
                    .filter(a -> a.getStatus() != null && ("COMPLETED".equals(a.getStatus().name()) || "PAID".equals(a.getStatus().name())))
                    // Sử dụng hàm phụ trợ getAppointmentDate() đã được thêm ở entity Appointment
                    .filter(a -> a.getAppointmentDate() != null && a.getAppointmentDate().getMonthValue() == month)
                    .filter(a -> a.getAppointmentDate() != null && a.getAppointmentDate().getYear() == currentYear)
                    .count();
                
                Map<String, Object> monthData = new HashMap<>();
                monthData.put("name", "T" + month);
                
                // Tính doanh thu: Giả sử 150,000 VNĐ / 1 ca khám. (Chia 1,000,000 để ra đơn vị Triệu VNĐ)
                double revenue = (completedInMonth * 150000.0) / 1000000.0;
                
                monthData.put("revenue", revenue);
                monthData.put("appointments", completedInMonth);
                chartData.add(monthData);
            }

            stats.put("totalPatients", totalPatients);
            stats.put("totalDoctors", totalDoctors);
            stats.put("totalAppointments", totalAppointments);
            stats.put("pendingAppointments", pendingAppointments);
            stats.put("chartData", chartData); 
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi hệ thống: " + e.getMessage());
        }
    }
}