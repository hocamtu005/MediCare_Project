# MediCare – User Story giao diện Admin

*Phiên bản: 2.0 · Cập nhật: 20/10/2026 · Phạm vi: phòng khám 4 chuyên khoa (Tim mạch, Thần kinh, Nhi, Nội), không khám từ xa*

---

## 1. Tổng quan

### 1.1 Mục đích, nguồn và phạm vi
Giao diện Admin là nơi quản lý người dùng, lịch trực, danh mục, lịch hẹn, hồ sơ bệnh nhân, tài chính, cấu hình và theo dõi vận hành của phòng khám. Tài liệu mô tả từng chức năng, từ tổng quan đến chi tiết từng nút và bộ lọc, gồm cả chức năng **đã có** và chức năng **đề xuất thêm**. Mỗi chức năng là một user story có phần giao diện (FE), backend (BE) và tiêu chí nghiệm thu (AC).

**Nhân vật chính:** anh Tuấn, 41 tuổi, quản lý phòng khám kiêm quản trị hệ thống. Mỗi ngày anh cần tạo tài khoản nhân sự, duyệt lịch và các yêu cầu thay đổi, theo dõi số liệu, chỉnh chính sách và xử lý sự cố. Anh làm việc chủ yếu trên máy tính nên cần thao tác chính xác, vì mọi thay đổi ảnh hưởng toàn hệ thống.

**Bản này hợp nhất hai nguồn:**
- Bản v1 (15 user story theo epic): các luồng phê duyệt, thanh toán và đối soát, trợ lý AI, tích hợp, nhật ký, quyền riêng tư.
- Hiện trạng giao diện thực tế (ảnh chụp 20/10/2026): 5 màn hình đang chạy.

**Khác với v1:** bỏ khám từ xa (nhóm chính sách "Khám từ xa", dịch vụ "tư vấn video", dịch vụ video ở Tích hợp); bỏ "giá" khỏi kịch bản trợ lý AI; đặt tên module theo menu thực tế; tách story lớn thành nhiều story nhỏ theo từng chức năng; thêm nhãn trạng thái và ưu tiên. Phụ lục A đối chiếu story cũ với mã mới.

Endpoint ghi trong tài liệu là **đề xuất**, cần đối chiếu với endpoint đang có trong `backend` (các hàm hiện có trong `adminService`: `getAllSchedules`, `createSchedule`, `deleteSchedule`, `getStaffList`, `getClinics`, `getRooms`).

### 1.2 Hiện trạng giao diện

| Màn hình | Đang có | Còn thiếu |
| --- | --- | --- |
| Tổng quan | 4 thẻ số liệu (Tổng bệnh nhân, Bác sĩ hoạt động, Tổng lượt khám, Lịch chờ duyệt); biểu đồ doanh thu 12 tháng; chuông thông báo | Lọc theo thời gian, biểu đồ vận hành, khối "cần xử lý", thẻ bấm được để đi tiếp |
| Quản lý Nhân sự | Tab vai trò (Tất cả/Bác sĩ/Điều dưỡng/Admin), tìm kiếm, nút "Cấp tài khoản", bảng (Tài khoản, Vai trò/Chuyên môn, Trạng thái, Điều khiển) | Xem/sửa chi tiết, hồ sơ bác sĩ, khóa/mở khóa, đặt lại mật khẩu, chứng chỉ hành nghề, phân quyền |
| Phân công Lịch trực | 4 thẻ thống kê; Lịch / Dạng danh sách; lọc nhân sự, cơ sở; thêm ca; kéo chọn trên lịch; xem chi tiết; hủy ca | Sửa ca, ca lặp lại, đăng ký nghỉ/ngày lễ, xử lý lịch hẹn bị ảnh hưởng, chống trùng ca |
| Cơ sở & Chuyên khoa | 2 tab (Chuyên khoa, Cơ sở Y tế); tìm kiếm; "Thêm mới"; bảng + Điều khiển | Mô tả và biểu tượng cho trang chủ, phòng khám, giờ mở cửa, ngày đóng cửa |
| Hồ sơ Bệnh nhân | 2 tab (Ca khám, Bệnh nhân); tìm ca khám; bảng (Chi tiết, Bác sĩ, Thời gian, Trạng thái, Điều phối) | Lọc, duyệt lịch chờ, đổi giờ/hủy ca, chi tiết ca, xem hồ sơ an toàn, gộp hồ sơ trùng |
| Khung chung | Chuông thông báo, tên người dùng, Đăng xuất | Menu hồ sơ cá nhân, đổi mật khẩu, MFA, tự đăng xuất, nhóm menu |
| **Chưa có** | | Dịch vụ & phí, Báo cáo, Đánh giá, Nội dung website, Cấu hình, Nhật ký & bảo mật |

Điểm cần lưu ý từ giao diện hiện tại:
- Thẻ "Lịch chờ duyệt" cho thấy có bước duyệt lịch hẹn nhưng chưa thấy màn hình duyệt. Story AD-PT-04 bổ sung.
- Biểu đồ doanh thu đã có, nhưng chưa có nơi quản lý phí khám (AD-SV).
- Tab "Hồ sơ Bệnh nhân" nhắc đến bệnh án điện tử (EMR). Admin không nên xem nội dung y tế mặc định, xem AD-PT-12.

Điểm cần lưu ý từ giao diện hiện tại:
- Thẻ "Lịch chờ duyệt" cho thấy có bước duyệt lịch hẹn nhưng chưa thấy màn hình duyệt. Story AD-PT-04 bổ sung; các yêu cầu thay đổi khác nằm ở module AP.
- Biểu đồ doanh thu đã có, nhưng chưa có nơi quản lý phí khám (AD-SV) và giao dịch (AD-PY).
- Tab "Hồ sơ Bệnh nhân" nhắc đến bệnh án điện tử (EMR). Admin không nên xem nội dung y tế mặc định, xem AD-PT-12.

### 1.3 Tính năng đề xuất thêm

| Ưu tiên | Tính năng | Vì sao hữu ích |
| --- | --- | --- |
| P1 | Duyệt / từ chối lịch hẹn chờ duyệt, duyệt hàng loạt | Thẻ "Lịch chờ duyệt" đã có nhưng chưa có chỗ xử lý |
| P1 | Khóa/mở khóa, đặt lại mật khẩu, sửa nhân sự | Nhân sự nghỉ việc hoặc quên mật khẩu là việc hằng ngày |
| P1 | Hồ sơ bác sĩ (ảnh, học vị, kinh nghiệm) | Là nguồn dữ liệu cho thẻ bác sĩ trên trang chủ |
| P1 | Chống trùng ca, sửa ca, đăng ký nghỉ, xử lý lịch bị ảnh hưởng | Tránh bệnh nhân đặt vào giờ bác sĩ không có mặt |
| P1 | Đổi giờ, đổi bác sĩ, hủy ca khám kèm lý do | Điều phối ca khám khi có thay đổi |
| P1 | Quản lý dịch vụ và phí khám | Doanh thu và thu phí cần số liệu phí chuẩn |
| P1 | Cấu hình chính sách đặt lịch, hủy, tự động duyệt | Đổi quy định không cần sửa code |
| P1 | Nhật ký hoạt động và nhật ký xem hồ sơ bệnh nhân | Truy vết, an toàn dữ liệu y tế |
| P2 | Hàng chờ phê duyệt (đổi phí, hoàn tiền vượt hạn mức, chèn quá sức chứa) | Kiểm soát chéo các thay đổi nhạy cảm |
| P2 | Thanh toán và đối soát (nếu giữ FR-09) | Số tiền thu khớp thực tế, phát hiện giao dịch treo |
| P2 | Dashboard nâng cấp, khối "cần xử lý hôm nay" | Biết ngay việc gì cần làm đầu ngày |
| P2 | Báo cáo doanh thu, lượt khám, no-show, hiệu suất bác sĩ, kênh đặt lịch | Ra quyết định dựa trên số liệu |
| P2 | Chứng chỉ hành nghề và cảnh báo hết hạn | Tránh để bác sĩ hết chứng chỉ vẫn nhận lịch |
| P2 | Trạng thái kết nối bên ngoài, hàng đợi lỗi, kênh dự phòng | Phát hiện sớm khi SMS/Zalo/cổng thanh toán lỗi |
| P2 | Mẫu thông báo, thông tin phòng khám, MFA, phân quyền chi tiết | Vận hành và bảo mật |
| P3 | Trợ lý AI (cấu hình, giám sát, tạm dừng khẩn) | Quản lý an toàn khi triển khai trợ lý |
| P3 | Nội dung website, đánh giá, gộp hồ sơ trùng, cảnh báo bất thường, sao lưu, EMR/HIS | Hoàn thiện, làm sau |

### 1.4 Sơ đồ menu đề xuất

```
VẬN HÀNH
  Tổng quan                 (nâng cấp)
  Phân công Lịch trực       (nâng cấp)
  Hồ sơ Bệnh nhân           (tab Ca khám + tab Bệnh nhân, nâng cấp)
  Phê duyệt                 (mới)
DANH MỤC
  Quản lý Nhân sự           (nâng cấp)
  Cơ sở & Chuyên khoa       (nâng cấp)
TÀI CHÍNH
  Dịch vụ & Phí             (mới)
  Thanh toán & Đối soát     (mới, nếu giữ FR-09)
PHÂN TÍCH
  Báo cáo                   (mới)
  Đánh giá                  (mới)
HỆ THỐNG
  Trợ lý AI                 (mới)
  Nội dung website          (mới)
  Cấu hình                  (mới)
  Tích hợp                  (mới)
  Nhật ký & Bảo mật         (mới)
```

Mã module: DB (Tổng quan), AC (Khung chung), HR (Nhân sự), SC (Lịch trực), CK (Cơ sở & Chuyên khoa), PT (Hồ sơ Bệnh nhân), AP (Phê duyệt), SV (Dịch vụ & Phí), PY (Thanh toán & Đối soát), RP (Báo cáo), RV (Đánh giá), AI (Trợ lý AI), CT (Nội dung website), CF (Cấu hình), IN (Tích hợp), AU (Nhật ký & Bảo mật).

### 1.5 Quyền và nguyên tắc chung
- **Ghi nhật ký mọi thay đổi** (ai, lúc nào, giá trị trước và sau) cho tài khoản, quyền, lịch trực, phí, cấu hình, hủy/đổi lịch, phê duyệt.
- **Xác nhận hai bước** (nhập lại mật khẩu hoặc mã OTP) cho thao tác khó hoàn tác: khóa tài khoản, hủy ca có lịch hẹn, hủy hàng loạt, đổi phí, đổi quyền, hoàn tiền, tạm dừng trợ lý.
- **Không xóa cứng** dữ liệu có liên quan đến lịch hẹn, bệnh án, giao dịch. Chỉ ẩn hoặc lưu trữ.
- **Không xem nội dung y tế mặc định.** Muốn xem phải nhập lý do, thao tác bị ghi log (break-glass).
- **Cấu hình có hiệu lực từ thời điểm chọn**, không ảnh hưởng ngược các lịch hẹn đã đặt, trừ khi Admin chọn rõ.
- **Luôn còn ít nhất một Admin hoạt động.** Admin không tự khóa, hạ quyền hoặc tự duyệt yêu cầu của chính mình.
- **Mọi API admin** kiểm tra vai trò `ADMIN` ở backend, không chỉ ẩn nút ở giao diện.
- **Trạng thái tài khoản nhân sự:** `INVITED` (mới cấp, chưa kích hoạt), `ACTIVE`, `LOCKED`, `ARCHIVED`.
- **Trạng thái ca trực** (tính từ giờ hiện tại): sắp diễn ra, đang diễn ra, đã kết thúc.
- **Trạng thái lịch hẹn:** `PENDING → CONFIRMED → CHECKED_IN → TRIAGED → IN_PROGRESS → COMPLETED → PAID`, nhánh phụ `CANCELLED`, `NO_SHOW`.

---

## 2. Chi tiết theo module

### 2.1 Tổng quan (DB)
*Màn hình: Trung tâm Quản trị → Tổng quan*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| AD-DB-01 | **Xem 4 thẻ số liệu.** Là Admin, tôi muốn thấy Tổng bệnh nhân, Bác sĩ hoạt động, Tổng lượt khám, Lịch chờ duyệt ngay khi vào hệ thống để nắm tình hình. | **FE:** 4 thẻ có biểu tượng và số lớn. **BE:** `GET /admin/dashboard/summary`. | Số khớp dữ liệu thật; chưa có dữ liệu thì hiện 0, không hiện lỗi. | Hiện có · P1 |
| AD-DB-02 | **Thẻ bấm được.** Là Admin, tôi muốn bấm vào từng thẻ để đi thẳng đến danh sách tương ứng để xử lý nhanh. | **FE:** "Lịch chờ duyệt" mở Hồ sơ Bệnh nhân/Ca khám đã lọc chờ duyệt; "Bác sĩ hoạt động" mở Nhân sự tab Bác sĩ. | Bấm thẻ mở đúng màn hình với bộ lọc đã áp dụng. | Mới · P1 |
| AD-DB-03 | **Biểu đồ doanh thu 12 tháng.** Là Admin, tôi muốn xem doanh thu theo tháng (triệu VNĐ) để theo dõi xu hướng. | **FE:** biểu đồ đường/cột, tooltip khi rê chuột, chọn năm. **BE:** `GET /admin/dashboard/revenue?year=`. | Hiển thị đủ 12 tháng (tháng chưa có = 0); chọn năm khác tải lại được; có trạng thái trống rõ ràng thay vì khung trắng. | Hiện có · P1 |
| AD-DB-04 | **Lọc theo khoảng thời gian.** Là Admin, tôi muốn chọn hôm nay / 7 ngày / 30 ngày / tháng này / tùy chọn để so sánh theo kỳ. | **FE:** bộ chọn kỳ ở đầu trang, áp dụng cho cả thẻ và biểu đồ. **BE:** thêm tham số `from`, `to`. | Đổi kỳ thì mọi số liệu đổi theo; thẻ hiện thêm % thay đổi so với kỳ trước. | Mới · P2 |
| AD-DB-05 | **Biểu đồ lượt khám.** Là Admin, tôi muốn xem lượt khám theo ngày và theo chuyên khoa để biết khoa nào đông. | **FE:** biểu đồ cột theo ngày; biểu đồ tròn theo 4 chuyên khoa. **BE:** `GET /admin/dashboard/visits?group=day\|specialty`. | Tổng các cột khớp tổng lượt khám của kỳ. | Mới · P2 |
| AD-DB-06 | **Chỉ số vận hành.** Là Admin, tôi muốn thấy tỷ lệ vắng mặt (no-show), thời gian chờ trung bình, tỷ lệ lấp đầy ca để đánh giá chất lượng. | **FE:** 3 thẻ phụ dưới 4 thẻ chính. **BE:** `GET /admin/dashboard/operations`; no-show = lịch `NO_SHOW` / lịch đã xác nhận. | Công thức thống nhất, ghi chú ngay trên thẻ (biểu tượng "i"). | Mới · P2 |
| AD-DB-07 | **Khối "Cần xử lý hôm nay".** Là Admin, tôi muốn có một danh sách việc cần làm (lịch chờ duyệt, yêu cầu chờ phê duyệt, bác sĩ báo nghỉ, chứng chỉ sắp hết hạn, giao dịch lỗi, kết nối bên ngoài lỗi) để không bỏ sót. | **FE:** danh sách theo loại, mỗi dòng có nút đi tới. **BE:** `GET /admin/dashboard/todos`. | Xử lý xong một việc thì dòng đó biến mất; mỗi dòng đi đúng màn hình. | Mới · P2 |
| AD-DB-08 | **Tải, lỗi, tự làm mới.** Là Admin, tôi muốn trang tự cập nhật và báo rõ khi tải lỗi để không tin nhầm số cũ. | **FE:** khung xương khi tải; thông báo lỗi kèm nút "Thử lại"; tự làm mới mỗi 60 giây. | Mất mạng thì hiện cảnh báo, không giữ số cũ mà không báo. | Mới · P3 |

### 2.2 Khung chung và tài khoản Admin (AC)
*Màn hình: thanh bên, thanh tiêu đề trên cùng*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| AD-AC-01 | **Chuông thông báo.** Là Admin, tôi muốn xem thông báo mới để biết việc cần xử lý. | **FE:** chuông có chấm đỏ; bấm mở danh sách (lịch chờ duyệt, yêu cầu chờ phê duyệt, bác sĩ nghỉ, chứng chỉ sắp hết hạn, giao dịch lỗi, kết nối bên ngoài lỗi); "Đánh dấu đã đọc", "Đọc tất cả"; bấm vào thông báo đi tới mục liên quan. **BE:** `GET /admin/notifications`, `PATCH /admin/notifications/{id}/read`; đẩy realtime qua WebSocket/SSE. | Chấm đỏ mất khi hết thông báo chưa đọc; thông báo mới xuất hiện ≤ 5 giây. | Hiện có · đối chiếu · P1 |
| AD-AC-02 | **Chọn loại thông báo nhận.** Là Admin, tôi muốn bật/tắt từng loại thông báo để không bị làm phiền. | **FE:** trang cài đặt thông báo trong menu tài khoản. **BE:** `PUT /admin/me/notification-settings`. | Loại đã tắt không còn gửi; loại an toàn (giao dịch lỗi, bảo mật) không tắt được. | Mới · P3 |
| AD-AC-03 | **Menu tài khoản.** Là Admin, tôi muốn bấm vào tên mình để xem hồ sơ và đổi mật khẩu. | **FE:** menu thả xuống: Hồ sơ cá nhân, Đổi mật khẩu, Bật xác thực hai lớp (MFA), Đăng xuất. **BE:** `GET/PUT /admin/me`, `PUT /admin/me/password`. | Đổi mật khẩu cần nhập mật khẩu cũ, mật khẩu mới đủ mạnh; đổi xong các phiên khác bị đăng xuất. | Mới · P1 |
| AD-AC-04 | **Xác thực hai lớp (MFA).** Là Admin, tôi muốn bật MFA cho tài khoản mình để chống lộ mật khẩu. | **FE:** quét mã QR bằng ứng dụng xác thực, nhập mã 6 số để bật; hiển thị mã dự phòng. **BE:** `POST /auth/mfa/setup`, `POST /auth/mfa/verify`. | Đăng nhập lần sau yêu cầu mã; mất thiết bị thì dùng mã dự phòng. | Mới · P2 |
| AD-AC-05 | **Đăng xuất và hết phiên.** Là Admin, tôi muốn được đăng xuất an toàn và hệ thống tự đăng xuất khi không dùng để tránh lộ dữ liệu. | **FE:** nút "Đăng xuất tài khoản" cuối thanh bên (đã có); cảnh báo đếm ngược 60 giây trước khi hết phiên. **BE:** `POST /auth/logout` hủy token; phiên hết hạn sau 15 phút không hoạt động. | Đăng xuất xong quay về trang đăng nhập, không bấm Back để xem lại được; token cũ không còn hiệu lực. | Hiện có · P1 (tự đăng xuất: Mới) |
| AD-AC-06 | **Menu theo nhóm và theo quyền.** Là Admin, tôi muốn thanh bên chia nhóm, có thể thu gọn, để dễ tìm khi menu nhiều lên. | **FE:** 4 nhóm (Vận hành, Danh mục, Phân tích, Hệ thống); nút thu gọn; mục đang chọn được tô sáng. **BE:** quyền kiểm tra ở API. | Truy cập thẳng bằng đường dẫn khi không có quyền thì trả 403, không chỉ ẩn menu. | Mới · P2 |
| AD-AC-07 | **Trạng thái dùng chung.** Là Admin, tôi muốn mọi màn hình có cách báo tải/trống/lỗi giống nhau để dễ hiểu. | **FE:** khung xương khi tải; trạng thái trống có hướng dẫn ("Chưa có ca trực. Bấm Thêm ca trực"); thông báo nổi (toast) khi lưu thành công hoặc lỗi; lỗi mạng có nút "Thử lại". | Không màn hình nào chỉ để trống trắng khi lỗi. | Mới · P2 |

### 2.3 Quản lý Nhân sự (HR)
*Màn hình: Quản lý Nhân sự*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| AD-HR-01 | **Xem danh sách nhân sự.** Là Admin, tôi muốn xem tài khoản Bác sĩ, Điều dưỡng, Admin trong một bảng để quản lý. | **FE:** bảng 4 cột (Tài khoản, Vai trò/Chuyên môn, Trạng thái, Điều khiển); ảnh đại diện chữ cái đầu khi chưa có ảnh; phân trang. **BE:** `GET /admin/staff?role=&q=&status=&page=` (hàm hiện có `getStaffList`). | Mặc định 20 dòng/trang; trạng thái hiển thị bằng nhãn màu + chữ. | Hiện có · P1 |
| AD-HR-02 | **Lọc theo vai trò.** Là Admin, tôi muốn chuyển nhanh giữa Tất cả vai trò / Bác sĩ / Điều dưỡng / Admin để chỉ xem nhóm cần quản lý. | **FE:** 4 tab; mỗi tab có số lượng. | Số trên tab khớp số dòng khi chọn tab đó. | Hiện có · P1 (số lượng: Mới) |
| AD-HR-03 | **Tìm kiếm nhân sự.** Là Admin, tôi muốn tìm theo tên, email, số điện thoại để tìm nhanh. | **FE:** ô "Tìm kiếm nhân sự…", gõ xong 300 ms mới tìm, có nút xóa nhanh. **BE:** tham số `q`, tìm không phân biệt dấu tiếng Việt. | Gõ "nguyen" ra "Nguyễn". | Hiện có · P1 |
| AD-HR-04 | **Lọc thêm theo trạng thái, chuyên khoa.** Là Admin, tôi muốn lọc nhân sự đang bị khóa hoặc theo chuyên khoa để rà soát. | **FE:** hai ô chọn bên cạnh ô tìm kiếm; nút "Xóa lọc". | Lọc kết hợp với tab và ô tìm kiếm cùng lúc. | Mới · P2 |
| AD-HR-05 | **Cấp tài khoản.** Là Admin, tôi muốn tạo tài khoản mới cho bác sĩ/điều dưỡng/admin để họ làm việc trên hệ thống. | **FE:** nút "Cấp tài khoản" mở form: họ tên, email, SĐT, vai trò; nếu là Bác sĩ thì thêm chuyên khoa, cơ sở; báo lỗi ngay dưới từng ô. **BE:** `POST /admin/staff`; kiểm tra trùng email/SĐT; tạo trạng thái `INVITED`, gửi email có link kích hoạt (hạn 48 giờ); không gửi mật khẩu qua email. | Email trùng báo "đã tồn tại"; tài khoản mới hiện trong bảng ngay; link hết hạn thì có nút gửi lại (AD-HR-10). | Hiện có · đối chiếu · P1 |
| AD-HR-06 | **Xem chi tiết nhân sự.** Là Admin, tôi muốn mở một nhân sự để xem đầy đủ thông tin mà không rời danh sách. | **FE:** bấm vào dòng mở panel bên phải: thông tin chung, vai trò, chuyên khoa, cơ sở, trạng thái, ngày tạo, lần đăng nhập gần nhất, các ca trực sắp tới, lịch sử đăng nhập và thao tác gần đây (lấy từ nhật ký). **BE:** `GET /admin/staff/{id}`. | Panel đóng bằng nút X, phím Esc hoặc bấm ra ngoài. | Mới · P1 |
| AD-HR-07 | **Sửa thông tin nhân sự.** Là Admin, tôi muốn sửa họ tên, SĐT, chuyên khoa, cơ sở để cập nhật khi có thay đổi. | **FE:** nút Sửa trong cột Điều khiển; form giống form cấp tài khoản, email không đổi được. **BE:** `PUT /admin/staff/{id}`; đổi chuyên khoa của bác sĩ đang có lịch hẹn thì cảnh báo. | Lưu thành công có thông báo; log ghi giá trị trước/sau. | Hiện có · đối chiếu · P1 |
| AD-HR-08 | **Hồ sơ bác sĩ.** Là Admin, tôi muốn nhập ảnh, học vị, số năm kinh nghiệm, giới thiệu ngắn cho bác sĩ để trang chủ hiển thị đúng. | **FE:** thêm tab "Hồ sơ bác sĩ" trong panel chi tiết: upload ảnh có cắt khung 4:5 (≤ 2 MB, jpg/png/webp), học vị, kinh nghiệm, giới thiệu, bật/tắt "hiển thị trên website". **BE:** `PUT /admin/doctors/{id}/profile`, `POST /admin/doctors/{id}/avatar`. | Bác sĩ tắt hiển thị thì không xuất hiện trên trang chủ nhưng lịch đã đặt vẫn xử lý được. | Mới · P1 |
| AD-HR-09 | **Chứng chỉ hành nghề.** Là Admin, tôi muốn lưu số chứng chỉ và ngày hết hạn để không để bác sĩ hết hạn vẫn nhận lịch. | **FE:** mục "Chứng chỉ" trong hồ sơ bác sĩ (số, nơi cấp, ngày cấp, ngày hết hạn, ảnh scan); nhãn đỏ khi còn dưới 30 ngày. **BE:** bảng `doctor_credentials`; job hằng ngày báo Admin trước 30 ngày; tùy chọn tự ẩn bác sĩ khi hết hạn. | Cảnh báo xuất hiện ở khối "Cần xử lý" (AD-DB-07). | Mới · P2 |
| AD-HR-10 | **Khóa / mở khóa tài khoản.** Là Admin, tôi muốn khóa tài khoản khi nhân sự nghỉ việc để họ không đăng nhập được. | **FE:** nút Khóa/Mở khóa ở cột Điều khiển; hộp xác nhận kèm lý do; trạng thái đổi ngay trong bảng. **BE:** `PATCH /admin/staff/{id}/status`; thu hồi mọi token ngay; chặn tự khóa mình và khóa Admin cuối cùng. | Tài khoản bị khóa mất phiên hiện tại trong ≤ 1 phút; lịch trực sắp tới của người đó hiện cảnh báo. | Mới · P1 |
| AD-HR-11 | **Đặt lại mật khẩu / gửi lại lời mời.** Là Admin, tôi muốn gửi lại link kích hoạt hoặc link đặt lại mật khẩu để nhân sự vào lại được. | **FE:** nút trong menu "…" ở cột Điều khiển; hộp xác nhận. **BE:** `POST /admin/staff/{id}/reset-password`, `POST /admin/staff/{id}/resend-invite`; Admin không bao giờ thấy mật khẩu; giới hạn 5 lần/giờ. | Link cũ bị vô hiệu khi tạo link mới; có ghi log. | Mới · P1 |
| AD-HR-12 | **Buộc đăng xuất mọi thiết bị.** Là Admin, tôi muốn đăng xuất một nhân sự khỏi mọi thiết bị khi nghi ngờ lộ tài khoản. | **FE:** nút trong menu "…". **BE:** `POST /admin/staff/{id}/revoke-sessions`. | Mọi token của người đó mất hiệu lực ngay. | Mới · P3 |
| AD-HR-13 | **Phân quyền chi tiết.** Là Admin, tôi muốn xem và chỉnh quyền của từng vai trò để mỗi người chỉ làm đúng việc của mình. | **FE:** trang "Phân quyền": ma trận chức năng × vai trò, nhóm theo module, ô bật/tắt, xem trước "người dùng X sẽ thấy gì"; quyền nhạy cảm (xem chẩn đoán, hoàn tiền, đổi phí) có cảnh báo; không chỉnh được quyền hệ thống mặc định. **BE:** `GET /admin/roles`, `PUT /admin/roles/{id}/permissions`; thay đổi cần xác nhận hai bước. | Quyền thu hồi có hiệu lực ngay ở yêu cầu tiếp theo; điều dưỡng mặc định không có quyền xem chẩn đoán/đơn thuốc. | Mới · P2 |
| AD-HR-14 | **Lưu trữ tài khoản và xuất danh sách.** Là Admin, tôi muốn lưu trữ tài khoản đã nghỉ và xuất danh sách ra Excel để quản lý hồ sơ. | **FE:** nút "Lưu trữ" (không có nút xóa cứng); nút "Xuất Excel" theo bộ lọc hiện tại. **BE:** `PATCH …/status` với `ARCHIVED`; `GET /admin/staff/export`. | Tài khoản đã lưu trữ ẩn khỏi danh sách mặc định, vẫn truy vết được ở các ca trực và lịch sử cũ. | Mới · P3 |
| AD-HR-15 | **MFA bắt buộc theo vai trò.** Là Admin, tôi muốn bắt buộc một số vai trò (Admin, Bác sĩ) phải dùng MFA để giảm rủi ro lộ tài khoản. | **FE:** công tắc "Bắt buộc MFA" cho từng vai trò trong trang Phân quyền. **BE:** `PUT /admin/roles/{id}/mfa-required`. | Người thuộc vai trò bị bắt buộc phải thiết lập MFA ở lần đăng nhập kế tiếp mới vào được hệ thống. | Mới · P2 |

### 2.4 Phân công Lịch trực (SC)
*Màn hình: Phân công Lịch trực*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| AD-SC-01 | **Xem lịch trực.** Là Admin, tôi muốn xem lịch theo Tháng / Tuần / Ngày và đi tới ngày bất kỳ để nắm ai trực khi nào. | **FE:** lịch FullCalendar; nút ‹ Hôm nay ›; ô chọn ngày nhanh; tiêu đề khoảng ngày; cột hôm nay tô vàng nhạt; vạch giờ hiện tại. **BE:** `getAllSchedules`. | Chuyển chế độ giữ nguyên ngày đang xem. | Hiện có · P1 |
| AD-SC-02 | **Thống kê nhanh.** Là Admin, tôi muốn thấy Ca hôm nay, Đang diễn ra, Sắp tới (7 ngày), Đã hoàn thành để biết khối lượng. | **FE:** 4 thẻ; tính theo bộ lọc nhân sự/cơ sở đang chọn. | Số khớp lịch đang hiển thị. | Hiện có · P2 |
| AD-SC-03 | **Lọc theo nhân sự, cơ sở.** Là Admin, tôi muốn xem riêng lịch của một bác sĩ hoặc một cơ sở để kiểm tra. | **FE:** hai ô chọn "Tất cả nhân sự", "Tất cả cơ sở"; nút "Xóa lọc" khi đang lọc. | Bộ lọc áp dụng cho cả lịch, danh sách và thống kê. | Hiện có · P1 |
| AD-SC-04 | **Lịch / Dạng danh sách (lịch sử).** Là Admin, tôi muốn chuyển sang dạng danh sách để xem lại các ca trước đây. | **FE:** tab "Lịch" và "Dạng danh sách"; bộ lọc Sắp tới/Lịch sử/Tất cả; cột Ngày, Giờ, Bác sĩ, Cơ sở/Phòng, Trạng thái; lịch sử xếp ca mới nhất trước. | Bấm dòng mở chi tiết ca; trạng thái "Đã kết thúc" có màu xám. | Hiện có · P1 |
| AD-SC-05 | **Thêm ca trực.** Là Admin, tôi muốn gán bác sĩ vào ca (cơ sở, phòng, ngày, giờ, mỗi lượt 15/30/60 phút) để bệnh nhân chỉ đặt được giờ bác sĩ thực sự khám. | **FE:** nút "Thêm ca trực" mở cửa sổ 2 cột (Nhân sự & địa điểm / Thời gian); phòng chỉ chọn được sau khi chọn cơ sở; dòng tóm tắt thời lượng và số lượt khám. **BE:** `createSchedule` → `POST /admin/schedules`, tự sinh `time_slots`. | Giờ kết thúc phải sau giờ bắt đầu; không chọn được ngày quá khứ; lưu xong lịch cập nhật không cần tải lại trang. | Hiện có · P1 |
| AD-SC-06 | **Tạo ca bằng kéo chọn.** Là Admin, tôi muốn kéo chọn vùng trống trên lịch để tạo ca nhanh. | **FE:** kéo trên lịch tuần/ngày mở form với ngày và giờ đã điền sẵn; ở chế độ Tháng mặc định 08:00–12:00. | Kéo vào vùng quá khứ thì báo "Không thể phân công ca trực trong quá khứ". | Hiện có · P2 |
| AD-SC-07 | **Xem chi tiết ca.** Là Admin, tôi muốn bấm vào ca để xem đủ thông tin mà không rời lịch. | **FE:** panel bên phải: bác sĩ, ngày, giờ, thời lượng, cơ sở, phòng, trạng thái, số lượt khám nếu có. | Đóng bằng X, Esc hoặc bấm ra ngoài. | Hiện có · P1 |
| AD-SC-08 | **Hủy ca trực.** Là Admin, tôi muốn hủy ca khi bác sĩ không trực được để lịch phản ánh đúng thực tế. | **FE:** nút "Hủy ca trực này" trong panel, có bước xác nhận ngay trong panel; ca đã kết thúc không có nút hủy (lưu làm lịch sử). **BE:** `deleteSchedule`; ca đã có lịch hẹn phải đi qua AD-SC-13. | Hủy xong lịch cập nhật; ca đã qua trả lỗi nếu gọi thẳng API. | Hiện có · P1 |
| AD-SC-09 | **Chống trùng ca.** Là Admin, tôi muốn hệ thống chặn xếp trùng để một bác sĩ không bị hai nơi một lúc. | **FE:** báo lỗi rõ ngay trên form ("BS. A đã có ca 08:00–12:00 ngày này"). **BE:** kiểm tra chồng giờ theo bác sĩ và theo phòng, trả `409` kèm ca xung đột. | Không tạo được hai ca chồng giờ cho cùng bác sĩ hoặc cùng phòng. | Mới · P1 |
| AD-SC-10 | **Sửa ca trực.** Là Admin, tôi muốn đổi giờ, phòng, bác sĩ của một ca để điều chỉnh khi có thay đổi. | **FE:** nút "Sửa ca" trong panel; mở lại form với dữ liệu cũ; cảnh báo khi ca đã có lịch hẹn. **BE:** `PUT /admin/schedules/{id}`; slot đã đặt giữ nguyên hoặc đi qua AD-SC-13. | Log ghi giá trị trước/sau; bác sĩ nhận thông báo khi ca của họ bị đổi. | Mới · P1 |
| AD-SC-11 | **Ca lặp lại và sao chép tuần.** Là Admin, tôi muốn lặp ca hằng tuần hoặc sao chép cả tuần để không phải nhập từng ngày. | **FE:** trong form chọn "Lặp lại" (các thứ trong tuần, đến ngày); nút "Sao chép tuần này sang tuần sau" có bước xem trước. **BE:** `POST /admin/schedules/bulk`, bỏ qua và báo cáo các ca bị trùng. | Tạo nhiều ca một lần; báo rõ ca nào tạo được, ca nào bị bỏ vì trùng. | Mới · P2 |
| AD-SC-12 | **Đăng ký nghỉ và ngày lễ.** Là Admin, tôi muốn đánh dấu bác sĩ nghỉ hoặc cả phòng khám nghỉ để hệ thống chặn đặt lịch. | **FE:** nút "Đăng ký nghỉ" (chọn người hoặc cả cơ sở, ngày/khoảng giờ, lý do); ca nghỉ hiện màu khác trên lịch. **BE:** `POST /admin/time-off`; khóa các slot trong khoảng nghỉ ngay lập tức. | Slot bị khóa ngay sau khi lưu; bệnh nhân không đặt được giờ trong khoảng nghỉ. | Mới · P1 |
| AD-SC-13 | **Xử lý lịch hẹn bị ảnh hưởng.** Là Admin, tôi muốn khi sửa/hủy ca hoặc đăng ký nghỉ, hệ thống liệt kê các lịch đã đặt để tôi xử lý. | **FE:** cửa sổ "Lịch bị ảnh hưởng": danh sách bệnh nhân với 3 hướng xử lý (chuyển bác sĩ khác cùng chuyên khoa / dời giờ / hủy), thao tác hàng loạt, soạn thông báo. **BE:** `GET /admin/schedules/{id}/affected-appointments`, `POST /admin/appointments/bulk-reschedule\|bulk-cancel`; thông báo từng bệnh nhân qua Notification Service. | Không lịch hẹn nào bị bỏ lửng; bệnh nhân nhận thông báo trong ≤ 1 phút. | Mới · P1 |
| AD-SC-14 | **Giới hạn bệnh nhân mỗi ca.** Là Admin, tôi muốn đặt số bệnh nhân tối đa mỗi ca để bác sĩ không quá tải. | **FE:** ô "Số bệnh nhân tối đa" trong form; hiển thị "8/12" trên ca. **BE:** `capacity` trong bảng `schedules`; vượt sức chứa chỉ cho điều dưỡng chèn khi có lý do. | Hệ thống không cho đặt vượt sức chứa ở kênh bệnh nhân. | Mới · P2 |
| AD-SC-15 | **Tỷ lệ lấp đầy và xuất lịch.** Là Admin, tôi muốn thấy ca nào còn trống nhiều và in lịch trực để phân bổ nhân sự. | **FE:** thanh tiến độ trên ca ở dạng danh sách; nút "Xuất PDF/Excel" theo bộ lọc. **BE:** `GET /admin/schedules/export`. | Tệp xuất đúng bộ lọc đang chọn. | Mới · P3 |
| AD-SC-16 | **Lưới lịch theo bác sĩ.** Là Admin, tôi muốn xem lịch dạng bảng (hàng là bác sĩ, cột là ngày) để so sánh nhiều bác sĩ cùng lúc. | **FE:** nút chuyển chế độ "Theo bác sĩ" trong tab Lịch; mỗi ô thể hiện ca, nghỉ, màu theo tỷ lệ lấp đầy. **BE:** `GET /admin/schedules?week=&view=resource`. | Bấm vào ô mở chi tiết/sửa ca; lọc theo chuyên khoa và cơ sở. | Mới · P3 |
| AD-SC-17 | **Phát hiện ca trống, thiếu bác sĩ.** Là Admin, tôi muốn hệ thống chỉ ra ngày/giờ chưa có bác sĩ trực để bổ sung kịp. | **FE:** nhãn cảnh báo trên lịch ("Chưa có bác sĩ Nhi chiều thứ 5"); đưa vào khối "Cần xử lý" ở Tổng quan. **BE:** so khung giờ làm việc của phòng khám với các ca đã xếp, theo từng chuyên khoa. | Cảnh báo biến mất khi đã xếp đủ ca. | Mới · P3 |
| AD-SC-18 | **Mẫu lịch tuần.** Là Admin, tôi muốn lưu một tuần lịch làm mẫu và áp dụng cho các tuần sau để tiết kiệm thao tác. | **FE:** nút "Lưu làm mẫu", "Áp dụng mẫu" có bước xem trước. **BE:** `POST /admin/schedules/apply-template`; bỏ qua và báo cáo ca trùng. | Áp dụng mẫu không ghi đè ca đã có. | Mới · P3 |

### 2.5 Cơ sở & Chuyên khoa (CK)
*Màn hình: Cơ sở & Chuyên khoa (tab Chuyên khoa, tab Cơ sở Y tế)*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| AD-CK-01 | **Xem và tìm chuyên khoa.** Là Admin, tôi muốn xem danh mục chuyên khoa và tìm nhanh để quản lý. | **FE:** tab "Chuyên khoa"; bảng (Tên chuyên khoa, Điều khiển); ô "Tìm kiếm chuyên khoa…". **BE:** `GET /admin/specialties?q=`. | Dự án hiện chỉ có 4 chuyên khoa: Tim mạch, Thần kinh, Nhi, Nội. | Hiện có · P1 |
| AD-CK-02 | **Thêm chuyên khoa.** Là Admin, tôi muốn thêm chuyên khoa mới để mở rộng khi phòng khám phát triển. | **FE:** nút "Thêm mới" mở form (tên, mô tả). **BE:** `POST /admin/specialties`; tên không trùng. | Tên trùng báo lỗi; chuyên khoa mới xuất hiện ở danh sách chọn khi cấp tài khoản bác sĩ. | Hiện có · P1 |
| AD-CK-03 | **Sửa, ẩn chuyên khoa.** Là Admin, tôi muốn sửa tên hoặc ẩn chuyên khoa không còn dùng để danh mục luôn gọn. | **FE:** nút Sửa, Ẩn/Hiện ở cột Điều khiển. **BE:** `PUT /admin/specialties/{id}`, `PATCH …/visibility`; **không xóa** chuyên khoa đã có bác sĩ hoặc lịch hẹn. | Chuyên khoa bị ẩn không còn hiện cho bệnh nhân chọn, lịch cũ vẫn xem được. | Hiện có · đối chiếu · P1 |
| AD-CK-04 | **Thông tin hiển thị cho bệnh nhân.** Là Admin, tôi muốn nhập mô tả ngắn, dòng "nên đi khám khi…", biểu tượng và thứ tự hiển thị để trang chủ và trợ lý AI gợi ý đúng. | **FE:** thêm các ô trong form chuyên khoa; chọn biểu tượng; kéo thả đổi thứ tự. **BE:** thêm cột `description`, `symptoms_hint`, `icon`, `sort_order`. | Thứ tự trên trang chủ khớp thứ tự đã chọn; nội dung triệu chứng do bác sĩ duyệt trước khi đăng. | Mới · P2 |
| AD-CK-05 | **Quản lý cơ sở y tế.** Là Admin, tôi muốn khai báo thông tin cơ sở để bệnh nhân biết địa chỉ và giờ làm việc. | **FE:** tab "Cơ sở Y tế": danh sách + Thêm mới/Sửa/Ẩn; form: tên, địa chỉ, số điện thoại, giờ mở cửa, tọa độ bản đồ. **BE:** `getClinics`, `POST/PUT /admin/clinics`. | Cơ sở đang có ca trực hoặc lịch hẹn không xóa được, chỉ ẩn. | Hiện có · đối chiếu · P1 |
| AD-CK-06 | **Quản lý phòng khám trong cơ sở.** Là Admin, tôi muốn khai báo các phòng của từng cơ sở để gán vào ca trực. | **FE:** trong chi tiết cơ sở có danh sách phòng (thêm, sửa, ẩn). **BE:** `getRooms(clinicId)`, `POST/PUT /admin/rooms`; tên phòng không trùng trong cùng cơ sở. | Phòng chỉ hiện trong danh sách chọn của form ca trực khi đã chọn đúng cơ sở. | Hiện có · đối chiếu · P1 |
| AD-CK-07 | **Ngày đóng cửa của cơ sở.** Là Admin, tôi muốn khai báo ngày lễ, ngày đóng cửa để hệ thống chặn đặt lịch. | **FE:** mục "Ngày nghỉ" trong cơ sở (lịch chọn ngày + lý do). **BE:** `POST /admin/clinics/{id}/holidays`; kích hoạt luồng AD-SC-13. | Ngày đóng cửa không còn slot cho bệnh nhân đặt. | Mới · P2 |
| AD-CK-08 | **Xem nhân sự thuộc chuyên khoa/cơ sở.** Là Admin, tôi muốn thấy số bác sĩ mỗi chuyên khoa và mỗi cơ sở để biết khoa nào thiếu người. | **FE:** cột "Số bác sĩ" trong bảng; bấm số để mở danh sách. | Số khớp tab Bác sĩ ở Quản lý Nhân sự khi lọc cùng chuyên khoa. | Mới · P3 |

### 2.6 Hồ sơ Bệnh nhân (PT)
*Màn hình: Hồ sơ Bệnh nhân (tab Ca khám, tab Bệnh nhân)*

**Tab Ca khám**

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| AD-PT-01 | **Xem danh sách ca khám.** Là Admin, tôi muốn xem mọi ca khám để điều phối. | **FE:** bảng 5 cột (Chi tiết ca khám, Bác sĩ phụ trách, Thời gian, Trạng thái, Điều phối); phân trang. **BE:** `GET /admin/appointments?...`. | Sắp xếp mặc định theo thời gian gần nhất; trạng thái là nhãn màu + chữ theo mã `PENDING…PAID`. | Hiện có · P1 |
| AD-PT-02 | **Tìm kiếm ca khám.** Là Admin, tôi muốn tìm theo tên bệnh nhân, SĐT, mã lịch để tìm nhanh. | **FE:** ô "Tìm kiếm ca khám…", gõ xong 300 ms mới tìm. | Tìm theo mã lịch trả đúng một dòng. | Hiện có · P1 |
| AD-PT-03 | **Lọc ca khám.** Là Admin, tôi muốn lọc theo ngày, bác sĩ, chuyên khoa, trạng thái để rà soát. | **FE:** các ô lọc cạnh ô tìm kiếm; lọc nhanh "Hôm nay", "Chờ duyệt"; nút "Xóa lọc". | Lọc kết hợp được; từ thẻ "Lịch chờ duyệt" ở Tổng quan mở sang đã lọc sẵn. | Mới · P1 |
| AD-PT-04 | **Duyệt / từ chối lịch chờ duyệt.** Là Admin, tôi muốn duyệt hoặc từ chối lịch `PENDING` để bệnh nhân biết kết quả sớm. | **FE:** nút Duyệt / Từ chối ở cột Điều phối; từ chối bắt buộc chọn lý do; chọn nhiều dòng để duyệt hàng loạt. **BE:** `PATCH /admin/appointments/{id}/approve\|reject`, `POST …/bulk-approve`; kiểm tra state machine; từ chối thì trả slot; gửi thông báo cho bệnh nhân. | Không duyệt được lịch đã hủy/đã khám; thẻ "Lịch chờ duyệt" giảm theo; có thể bật tự động duyệt ở AD-CF-04. | Mới · P1 |
| AD-PT-05 | **Điều phối: đổi bác sĩ.** Là Admin, tôi muốn chuyển ca sang bác sĩ khác cùng chuyên khoa khi bác sĩ ban đầu không khám được. | **FE:** nút "Điều phối" mở danh sách bác sĩ còn trống đúng giờ đó. **BE:** `PATCH /admin/appointments/{id}/assign`; chỉ cho bác sĩ cùng chuyên khoa và còn slot. | Bệnh nhân và hai bác sĩ đều nhận thông báo; log ghi lý do. | Hiện có · đối chiếu · P1 |
| AD-PT-06 | **Đổi giờ ca khám.** Là Admin, tôi muốn dời ca sang giờ khác để xử lý khi có thay đổi. | **FE:** chọn ngày và slot trống của bác sĩ. **BE:** `PATCH /admin/appointments/{id}/reschedule`; giữ chỗ giờ mới trước, thành công mới trả giờ cũ. | Không dời sang giờ đã có người đặt; bệnh nhân nhận thông báo. | Mới · P1 |
| AD-PT-07 | **Hủy ca khám.** Là Admin, tôi muốn hủy ca kèm lý do và thông báo bệnh nhân để xử lý các trường hợp bất thường. | **FE:** nút Hủy với hộp xác nhận, bắt buộc lý do. **BE:** `PATCH …/cancel` → `CANCELLED`, trả slot; kích hoạt hoàn cọc theo chính sách nếu có. | Chỉ hủy được ca chưa `IN_PROGRESS`; có log "ai hủy, lý do gì". | Mới · P1 |
| AD-PT-08 | **Chi tiết ca khám.** Là Admin, tôi muốn xem đầy đủ một ca để hiểu chuyện gì đã xảy ra. | **FE:** panel: người đặt và kênh đặt (web, AI, điện thoại), bác sĩ, giờ hẹn, lý do khám, dòng thời gian trạng thái (ai chuyển, lúc nào), ghi chú. **BE:** `GET /admin/appointments/{id}`. | Hiển thị thông tin hành chính, **không** hiển thị chẩn đoán, đơn thuốc. | Mới · P2 |

**Tab Bệnh nhân**

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| AD-PT-09 | **Xem và tìm bệnh nhân.** Là Admin, tôi muốn tìm bệnh nhân theo tên, SĐT, mã bệnh nhân, CCCD để hỗ trợ. | **FE:** tab "Bệnh nhân": bảng (tên, tuổi, SĐT, số lần khám, lần khám gần nhất, trạng thái tài khoản); tìm kiếm; phân trang. **BE:** `GET /admin/patients?q=&page=`; CCCD che bớt số. | Tìm không phân biệt dấu; CCCD hiển thị dạng `****1234`. | Hiện có · đối chiếu · P1 |
| AD-PT-10 | **Xem hồ sơ hành chính và lịch sử lịch hẹn.** Là Admin, tôi muốn xem thông tin cá nhân và các lần đặt/hủy/không đến để xử lý yêu cầu hỗ trợ. | **FE:** panel: thông tin cá nhân, người thân đã liên kết, danh sách lịch hẹn với trạng thái. **BE:** `GET /admin/patients/{id}`, `…/appointments`. | Không hiện dữ liệu y tế trong panel này. | Mới · P1 |
| AD-PT-11 | **Sửa thông tin hành chính.** Là Admin, tôi muốn sửa SĐT hoặc họ tên khi bệnh nhân nhờ chỉnh để dữ liệu đúng. | **FE:** nút Sửa, chỉ các trường hành chính. **BE:** `PUT /admin/patients/{id}`; mọi thay đổi ghi log trước/sau. | Không sửa được dữ liệu y tế ở đây. | Mới · P2 |
| AD-PT-12 | **Xem hồ sơ y tế (EMR) có kiểm soát.** Là Admin, tôi chỉ muốn xem nội dung y tế khi thật cần để bảo vệ quyền riêng tư của bệnh nhân. | **FE:** nút "Xem hồ sơ y tế" hiện hộp nhập lý do (bắt buộc) trước khi mở; hiển thị dấu mờ "Đang xem, đã ghi log". **BE:** `POST /admin/patients/{id}/emr-access` ghi `emr_access_logs` (ai, lý do, lúc nào) rồi trả dữ liệu; thông báo người phụ trách bảo mật. | Không có lý do thì không mở được; mọi lượt xem hiện ở AD-AU-02. | Mới · P1 |
| AD-PT-13 | **Khóa tài khoản bệnh nhân.** Là Admin, tôi muốn khóa tài khoản bị lạm dụng (đặt lịch giả, hay vắng) để bảo vệ lịch khám. | **FE:** nút Khóa kèm lý do; nhãn "Bị khóa". **BE:** `PATCH /admin/patients/{id}/status`; lịch sắp tới xử lý theo AD-PT-04. | Bệnh nhân bị khóa không đặt được lịch qua web/AI, vẫn đặt được qua điện thoại do điều dưỡng. | Mới · P3 |
| AD-PT-14 | **Gộp hồ sơ trùng.** Là Admin, tôi muốn phát hiện và gộp hồ sơ trùng của cùng một người để lịch sử khám đầy đủ. | **FE:** cảnh báo "Có thể trùng" khi trùng SĐT và ngày sinh; màn hình so sánh hai hồ sơ, chọn hồ sơ giữ lại. **BE:** `POST /admin/patients/merge`; chuyển toàn bộ lịch hẹn, hồ sơ sang hồ sơ giữ lại; hồ sơ kia đánh dấu đã gộp; có thể hoàn tác trong 24 giờ. | Không mất lịch hẹn hay bệnh án; log ghi rõ hai mã đã gộp. | Mới · P3 |
| AD-PT-15 | **Xử lý yêu cầu quyền riêng tư.** Là Admin, tôi muốn nhận và xử lý yêu cầu xuất/xóa dữ liệu của bệnh nhân để tuân thủ Nghị định 13/2023/NĐ-CP. | **FE:** danh sách yêu cầu (loại, ngày gửi, hạn xử lý đếm ngược, trạng thái) và checklist xử lý. **BE:** `GET /admin/privacy-requests`, `POST …/{id}/approve\|reject\|complete`; yêu cầu xóa thì ẩn danh/khóa dữ liệu bệnh án bắt buộc lưu thay vì xóa hẳn. | Mỗi yêu cầu có hạn và người phụ trách; bệnh nhân nhận kết quả. Cần rà soát pháp lý. | Mới · P2 |
| AD-PT-16 | **Chính sách quyền riêng tư và đồng ý.** Là Admin, tôi muốn quản lý các phiên bản chính sách quyền riêng tư và theo dõi tỷ lệ bệnh nhân đã đồng ý để chứng minh việc tuân thủ. | **FE:** trang "Quyền riêng tư": danh sách phiên bản chính sách, nút "Phát hành phiên bản mới"; thống kê tỷ lệ đồng ý. **BE:** `GET/POST /admin/privacy-policies`; bệnh nhân phải đồng ý lại khi có phiên bản mới. | Mỗi đồng ý lưu thời điểm và phiên bản chính sách; không sửa phiên bản đã phát hành. | Mới · P3 |

### 2.7 Hàng chờ phê duyệt (AP)
*Màn hình mới: Phê duyệt. Dùng cho các yêu cầu thay đổi cần Admin quyết định. Duyệt **lịch hẹn** chờ duyệt vẫn nằm ở Hồ sơ Bệnh nhân → Ca khám (AD-PT-04).*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| AD-AP-01 | **Hộp "Cần phê duyệt".** Là Admin, tôi muốn có một nơi tập trung mọi yêu cầu cần quyết định để không sót việc. | **FE:** mục "Phê duyệt" trên menu có huy hiệu số lượng; danh sách phân loại: Đổi phí/chuyên khoa bác sĩ · Hoàn tiền vượt hạn mức · Giảm giá/ghi đè phí · Chèn quá sức chứa ca · Đánh giá bị gắn cờ; lọc theo loại và trạng thái. **BE:** `GET /admin/approvals?type=&status=`. | Số trên huy hiệu khớp số yêu cầu đang chờ; yêu cầu mới xuất hiện không cần tải lại trang. | Mới · P2 |
| AD-AP-02 | **Xem chi tiết yêu cầu.** Là Admin, tôi muốn thấy ai yêu cầu, vì sao, và giá trị trước/sau để quyết định đúng. | **FE:** panel bên phải: người yêu cầu, thời điểm, lý do, bảng so sánh "Hiện tại → Đề xuất", liên kết tới đối tượng (bác sĩ, giao dịch, ca trực, đánh giá). **BE:** `GET /admin/approvals/{id}` (trường `payload`). | Mọi loại yêu cầu đều hiển thị được cả giá trị cũ và mới. | Mới · P2 |
| AD-AP-03 | **Duyệt / từ chối.** Là Admin, tôi muốn duyệt hoặc từ chối kèm lý do để người yêu cầu biết kết quả. | **FE:** nút Duyệt, Từ chối (bắt buộc ghi lý do); xác nhận hai bước với yêu cầu nhạy cảm (hoàn tiền, đổi phí). **BE:** `POST /admin/approvals/{id}/approve\|reject`; khi duyệt, hệ thống tự thực thi thay đổi trong cùng một giao dịch rồi thông báo cho người yêu cầu. | Duyệt xong thay đổi có hiệu lực ngay và có log; người yêu cầu nhận kết quả ≤ 1 phút. | Mới · P2 |
| AD-AP-04 | **Duyệt hàng loạt mục an toàn.** Là Admin, tôi muốn chọn nhiều yêu cầu cùng loại và duyệt một lần để tiết kiệm thời gian. | **FE:** ô chọn từng dòng, nút "Duyệt đã chọn"; chỉ cho phép với loại ít rủi ro (đánh giá gắn cờ nhẹ, chèn vượt ít). **BE:** `POST /admin/approvals/bulk-approve`. | Không duyệt hàng loạt được hoàn tiền và đổi phí. | Mới · P3 |
| AD-AP-05 | **Không tự duyệt và hết hạn.** Là Admin, tôi muốn hệ thống chặn việc tự duyệt yêu cầu của chính mình và tự đóng yêu cầu quá hạn để đảm bảo kiểm soát chéo. | **FE:** nút Duyệt bị vô hiệu kèm giải thích khi yêu cầu do chính mình tạo; nhãn "Hết hạn". **BE:** kiểm tra `requested_by != decided_by`; job tự đóng sau X ngày (cấu hình được). | Yêu cầu hết hạn chuyển "Đã đóng" và thông báo cho người yêu cầu. | Mới · P2 |
| AD-AP-06 | **Lịch sử phê duyệt.** Là Admin, tôi muốn xem lại các yêu cầu đã xử lý để đối chiếu khi cần. | **FE:** tab "Đã xử lý": lọc theo loại, người duyệt, thời gian; nút xuất. **BE:** `GET /admin/approvals?status=DONE`. | Hiển thị người duyệt, lý do, thời điểm; không sửa được. | Mới · P2 |

### 2.8 Dịch vụ & Phí (SV)
*Màn hình mới: Dịch vụ & Phí*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| AD-SV-01 | **Danh mục dịch vụ khám.** Là Admin, tôi muốn khai báo các dịch vụ (khám lần đầu, tái khám, khám tổng quát…) để thống nhất cách thu phí. | **FE:** bảng dịch vụ (tên, chuyên khoa, thời lượng mặc định, phí, trạng thái) + Thêm/Sửa/Ẩn. **BE:** `GET/POST/PUT /admin/services`. | Dịch vụ đã phát sinh giao dịch chỉ được ẩn, không xóa. | Mới · P1 |
| AD-SV-02 | **Phí khám theo bác sĩ/chuyên khoa.** Là Admin, tôi muốn đặt phí khám theo chuyên khoa hoặc từng bác sĩ để thu đúng. | **FE:** cột phí trong bảng; có thể ghi đè phí cho từng bác sĩ; chọn "áp dụng từ ngày". **BE:** `service_prices` có `effective_from`; đổi phí cần xác nhận hai bước. | Phí mới không ảnh hưởng lịch đã đặt trước ngày hiệu lực; màn hình thu phí của điều dưỡng lấy đúng phí. | Mới · P1 |
| AD-SV-03 | **Lịch sử thay đổi phí.** Là Admin, tôi muốn xem ai đổi phí khi nào để đối chiếu doanh thu. | **FE:** tab "Lịch sử" trong chi tiết dịch vụ. **BE:** `GET /admin/services/{id}/price-history`. | Hiển thị phí cũ, phí mới, người đổi, ngày hiệu lực. | Mới · P2 |

### 2.9 Thanh toán & Đối soát (PY)
*Màn hình mới: Thanh toán & Đối soát. Chỉ áp dụng nếu chủ phòng khám chốt giữ thanh toán trên hệ thống (FR-09). Cấu hình cổng thanh toán xem AD-CF-07.*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| AD-PY-01 | **Bảng giao dịch.** Là Admin, tôi muốn xem mọi giao dịch để kiểm tra doanh thu. | **FE:** bảng (mã giao dịch, bệnh nhân, lịch hẹn, số tiền, kênh tiền mặt/chuyển khoản/ví, trạng thái, thời gian, người thu); lọc theo trạng thái, kênh, ngày; tìm theo mã. **BE:** `GET /admin/payments?...`. | Tổng tiền các giao dịch thành công trong kỳ khớp doanh thu ở Tổng quan. | Mới · P2 |
| AD-PY-02 | **Đối soát cuối ngày.** Là Admin, tôi muốn so khớp giao dịch trong hệ thống với dữ liệu của cổng thanh toán để phát hiện chênh lệch. | **FE:** tab "Đối soát": chọn ngày, danh sách khớp/lệch, đánh dấu chênh lệch từng giao dịch. **BE:** `POST /admin/reconciliation/run`, `GET /admin/reconciliation/{date}`; job tự chạy hằng đêm. | Chênh lệch được liệt kê rõ từng giao dịch với nguyên nhân gợi ý. | Mới · P2 |
| AD-PY-03 | **Giao dịch treo và lỗi.** Là Admin, tôi muốn xử lý giao dịch đang chờ quá lâu để không mất tiền hoặc giữ chỗ vô ích. | **FE:** danh sách giao dịch treo/lỗi, nút "Kiểm tra lại với cổng". **BE:** truy vấn lại cổng; tự hủy giao dịch quá hạn và trả slot; webhook xác thực chữ ký và chỉ ghi nhận một lần dù gọi lặp. | Giao dịch gọi lặp không tạo bản ghi trùng. | Mới · P2 |
| AD-PY-04 | **Hoàn tiền.** Là Admin, tôi muốn hoàn tiền cho bệnh nhân theo hạn mức và có người duyệt để tránh thất thoát. | **FE:** nút "Hoàn tiền" (số tiền, lý do bắt buộc); vượt hạn mức thì chuyển sang hàng chờ phê duyệt. **BE:** `POST /admin/payments/{id}/refund`; kiểm tra hạn mức. | Mọi khoản hoàn có người duyệt và log; bệnh nhân nhận biên lai hoàn tiền. | Mới · P2 |
| AD-PY-05 | **Kết ca của điều dưỡng.** Là Admin, tôi muốn xem bảng kết ca và chênh lệch tiền mặt của từng ca thu phí để kiểm soát quầy. | **FE:** danh sách ca thu (người thu, tổng thu, chênh lệch), nút "Xác nhận". **BE:** `GET /admin/shifts/{id}/reconciliation`. | Không xác nhận được ca còn giao dịch chưa chốt. | Mới · P3 |
| AD-PY-06 | **Xuất giao dịch và biên lai.** Là Admin, tôi muốn xuất giao dịch ra Excel và xem lại biên lai để phục vụ kế toán. | **FE:** nút "Xuất Excel" theo bộ lọc; nút "Xem biên lai" (PDF). **BE:** `GET /admin/payments/export`. | Tệp xuất đúng bộ lọc đang chọn. | Mới · P3 |

### 2.10 Báo cáo (RP)
*Màn hình mới: Báo cáo*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| AD-RP-01 | **Báo cáo doanh thu.** Là Admin, tôi muốn xem doanh thu theo ngày/tháng, theo bác sĩ, theo chuyên khoa để biết nguồn thu. | **FE:** biểu đồ + bảng chi tiết, bộ lọc kỳ/bác sĩ/chuyên khoa. **BE:** `GET /admin/reports/revenue`. | Tổng doanh thu khớp tổng giao dịch `PAID` trong kỳ. | Mới · P2 |
| AD-RP-02 | **Báo cáo lượt khám và lấp đầy.** Là Admin, tôi muốn xem số lượt khám và tỷ lệ lấp đầy ca để cân đối lịch trực. | **FE:** biểu đồ theo ngày, bảng theo bác sĩ. **BE:** `GET /admin/reports/visits`. | Tỷ lệ lấp đầy = lịch đã đặt / số slot của ca. | Mới · P2 |
| AD-RP-03 | **Báo cáo vắng mặt và hủy lịch.** Là Admin, tôi muốn xem tỷ lệ no-show và lý do hủy để giảm lãng phí giờ khám. | **FE:** biểu đồ theo tuần, top lý do hủy. **BE:** `GET /admin/reports/no-show`. | Công thức nhất quán với thẻ ở Tổng quan (AD-DB-06). | Mới · P2 |
| AD-RP-04 | **Hiệu suất bác sĩ.** Là Admin, tôi muốn so sánh số lượt khám, thời gian khám trung bình, điểm đánh giá giữa các bác sĩ để phân bổ nhân lực. | **FE:** bảng xếp hạng có sắp xếp. **BE:** `GET /admin/reports/doctors`. | Chỉ dùng cho quản lý, không hiện ra bệnh nhân. | Mới · P2 |
| AD-RP-05 | **Giờ cao điểm.** Là Admin, tôi muốn thấy khung giờ đông nhất để xếp ca hợp lý. | **FE:** biểu đồ nhiệt (thứ × giờ). **BE:** `GET /admin/reports/peak-hours`. | Dữ liệu tính từ giờ check-in thực tế. | Mới · P3 |
| AD-RP-06 | **Xuất và gửi báo cáo định kỳ.** Là Admin, tôi muốn xuất Excel/PDF và đặt lịch gửi báo cáo qua email để không phải vào xem mỗi tuần. | **FE:** nút "Xuất"; mục "Gửi định kỳ" (hằng tuần/tháng, người nhận). **BE:** job nền tạo tệp; `POST /admin/reports/schedule`. | Tệp xuất không chứa thông tin định danh bệnh nhân. | Mới · P3 |
| AD-RP-07 | **Kênh đặt lịch.** Là Admin, tôi muốn xem tỷ lệ lịch đặt qua web, trợ lý AI và điện thoại (do điều dưỡng đặt hộ) để đánh giá hiệu quả số hóa. | **FE:** biểu đồ tròn + xu hướng theo tháng. **BE:** `GET /admin/reports/channels`, theo trường `created_via`. | Tổng các kênh bằng tổng lịch trong kỳ. | Mới · P2 |

### 2.11 Đánh giá (RV)
*Màn hình mới: Đánh giá*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| AD-RV-01 | **Xem đánh giá.** Là Admin, tôi muốn xem đánh giá của bệnh nhân và điểm trung bình từng bác sĩ để biết chất lượng. | **FE:** danh sách (sao, nhận xét, bác sĩ, ngày), lọc theo sao/bác sĩ/thời gian, nhãn "bị gắn cờ". **BE:** `GET /admin/reviews`. | Điểm trung bình khớp công thức trung bình các đánh giá đang hiển thị. | Mới · P3 |
| AD-RV-02 | **Ẩn/hiện đánh giá.** Là Admin, tôi muốn ẩn đánh giá có ngôn từ không phù hợp để giữ trang chủ lành mạnh. | **FE:** nút Ẩn bắt buộc chọn lý do. **BE:** `PATCH /admin/reviews/{id}/visibility`; tính lại điểm trung bình. | Không ẩn đánh giá chỉ vì điểm thấp; mọi lần ẩn có log. | Mới · P3 |
| AD-RV-03 | **Phản hồi công khai.** Là Admin, tôi muốn trả lời đánh giá để thể hiện sự quan tâm. | **FE:** ô "Phản hồi". **BE:** `POST /admin/reviews/{id}/reply`. | Phản hồi hiện dưới đánh giá trên trang bác sĩ. | Mới · P3 |
| AD-RV-04 | **Xu hướng điểm và đánh giá thấp.** Là Admin, tôi muốn xem điểm theo từng tiêu chí (bác sĩ, thời gian chờ, cơ sở vật chất) và biết ngay khi có đánh giá thấp để cải thiện. | **FE:** biểu đồ điểm theo thời gian; đánh giá từ 2 sao trở xuống tự gắn cờ và chuyển vào hàng chờ phê duyệt. **BE:** `GET /admin/reviews/trends`. | Đánh giá bị gắn cờ xuất hiện ở AD-AP-01; điểm tính trên các đánh giá đang hiển thị. | Mới · P3 |

### 2.12 Trợ lý AI (AI)
*Màn hình mới: Trợ lý AI. Giai đoạn 3. Trợ lý chỉ gợi ý chuyên khoa, bác sĩ, giờ trống và hỗ trợ đặt lịch, không chẩn đoán, không kê thuốc.*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| AD-AI-01 | **Bật/tắt theo kênh, lời chào.** Là Admin, tôi muốn bật hoặc tắt trợ lý ở từng kênh và chỉnh lời chào để phù hợp phòng khám. | **FE:** công tắc kênh (web, app, Zalo); ô lời chào và giọng điệu; xem trước. **BE:** `GET/PUT /admin/ai/config`. | Tắt kênh nào thì kênh đó hiện nút "Đặt lịch thường" thay cho khung chat. | Mới · P3 |
| AD-AI-02 | **Kịch bản trả lời cố định.** Là Admin, tôi muốn soạn sẵn câu trả lời cho các câu hỏi thường gặp (giờ làm việc, địa chỉ, cách đặt lịch, giấy tờ cần mang) để trả lời chính xác. | **FE:** danh sách câu hỏi và câu trả lời, thêm/sửa/ẩn. **BE:** `GET/PUT /admin/ai/scripts`. | Nội dung cố định luôn được ưu tiên hơn câu trả lời tự sinh. | Mới · P3 |
| AD-AI-03 | **Ánh xạ triệu chứng sang chuyên khoa.** Là Admin, tôi muốn quản lý bảng gợi ý triệu chứng → chuyên khoa (Tim mạch, Thần kinh, Nhi, Nội) để trợ lý gợi ý đúng. | **FE:** bảng ánh xạ có thêm/sửa; trạng thái "Chờ bác sĩ duyệt". **BE:** `GET/PUT /admin/ai/symptom-map`; thay đổi đi qua quy trình duyệt (AD-AP). | Bảng chỉ áp dụng sau khi bác sĩ duyệt; liên kết với mô tả ở AD-CK-04. | Mới · P3 |
| AD-AI-04 | **Từ khóa khẩn cấp.** Là Admin, tôi muốn quản lý danh sách dấu hiệu khẩn cấp và nội dung cảnh báo cấp cứu để bệnh nhân luôn được hướng dẫn kịp thời. | **FE:** danh sách từ khóa, nội dung cảnh báo, ô thử câu mẫu. **BE:** `GET/PUT /admin/ai/emergency`. | Gặp từ khóa thì trợ lý dừng đặt lịch và hiện cảnh báo; không tắt được nếu chưa có nội dung cảnh báo. | Mới · P3 |
| AD-AI-05 | **Giám sát hội thoại.** Là Admin, tôi muốn xem số liệu và các hội thoại bị gắn cờ để biết trợ lý có đang hoạt động tốt. | **FE:** thẻ số hội thoại, tỷ lệ đặt lịch thành công, tỷ lệ chuyển cho nhân viên; danh sách hội thoại gắn cờ; nút "Tốt/Chưa tốt". **BE:** `GET /admin/ai/conversations?flag=`; che CCCD, SĐT trong nội dung hiển thị. | Nội dung hội thoại không hiện số CCCD/SĐT dạng rõ. | Mới · P3 |
| AD-AI-06 | **Tạm dừng khẩn.** Là Admin, tôi muốn tắt trợ lý ngay lập tức khi phát hiện trả lời sai để bảo vệ bệnh nhân. | **FE:** nút đỏ "Tạm dừng khẩn" có xác nhận hai bước. **BE:** `POST /admin/ai/kill-switch`. | Có hiệu lực ngay; bệnh nhân được chuyển sang luồng đặt lịch thường hoặc nhân viên. | Mới · P3 |
| AD-AI-07 | **Phiên bản cấu hình.** Là Admin, tôi muốn xem lịch sử thay đổi cấu hình trợ lý và khôi phục khi cần. | **FE:** nút "Lịch sử", so sánh, "Khôi phục". **BE:** bảng `ai_configs` có `version`. | Khôi phục tạo phiên bản mới, không xóa lịch sử. | Mới · P3 |
| AD-AI-08 | **Chất lượng và chi phí.** Là Admin, tôi muốn đo mức đúng của gợi ý và kiểm soát chi phí để duy trì hiệu quả. | **FE:** thẻ "tỷ lệ gợi ý đúng chuyên khoa" (theo bộ câu hỏi mẫu); ô giới hạn số lượt/ngày; cảnh báo khi gần chạm ngưỡng; thời hạn lưu log hội thoại. **BE:** `PUT /admin/ai/limits`. | Vượt giới hạn thì trợ lý chuyển sang hướng dẫn đặt lịch thường. | Mới · P3 |

### 2.13 Nội dung website (CT)
*Màn hình mới: Nội dung website (cho trang chủ công khai)*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| AD-CT-01 | **Quản lý bài viết sức khỏe.** Là Admin, tôi muốn viết, sửa, xuất bản bài cẩm nang theo 4 chuyên khoa để trang chủ có nội dung. | **FE:** danh sách bài; trình soạn thảo; ảnh bìa; chọn chuyên khoa; nháp/xuất bản. **BE:** `GET/POST/PUT /admin/articles`. | Bài nháp không hiện ra ngoài; có xem trước. | Mới · P3 |
| AD-CT-02 | **Quản lý câu hỏi thường gặp.** Là Admin, tôi muốn thêm/sửa/sắp xếp FAQ để giải đáp sẵn thắc mắc của bệnh nhân. | **FE:** danh sách kéo thả. **BE:** `GET/POST/PUT /admin/faqs`. | Thứ tự trên trang chủ khớp thứ tự đã sắp. | Mới · P3 |
| AD-CT-03 | **Thư viện ảnh cơ sở vật chất.** Là Admin, tôi muốn tải ảnh sảnh, phòng khám, khu chờ lên để bệnh nhân thấy trước. | **FE:** lưới ảnh, tải lên nhiều ảnh, chú thích, sắp xếp. **BE:** `POST /admin/media` (≤ 2 MB mỗi ảnh, jpg/png/webp, tự nén WebP). | Ảnh sai định dạng bị từ chối rõ ràng. | Mới · P3 |
| AD-CT-04 | **Thông tin liên hệ và banner.** Là Admin, tôi muốn sửa hotline, địa chỉ, giờ làm việc, dòng tiêu đề trang chủ để thông tin luôn đúng. | **FE:** form "Thông tin chung". **BE:** `PUT /admin/site-settings`. | Sửa xong trang chủ cập nhật không cần triển khai lại. | Mới · P3 |

### 2.14 Cấu hình hệ thống (CF)
*Màn hình mới: Cấu hình*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| AD-CF-01 | **Chính sách đặt lịch.** Là Admin, tôi muốn chỉnh thời gian giữ chỗ, số ngày đặt trước tối đa, số lịch chưa khám mỗi bệnh nhân để phù hợp thực tế. | **FE:** nhóm "Đặt lịch" (giữ chỗ: mặc định 10 phút; đặt trước tối đa; tối đa 3 lịch chưa khám). **BE:** `GET/PUT /admin/settings/booking`; validate khoảng giá trị. | Giá trị ngoài khoảng cho phép bị từ chối; chỉ áp dụng cho lịch đặt sau thời điểm đổi; có bước xem trước tác động ("áp dụng cho lịch từ ngày …") trước khi lưu. | Mới · P1 |
| AD-CF-02 | **Chính sách hủy/đổi lịch.** Là Admin, tôi muốn đặt hạn hủy, số lần đổi, tỷ lệ hoàn cọc để rõ ràng cho bệnh nhân. | **FE:** nhóm "Hủy/đổi" (hạn hủy: mặc định trước 4 giờ; đổi tối đa 2 lần; mốc hoàn cọc nếu có). **BE:** `PUT /admin/settings/cancellation`. | Lịch đã đặt giữ chính sách cũ, trừ khi Admin chọn "áp dụng cả lịch đang có". | Mới · P1 |
| AD-CF-03 | **Chính sách check-in và vắng mặt.** Là Admin, tôi muốn đặt giờ mở check-in, mức đến muộn, số lần gọi để điều dưỡng làm đúng quy định. | **FE:** nhóm "Check-in & Vắng mặt" (mở trước 60 phút; muộn quá 15 phút; gọi 3 lần cách 5 phút; ngưỡng cảnh báo chờ lâu 30 phút; giới hạn đặt lịch online sau X lần vắng mặt liên tiếp). **BE:** `PUT /admin/settings/checkin`. | Điều dưỡng và màn hình chờ dùng đúng giá trị mới sau khi lưu. | Mới · P2 |
| AD-CF-04 | **Tự động duyệt lịch.** Là Admin, tôi muốn chọn tự động duyệt hay duyệt tay để giảm việc khi lịch ít rủi ro. | **FE:** công tắc "Tự động duyệt lịch" kèm điều kiện (ví dụ lịch cách hiện tại ≥ 24 giờ). **BE:** cờ `auto_approve` trong settings; lịch tự duyệt có `approved_by = SYSTEM`. | Tắt công tắc thì lịch mới vào `PENDING` và hiện ở thẻ "Lịch chờ duyệt". | Mới · P1 |
| AD-CF-05 | **Mẫu thông báo.** Là Admin, tôi muốn chỉnh nội dung thông báo (xác nhận, nhắc lịch, hủy, đổi lịch) để rõ ràng. | **FE:** danh sách mẫu theo sự kiện và kênh (SMS/Email/Zalo/Push); trình soạn có biến `{ten_benh_nhan}`, `{gio_kham}`, `{bac_si}`, `{ma_lich}`; xem trước; đếm ký tự SMS; "Gửi thử"; bật/tắt kênh. **BE:** `GET/PUT /admin/notification-templates`, `POST …/test`. | Biến sai không lưu được; thông báo không chứa thông tin bệnh lý. | Mới · P2 |
| AD-CF-06 | **Thông tin phòng khám.** Là Admin, tôi muốn sửa tên, logo, địa chỉ, hotline dùng chung ở email/biên lai. | **FE:** form "Thông tin phòng khám". **BE:** `PUT /admin/settings/clinic-info`. | Biên lai và email dùng thông tin mới. | Mới · P2 |
| AD-CF-07 | **Cổng thanh toán.** Là Admin, tôi muốn bật/tắt cổng thanh toán và nhập khóa API để thu tiền trực tuyến (nếu giữ FR-09). | **FE:** thẻ từng cổng (VNPay, MoMo, ZaloPay, chuyển khoản): bật/tắt, môi trường thử/thật, ô khóa API chỉ cho nhập mới, không hiển thị lại. **BE:** khóa lưu mã hóa; `PUT /admin/payment-gateways/{id}`. | Khóa API không bao giờ trả về qua API; đổi khóa không làm hỏng giao dịch đang xử lý. | Mới · P3 |
| AD-CF-08 | **Phiên bản cấu hình.** Là Admin, tôi muốn xem lịch sử thay đổi cấu hình và khôi phục khi cấu hình sai. | **FE:** nút "Lịch sử" ở mỗi nhóm, so sánh, "Khôi phục". **BE:** `settings_versions` có `effective_from`. | Khôi phục tạo phiên bản mới, không xóa lịch sử. | Mới · P3 |
| AD-CF-09 | **Theo dõi gửi thông báo và kênh dự phòng.** Là Admin, tôi muốn thấy tỷ lệ gửi thành công theo kênh và cấu hình kênh dự phòng để bệnh nhân luôn nhận được tin. | **FE:** bảng thống kê (thành công/thất bại theo kênh, theo ngày); ô sắp xếp thứ tự dự phòng (ví dụ Zalo → SMS → Email); giới hạn tốc độ gửi. **BE:** `GET /admin/notifications/stats`, `PUT /admin/settings/notification-fallback`. | Kênh lỗi liên tục tự chuyển sang kênh dự phòng; thông báo thất bại hiện ở AD-IN-04. | Mới · P2 |

### 2.15 Tích hợp (IN)
*Màn hình mới: Tích hợp. Theo dõi các kết nối với dịch vụ bên ngoài (SMS, Email, Zalo/ZNS, cổng thanh toán, EMR/HIS nếu phòng khám có).*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| AD-IN-01 | **Trạng thái kết nối.** Là Admin, tôi muốn thấy tình trạng từng kết nối để phát hiện sớm khi dịch vụ bên ngoài gặp sự cố. | **FE:** danh sách kết nối, trạng thái (Hoạt động/Chậm/Lỗi), lần đồng bộ cuối, tỷ lệ lỗi 24 giờ. **BE:** `GET /admin/integrations`. | Trạng thái cập nhật ≤ 1 phút sau khi có lỗi. | Mới · P2 |
| AD-IN-02 | **Cấu hình kết nối.** Là Admin, tôi muốn nhập endpoint, khóa và tần suất đồng bộ để kết nối hoạt động. | **FE:** form từng kết nối; ô khóa chỉ cho nhập mới, không hiển thị lại. **BE:** `PUT /admin/integrations/{id}`; khóa lưu trong Secret Manager. | Khóa không bao giờ trả về qua API. | Mới · P2 |
| AD-IN-03 | **Kiểm tra kết nối và đồng bộ lại.** Là Admin, tôi muốn thử kết nối và đồng bộ lại thủ công để khắc phục nhanh. | **FE:** nút "Kiểm tra kết nối", "Đồng bộ lại". **BE:** `POST /admin/integrations/{id}/test\|resync`. | Kiểm tra kết nối trả kết quả ≤ 10 giây. | Mới · P2 |
| AD-IN-04 | **Hàng đợi lỗi.** Là Admin, tôi muốn xem các tin nhắn/đồng bộ thất bại và thử gửi lại để không mất thông báo quan trọng. | **FE:** danh sách thất bại (nội dung rút gọn, nguyên nhân, số lần thử); nút "Thử lại", "Thử lại tất cả". **BE:** `GET /admin/integrations/{id}/failures`; thử lại có giãn cách tăng dần, quá số lần thì vào hàng đợi lỗi (dead-letter). | Thử lại thành công thì dòng biến mất; không gửi trùng. | Mới · P2 |
| AD-IN-05 | **Cảnh báo khi lỗi liên tục.** Là Admin, tôi muốn được báo khi một kết nối lỗi liên tục để xử lý trước khi ảnh hưởng bệnh nhân. | **FE:** thông báo trên chuông, dòng trong khối "Cần xử lý", email cho Admin. **BE:** ngắt tạm kết nối lỗi (circuit breaker), tự chuyển kênh dự phòng (AD-CF-09). | Lỗi EMR/HIS không làm hỏng luồng đặt lịch; hệ thống đồng bộ bù khi kết nối hồi phục. | Mới · P2 |
| AD-IN-06 | **Ánh xạ mã bệnh nhân với EMR/HIS.** Là Admin, tôi muốn xem và sửa ánh xạ mã bệnh nhân giữa hai hệ thống để không nhầm hồ sơ. | **FE:** bảng ánh xạ, tìm theo mã, công cụ sửa/gỡ trùng (liên kết AD-PT-14). **BE:** `GET/PUT /admin/integrations/emr/mappings`. | Chỉ áp dụng khi phòng khám có kết nối EMR/HIS. | Mới · P3 |

### 2.16 Nhật ký & Bảo mật (AU)
*Màn hình mới: Nhật ký & Bảo mật*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| AD-AU-01 | **Nhật ký hoạt động.** Là Admin, tôi muốn truy vết ai đã làm gì, lúc nào để điều tra khi có sự cố. | **FE:** bảng lọc theo người dùng, hành động, đối tượng, thời gian, IP; bấm dòng xem giá trị trước/sau; nút "Xuất log" (việc xuất cũng được ghi lại). **BE:** `GET /admin/audit-logs`; bảng `audit_logs` chỉ thêm, không sửa/xóa. | Không có API sửa/xóa log; việc xem log của Admin cũng bị ghi lại. | Mới · P1 |
| AD-AU-02 | **Nhật ký xem hồ sơ bệnh nhân.** Là Admin, tôi muốn xem ai đã mở hồ sơ của bệnh nhân nào, vì lý do gì để phát hiện truy cập sai. | **FE:** bảng riêng (người xem, bệnh nhân, lý do, thời điểm), lọc theo người xem/bệnh nhân. **BE:** `GET /admin/emr-access-logs`. | Mọi lượt xem từ AD-PT-12 và từ tài khoản bác sĩ đều xuất hiện. | Mới · P1 |
| AD-AU-03 | **Cảnh báo bất thường.** Là Admin, tôi muốn được báo khi có hành vi lạ (xem hàng loạt hồ sơ, đăng nhập ngoài giờ, sai mật khẩu nhiều lần) để xử lý sớm. | **FE:** danh sách cảnh báo, trạng thái đã xử lý. **BE:** quy tắc phát hiện cấu hình được; gửi thông báo cho Admin. | Cảnh báo gửi ≤ 5 phút sau sự kiện. | Mới · P3 |
| AD-AU-04 | **Phiên đăng nhập đang hoạt động.** Là Admin, tôi muốn xem và thu hồi các phiên đang đăng nhập để chặn truy cập lạ. | **FE:** danh sách thiết bị, IP, thời gian; nút "Đăng xuất phiên này". **BE:** `GET /admin/security/sessions`, `DELETE …/{id}`. | Phiên bị thu hồi mất hiệu lực ngay. | Mới · P3 |
| AD-AU-05 | **Sao lưu và xuất dữ liệu.** Là Admin, tôi muốn xem trạng thái sao lưu và tải bản sao lưu để an tâm về dữ liệu. | **FE:** trang trạng thái (lần sao lưu gần nhất, kết quả), nút "Sao lưu ngay", tải tệp mã hóa. **BE:** job sao lưu hằng ngày; `POST /admin/backups`. | Sao lưu hằng ngày; mất dữ liệu tối đa 24 giờ, khôi phục trong 4 giờ (đề xuất). | Mới · P3 |

---

---

## 3. Dữ liệu bổ sung (ngoài các bảng đã có)

| Bảng / trường | Dùng cho |
| --- | --- |
| `staff.status` (INVITED/ACTIVE/LOCKED/ARCHIVED), `last_login_at` | AD-HR |
| `doctor_profiles` (avatar, degree, experience_years, bio, is_public) | AD-HR-08 |
| `doctor_credentials` (license_no, issued_by, issued_at, expires_at, scan_url) | AD-HR-09 |
| `roles`, `permissions`, `role_permissions` (kèm cờ `mfa_required`) | AD-HR-13, AD-HR-15 |
| `schedules.capacity`, `time_slots`, `time_off`, `clinic_holidays`, `schedule_templates` | AD-SC, AD-CK-07 |
| `clinics`, `rooms` (mọi bảng nghiệp vụ có `clinic_id` để thêm chi nhánh) | AD-CK |
| `specialties.description / symptoms_hint / icon / sort_order / is_visible` | AD-CK-04 |
| `services`, `service_prices` (service_id, doctor_id, amount, effective_from) | AD-SV |
| `appointments.approved_by`, `approved_at`, `reject_reason`, `created_via` | AD-PT-04, AD-RP-07 |
| `appointment_status_history` (appointment_id, from, to, actor_id, at) | AD-PT-08 |
| `approval_requests` (id, type, payload, requested_by, status, decided_by, reason, decided_at) | AD-AP |
| `patients.status`, `merged_into_id` | AD-PT-13, AD-PT-14 |
| `emr_access_logs` (actor_id, patient_id, reason, at) | AD-PT-12, AD-AU-02 |
| `privacy_requests` (patient_id, type, status, due_at, handled_by, evidence_ref), `privacy_policies` | AD-PT-15, AD-PT-16 |
| `payments`, `payment_gateways` (provider, env, secret_ref), `reconciliations` (date, matched, mismatched) | AD-PY, AD-CF-07 |
| `reviews.is_hidden`, `hidden_reason`, `reply` | AD-RV |
| `articles`, `faqs`, `media`, `site_settings` | AD-CT |
| `settings`, `settings_versions`, `notification_templates`, `notification_logs` | AD-CF |
| `ai_configs` (version, symptom_map, emergency_keywords, status), `ai_flags` (conversation_id, reason) | AD-AI |
| `integrations` (provider, status, last_sync_at), `integration_failures` (payload, error, retry_count) | AD-IN |
| `audit_logs` (actor_id, action, resource, resource_id, before, after, ip, created_at), chỉ thêm | AD-AU-01 |

## 4. Yêu cầu phi chức năng cho Admin
- **Bảo mật:** vai trò kiểm tra ở backend; MFA cho Admin; tự đăng xuất sau 15 phút; khóa tài khoản sau 5 lần sai; mã hóa dữ liệu y tế; khóa API lưu trong Secret Manager; nhật ký bất biến.
- **Độ tin cậy:** cấu hình có phiên bản và khôi phục; thao tác duyệt và hàng loạt chạy trong giao dịch; hoàn tác được trong thời gian ngắn; lỗi dịch vụ ngoài không làm sập luồng đặt lịch.
- **Hiệu năng:** màn hình danh sách tải < 2 giây với 20 dòng/trang; báo cáo 1 tháng tải < 3 giây; số liệu dashboard cache 30–60 giây; thao tác nặng (xuất dữ liệu, đối soát) chạy nền.
- **Mở rộng:** thiết kế theo `clinic_id` để thêm chi nhánh mà không phải triển khai lại.
- **Trải nghiệm:** ưu tiên màn hình máy tính, đủ dùng trên tablet; mọi danh sách có tìm kiếm, lọc, phân trang; hành động hủy/khóa có bước xác nhận rõ ràng; thông báo lỗi chỉ ra cách khắc phục.
- **Pháp lý:** tuân thủ Nghị định 13/2023/NĐ-CP; thời hạn lưu bệnh án và nhật ký, xử lý yêu cầu xóa dữ liệu cần tư vấn pháp lý xác nhận.

## 5. Lộ trình phát triển đề xuất

| Giai đoạn | Nội dung | Story |
| --- | --- | --- |
| **1 – Hoàn thiện cái đang có** | Duyệt lịch chờ duyệt, điều phối ca khám, khóa/sửa nhân sự, hồ sơ bác sĩ, sửa/chống trùng/nghỉ cho lịch trực, dịch vụ và phí, chính sách đặt lịch, nhật ký | AD-DB-01..03, AD-AC-03, 05, AD-HR-05..08, 10, 11, AD-SC-09, 10, 12, 13, AD-PT-03..07, 10, 12, AD-SV-01, 02, AD-CF-01, 02, 04, AD-AU-01, 02 |
| **2 – Vận hành tốt hơn** | Dashboard mới, phê duyệt, thanh toán và đối soát, báo cáo, chứng chỉ, phân quyền, MFA, thông báo, theo dõi kết nối | AD-DB-04..07, AD-AC-01, 04, 06, 07, AD-HR-09, 13, 15, AD-SC-11, 14, AD-CK-04, 07, AD-PT-08, 11, 15, AD-AP-01..03, 05, 06, AD-PY-01..04, AD-RP-01..04, 07, AD-CF-03, 05, 06, 09, AD-IN-01..05 |
| **3 – Hoàn thiện** | Trợ lý AI, nội dung website, đánh giá, gộp hồ sơ, cảnh báo bất thường, sao lưu, EMR/HIS, xuất báo cáo | còn lại |

## 6. Câu hỏi cần chốt / đối chiếu với code
1. Cột "Điều khiển" ở Quản lý Nhân sự, Chuyên khoa, Cơ sở, Điều phối hiện có những nút nào? (các story đánh dấu "đối chiếu").
2. Ai duyệt lịch `PENDING`: chỉ Admin hay cả Điều dưỡng? Có bật tự động duyệt không (AD-CF-04)?
3. Hệ thống còn thu phí/đặt cọc không (FR-09)? Nếu không, các story AD-SV, AD-PY, AD-CF-07 cần điều chỉnh hoặc chuyển giai đoạn sau.
4. Có làm trợ lý AI trong phạm vi dự án không? Nếu không, bỏ module AI và các story liên quan ở CK-04.
5. Bác sĩ có được gửi yêu cầu đổi phí/chuyên khoa để Admin duyệt (AD-AP), hay chỉ Admin sửa trực tiếp?
6. Admin có được xem hồ sơ y tế không? (AD-PT-12 giả định: được, nhưng cần lý do và ghi log.)
7. Có làm trang chủ công khai và nội dung website trong giai đoạn đầu không (AD-CT)?
8. Có hệ thống EMR/HIS bên ngoài cần kết nối không (AD-IN-06)?
9. Số người dùng đồng thời dự kiến, thời hạn lưu nhật ký và bệnh án.
10. Endpoint thực tế trong `backend` có khác tên đề xuất ở trên không.

## Phụ lục A. Đối chiếu bản v1 với mã mới

| Bản v1 | Nay nằm ở |
| --- | --- |
| US-01 Quản lý tài khoản nhân sự | AD-HR-01..07, 10..12, 14, 15 |
| US-02 Phân quyền theo vai trò | AD-HR-13, AD-HR-15 |
| US-03 Hồ sơ bác sĩ và chuyên khoa | AD-HR-08, 09; AD-CK-01..04 |
| US-04 Cơ sở, phòng khám, dịch vụ khám | AD-CK-05..07; AD-SV-01..03 (đã bỏ dịch vụ tư vấn video) |
| US-05 Giám sát lịch làm việc | AD-SC-01..18 |
| US-06 Hàng chờ phê duyệt | AD-AP-01..06; lịch hẹn chờ duyệt: AD-PT-04 |
| US-07 Cấu hình chính sách | AD-CF-01..04, 08 (đã bỏ nhóm "Khám từ xa") |
| US-08 Mẫu và kênh thông báo | AD-CF-05, 09 |
| US-09 Thanh toán và đối soát | AD-CF-07; AD-PY-01..06 |
| US-10 Trợ lý AI | AD-AI-01..08 (đã bỏ "giá" khỏi kịch bản) |
| US-11 Báo cáo thời gian thực | AD-DB-04..08; AD-RP-01..07 |
| US-12 Kiểm duyệt đánh giá | AD-RV-01..04 |
| US-13 Tích hợp bên ngoài | AD-IN-01..06 (đã bỏ dịch vụ video) |
| US-14 Nhật ký và bảo mật | AD-AU-01..05 |
| US-15 Quyền riêng tư | AD-PT-15, 16 |

## Lịch sử thay đổi

| Phiên bản | Ngày | Người sửa | Nội dung |
| --- | --- | --- | --- |
| 1.0 | 20/10/2026 | | Tạo mới theo hiện trạng giao diện: 12 module |
| 2.0 | 20/10/2026 | | Hợp nhất với bản user story cũ: thêm Phê duyệt, Thanh toán & Đối soát, Trợ lý AI, Tích hợp; thêm chi tiết lịch trực, thông báo, báo cáo, đánh giá, quyền riêng tư; bỏ khám từ xa |