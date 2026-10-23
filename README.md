# 🏥 Hệ thống Đặt lịch Khám bệnh (MediCare)

Dự án Hệ thống Y tế thông minh ứng dụng Đặt lịch và Quản lý Bệnh án điện tử (EMR).
Phần Frontend được xây dựng bằng **React + Vite + Tailwind CSS**.

---

## 🔐 THÔNG TIN TÀI KHOẢN TEST (Dữ liệu giả lập)

Dưới đây là danh sách các tài khoản được cấu hình sẵn trong `AuthContext` để kiểm thử các giao diện phân quyền khác nhau.

### 1. Quản trị viên (Admin)
Người nắm toàn quyền giám sát hệ thống, cấp phát và khóa tài khoản nhân sự, xem biểu đồ doanh thu.
* **Email đăng nhập:** `admin@medicare.vn`
* **Mật khẩu:** `admin123`
* **Tên hiển thị:** Admin Quản Trị

### 2. Điều dưỡng / Lễ tân (Receptionist)
Người chịu trách nhiệm trực quầy tiếp đón, điều phối bệnh nhân vào phòng khám, chuyển trạng thái hàng đợi.
* **Email đăng nhập:** `receptionist@medicare.vn`
* **Mật khẩu:** `recept123`
* **Tên hiển thị:** Điều Dưỡng Trưởng

### 3. Bác sĩ (Doctor)
Người trực tiếp khám bệnh, chẩn đoán, kê đơn thuốc và xem hồ sơ bệnh án của bệnh nhân.
| Họ và tên | Email đăng nhập | Mật khẩu | Chuyên khoa |
| :--- | :--- | :--- | :--- |
| BS. Trần Văn D | `tranvand@medicare.vn` | `doc123` | Tim mạch |
| BS. Nguyễn Thị M | `nguyenthim@medicare.vn` | `doc123` | Tim mạch |
| BS. Lê Trọng K | `letrongk@medicare.vn` | `doc123` | Thần kinh |

### 4. Bệnh nhân (Patient)
Dành cho khách hàng đặt lịch khám và xem lịch sử hồ sơ bệnh án.
* **Email đăng nhập:** *(Nhập bất kỳ email nào không trùng với các tài khoản trên, ví dụ: `patient@gmail.com`)*
* **Mật khẩu:** *(Nhập mật khẩu bất kỳ)*
* **Tên hiển thị mặc định:** Hồ Cẩm Tú

---

## 🚀 Hướng dẫn chạy dự án (Frontend)

1. Mở terminal, di chuyển vào thư mục frontend: `cd frontend`
2. Cài đặt các thư viện (nếu chưa cài): `npm install`
3. Khởi động server: `npm run dev`
4. Mở trình duyệt và truy cập: `http://localhost:5173`

*Lưu ý: Hiện tại hệ thống đang sử dụng dữ liệu giả lập (Mock Data) ở Frontend. Khi kết nối Backend, các tài khoản này sẽ được mã hóa bảo mật trong Database.*


mvnw clean spring-boot:run

Khoa Tim mạch: Email: bs.tim@medicare.vn | Mật khẩu: 123456

Khoa Thần kinh: Email: bs.nao@medicare.vn | Mật khẩu: 123456

Khoa Nhi khoa: Email: bs.nhi@medicare.vn | Mật khẩu: 123456

Khoa Nội tổng quát: Email: bs.noi@medicare.vn | Mật khẩu: 123456

Email: hoa.dieuduong@medicare.vn | Mật khẩu: 123456

Admin: admin@medicare.vn | 123456