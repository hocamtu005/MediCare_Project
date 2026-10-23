package vn.medicare.api.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.medicare.api.entity.Clinic;
import vn.medicare.api.entity.Role;
import vn.medicare.api.entity.Specialty;
import vn.medicare.api.entity.User;
import vn.medicare.api.repository.ClinicRepository;
import vn.medicare.api.repository.SpecialtyRepository;
import vn.medicare.api.repository.UserRepository;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final SpecialtyRepository specialtyRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ClinicRepository clinicRepository;

    @Override
    public void run(String... args) throws Exception {
        
        // 1. FIX LỖI ĐĂNG NHẬP TẬN GỐC: Quét và băm mọi mật khẩu đang ở dạng thô
        List<User> users = userRepository.findAll();
        for (User u : users) {
            // Chuỗi BCrypt luôn bắt đầu bằng $2a$. Nếu không có -> pass thô -> băm lại!
            if (u.getPassword() != null && !u.getPassword().startsWith("$2a$")) {
                u.setPassword(passwordEncoder.encode(u.getPassword()));
                userRepository.save(u);
                System.out.println("Đã mã hóa mật khẩu bảo mật cho: - DataSeeder.java:37" + u.getEmail());
            }
        }

        // 2. TẠO MỚI (Nếu DB trống)
        if (specialtyRepository.count() == 0) {
            Specialty timMach = specialtyRepository.save(Specialty.builder().name("Tim mạch").description("Chuyên khoa Tim mạch").build());
            Specialty thanKinh = specialtyRepository.save(Specialty.builder().name("Thần kinh").description("Chuyên khoa Thần kinh").build());
            Specialty nhiKhoa = specialtyRepository.save(Specialty.builder().name("Nhi khoa").description("Chuyên khoa Nhi khoa").build());
            Specialty noiTongQuat = specialtyRepository.save(Specialty.builder().name("Nội tổng quát").description("Chuyên khoa Nội tổng quát").build());

            userRepository.save(User.builder().email("bs.tim@medicare.vn").password(passwordEncoder.encode("123456")).fullName("BS. Trần Văn Tim").role(Role.DOCTOR).specialtyId(timMach.getId()).isActive(true).build());
            userRepository.save(User.builder().email("bs.nao@medicare.vn").password(passwordEncoder.encode("123456")).fullName("BS. Lê Trọng Não").role(Role.DOCTOR).specialtyId(thanKinh.getId()).isActive(true).build());
            userRepository.save(User.builder().email("bs.nhi@medicare.vn").password(passwordEncoder.encode("123456")).fullName("BS. Đinh Trọng Nhi").role(Role.DOCTOR).specialtyId(nhiKhoa.getId()).isActive(true).build());
            userRepository.save(User.builder().email("bs.noi@medicare.vn").password(passwordEncoder.encode("123456")).fullName("BS. Phạm Văn Nội").role(Role.DOCTOR).specialtyId(noiTongQuat.getId()).isActive(true).build());
            
            System.out.println("====== ĐÃ BƠM DỮ LIỆU BÁC SĨ MẪU ====== - DataSeeder.java:53");
        }

        // 3. TẠO MỚI TÀI KHOẢN ADMIN VÀ ĐIỀU DƯỠNG (Nếu chưa tồn tại)
        boolean hasAdmin = users.stream().anyMatch(u -> "admin@medicare.vn".equals(u.getEmail()));
        if (!hasAdmin) {
            userRepository.save(User.builder()
                    .email("admin@medicare.vn")
                    .password(passwordEncoder.encode("123456"))
                    .fullName("Tú Quản Trị")
                    .role(Role.ADMIN)
                    .isActive(true)
                    .build());
            System.out.println("====== ĐÃ TẠO TÀI KHOẢN ADMIN: admin@medicare.vn ====== - DataSeeder.java:66");
        }

        boolean hasNurse = users.stream().anyMatch(u -> "hoa.dieuduong@medicare.vn".equals(u.getEmail()));
        if (!hasNurse) {
            userRepository.save(User.builder()
                    .email("hoa.dieuduong@medicare.vn")
                    .password(passwordEncoder.encode("123456"))
                    .fullName("Điều dưỡng Hoa")
                    .role(Role.RECEPTIONIST)
                    .isActive(true)
                    .build());
            System.out.println("====== ĐÃ TẠO TÀI KHOẢN ĐIỀU DƯỠNG: hoa.dieuduong@medicare.vn ====== - DataSeeder.java:78");
        }

        if (clinicRepository.count() == 0) {
            Clinic mainClinic = Clinic.builder()
                .name("Phòng Khám Đa Khoa MediCare (Trụ sở chính)")
                .address("123 Đường Y Tế, Phường 4, Quận 5, TP.HCM")
                .phone("1900 1234")
                .email("support@medicare.vn")
                .isActive(true)
                .build();
            clinicRepository.save(mainClinic);
            System.out.println("Đã khởi tạo Cơ sở chính thành công! - DataSeeder.java:90");
        }
    }
}