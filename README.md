# 🏥 Hệ thống Đặt lịch Khám bệnh (MediCare)

Chào mọi người, đây là source code của MediCare - dự án hệ thống đặt lịch khám bệnh và quản lý phòng khám (có định hướng tích hợp bệnh án điện tử EMR). 

**Lưu ý:** Project này hiện tại **vẫn đang trong giai đoạn phát triển**. Mình vẫn đang cày thêm các tính năng mới, tối ưu luồng chạy và fix bug dần dần, nên code sẽ còn được update liên tục trong thời gian tới. Mọi người tham khảo nhẹ nhàng nhé!

### 🛠 Công nghệ sử dụng:
* **Frontend:** React, Vite, Tailwind CSS.
* **Backend:** Spring Boot, PostgreSQL.
* **Deploy:** Docker, Docker Compose.

---

## 🔐 Tài khoản Test (Dữ liệu tạo sẵn)

Để tiện cho việc test các giao diện phân quyền, mình đã tạo sẵn một vài tài khoản trong database. Tất cả các tài khoản dưới đây đều dùng chung mật khẩu là: `123456`

### 1. Admin (Quản trị viên)
Người có quyền xem biểu đồ thống kê, quản lý nhân sự phòng khám.
* **Email:** `admin@medicare.vn`

### 2. Điều dưỡng / Lễ tân
Người trực quầy tiếp đón, quản lý hàng đợi và check-in cho bệnh nhân.
* **Email:** `hoa.dieuduong@medicare.vn`

### 3. Bác sĩ (Các chuyên khoa)
Dùng để test luồng xem danh sách bệnh nhân chờ, ghi bệnh án và kê đơn thuốc.
* **Khoa Tim mạch:** `bs.tim@medicare.vn`
* **Khoa Thần kinh:** `bs.nao@medicare.vn`
* **Khoa Nhi khoa:** `bs.nhi@medicare.vn`
* **Khoa Nội tổng quát:** `bs.noi@medicare.vn`

### 4. Bệnh nhân (Patient)
Dành cho người dùng cuối (khách hàng) đặt lịch. Các bạn cứ bấm vào trang Đăng ký trên giao diện web và tự tạo một tài khoản mới bất kỳ để test thực tế luôn cho dễ hình dung nhé.

---

## 🚀 Hướng dẫn chạy dự án

### Cách 1: Chạy Fullstack bằng Docker (Khuyên dùng)
Đây là cách nhanh gọn nhất để khởi động toàn bộ dự án mà không cần cài cắm môi trường lằng nhằng, mình đã config xong xuôi kết nối giữa React và Spring Boot.

1. Bật ứng dụng Docker Desktop.
2. Mở terminal ở thư mục gốc của project, gõ lệnh:
   ```bash
   docker-compose up -d --build
   ```
3. Đợi terminal báo chạy thành công, mở trình duyệt và truy cập: `http://localhost:8080`

### Cách 2: Chạy thủ công (Dành cho lúc code/dev)
Nếu bạn cần sửa code và muốn thấy thay đổi ngay lập tức (Hot Reload):

**Bật Backend:**
Mở terminal, di chuyển vào thư mục backend và chạy lệnh:
```bash
./mvnw clean spring-boot:run
```

**Bật Frontend:**
Mở một terminal khác, di chuyển vào thư mục frontend:
```bash
npm install
npm run dev
```
Giao diện dev của React lúc này sẽ chạy ở: `http://localhost:5173`
<img width="1917" height="870" alt="Screenshot 2026-10-23 160544" src="https://github.com/user-attachments/assets/3f38d16d-eac8-4898-9943-fc1df7877d67" />
<img width="1917" height="867" alt="Screenshot 2026-10-23 160557" src="https://github.com/user-attachments/assets/ebabd8dd-2ecc-46bb-9997-d042662fe9cf" />
<img width="1917" height="862" alt="Screenshot 2026-10-23 160607" src="https://github.com/user-attachments/assets/78f78a1e-c9b0-45ea-a1fa-c2884f73ac83" />
<img width="1917" height="862" alt="Screenshot 2026-10-23 160626" src="https://github.com/user-attachments/assets/47195421-9ff7-4fcd-8014-8d7ce170dd6d" />

