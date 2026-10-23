# MediCare – User Story giao diện Bác sĩ

*Phiên bản: 2.0 · Cập nhật: 20/10/2026 · Phạm vi: phòng khám 4 chuyên khoa (Tim mạch, Thần kinh, Nhi, Nội), 4 bác sĩ chính và đội ngũ điều dưỡng, không khám từ xa*

---

## 1. Tổng quan

### 1.1 Mục đích, nguồn và phạm vi
Giao diện Bác sĩ là nơi bác sĩ xem lịch làm việc và lịch hẹn, theo dõi hàng đợi, xem hồ sơ bệnh nhân, ghi bệnh án, kê đơn, chỉ định và hẹn tái khám. Tài liệu mô tả từng chức năng từ tổng quan đến chi tiết từng nút, ô nhập và trạng thái, để làm căn cứ cập nhật giao diện. Mỗi chức năng là một user story có phần giao diện (FE), backend (BE) và tiêu chí nghiệm thu (AC).

**Nhân vật:** BS. Minh, 38 tuổi, khám 20–30 bệnh nhân mỗi ngày, dùng máy tính tại phòng khám và điện thoại khi di chuyển. Anh cần thao tác nhanh, ít bấm, và không bị gián đoạn khi đang khám.

**Phân quyền (nguyên tắc tối thiểu cần thiết):**
- **Được:** xem lịch của chính mình; xem hồ sơ bệnh nhân **có lịch hẹn với mình**; ghi bệnh án, kê đơn, chỉ định, hẹn tái khám; đăng ký nghỉ; xem thống kê và đánh giá của chính mình.
- **Không được:** xem bệnh nhân không có lịch với mình (trừ khi Admin cấp quyền); xem lịch hay thống kê của bác sĩ khác; xem dữ liệu thanh toán, doanh thu của phòng khám; tự đổi giá dịch vụ; sửa bệnh án đã hoàn tất mà không tạo bản sửa đổi.
- **Nguyên tắc chuyên môn:** các cảnh báo (dị ứng, tương tác thuốc, chỉ số bất thường) chỉ hỗ trợ; quyết định chuyên môn cuối cùng luôn thuộc về bác sĩ.

**Nguồn:** bản v1 (15 user story theo epic) và phạm vi đã chốt cho `admin.md`, `patient.md`, `nurse.md`.

**Khác với v1:**
- Bỏ khám từ xa: bỏ story "Tư vấn video" (v1 US-13), bỏ hình thức "Video" trong form ca, nhãn "Video" trên danh sách bệnh nhân, và lựa chọn hình thức khi hẹn tái khám.
- Vòng đời lịch hẹn theo mã đang dùng trong code (`PENDING`…`PAID`); bỏ trạng thái riêng `RESCHEDULE_REQUESTED`: "đề xuất đổi giờ" là một yêu cầu gắn vào lịch, không phải trạng thái chính.
- Đổi "lễ tân" thành "điều dưỡng"; sửa mã yêu cầu theo tài liệu hiện hành (báo cáo là FR-10, đánh giá là FR-11, không còn FR-12).
- Nối với phần điều dưỡng: bác sĩ thấy sinh hiệu và ghi chú check-in do điều dưỡng nhập, nhận cảnh báo chỉ số nguy cấp; khám xong thì lịch sang bước chờ thanh toán của điều dưỡng.
- Bổ sung: ghi chú nội bộ của bác sĩ, cảnh báo liều cho trẻ em (khoa Nhi), mẫu khám theo 4 chuyên khoa, báo trễ, nhật ký xem hồ sơ, chứng chỉ hành nghề.

Endpoint ghi trong tài liệu là **đề xuất**, cần đối chiếu với `backend`. Phụ lục A đối chiếu story v1 với mã mới.

### 1.2 Hiện trạng giao diện
Chưa có ảnh chụp hay code giao diện Bác sĩ hiện tại, nên chưa thể xác định chức năng nào đã làm. Vì vậy mọi story lấy từ v1 gắn nhãn **v1** (đặc tả cũ, cần đối chiếu với code), còn story thêm mới gắn nhãn **Mới**. Khi có ảnh chụp hoặc code, đổi "v1" thành "Hiện có" cho phần đã làm.

### 1.3 Tính năng đề xuất thêm so với v1

| Ưu tiên | Tính năng | Vì sao hữu ích |
| --- | --- | --- |
| P1 | Thấy sinh hiệu, ghi chú check-in và nhãn ưu tiên do điều dưỡng nhập | Không phải hỏi lại, khám nhanh hơn |
| P1 | Cảnh báo chỉ số nguy cấp từ tiền khám | Xử lý sớm bệnh nhân nặng |
| P1 | Nhật ký xem hồ sơ và nhắc "lượt xem được ghi lại" | Minh bạch, an toàn dữ liệu y tế |
| P1 | Khám xong chuyển sang chờ thanh toán của điều dưỡng | Nối liền luồng khám và thu phí |
| P1 | Điều dưỡng và bác sĩ cùng gọi bệnh nhân không xung đột | Tránh gọi trùng |
| P2 | Ghi chú nội bộ chỉ bác sĩ xem | Lưu nhận định riêng, không lộ cho người khác |
| P2 | Cảnh báo liều theo cân nặng cho trẻ em | Khoa Nhi, an toàn kê đơn |
| P2 | Báo trễ ("tôi trễ 20 phút") | Điều dưỡng thông báo cho cả hàng đợi |
| P2 | Mẫu khám theo từng chuyên khoa | Ghi bệnh án nhanh |
| P3 | Biểu đồ sinh hiệu theo thời gian, cảnh báo chứng chỉ hành nghề sắp hết hạn | Theo dõi bệnh mạn tính và tuân thủ |

### 1.4 Sơ đồ menu đề xuất

```
HÔM NAY
  Tổng quan                 (bệnh nhân tiếp theo, cảnh báo)
  Hàng đợi hôm nay          (gọi bệnh nhân)
  Phòng khám                (màn hình khám: hồ sơ, bệnh án, kê đơn, chỉ định)
LỊCH
  Lịch hẹn                  (ngày/tuần/tháng/danh sách, chờ xác nhận)
  Lịch làm việc             (ca trực, đăng ký nghỉ)
HỒ SƠ
  Hồ sơ bệnh nhân           (tra cứu bệnh nhân có lịch với tôi)
  Thống kê & Đánh giá
KHÁC
  Thông báo
  Tài khoản
```

Mã module: AC (Tài khoản), DB (Tổng quan), SC (Lịch làm việc), LH (Lịch hẹn), HD (Hàng đợi), HS (Hồ sơ bệnh nhân), KH (Khám bệnh), DT (Kê đơn), CD (Chỉ định và tái khám), NT (Thông báo), TK (Thống kê và đánh giá), GN (Khung chung).

### 1.5 Nguyên tắc chung và quy ước
- **Nhanh và không gián đoạn.** Ưu tiên màn hình máy tính và máy tính bảng; phím tắt ở màn hình khám; tự lưu nháp; mất mạng không mất dữ liệu.
- **Dị ứng luôn thấy rõ** ở mọi màn hình liên quan đến khám và kê đơn.
- **Mọi lượt xem hồ sơ bệnh nhân đều được ghi nhật ký**; bệnh nhân có thể xem ai đã mở hồ sơ của mình (BN-PV-06).
- **Bệnh án đã hoàn tất không sửa trực tiếp**, chỉ tạo bản sửa đổi có lý do và dấu vết.
- **Phối hợp với điều dưỡng:** sinh hiệu do điều dưỡng nhập (DD-TK); hàng đợi dùng chung (DD-HD).
- **Nhãn:** **v1** = có trong đặc tả cũ, cần đối chiếu code; **Mới** = đề xuất thêm. Ưu tiên P1 (làm trước), P2 (nên có), P3 (làm sau).
- **Giá trị đề xuất** (chủ phòng khám chốt, chỉnh ở Admin mục Cấu hình): tự đăng xuất sau 15 phút, cảnh báo chờ lâu 30 phút, gọi 3 lần cách 5 phút thì đánh dấu vắng mặt, tự lưu nháp mỗi 10 giây.

**Nhãn trạng thái lịch hẹn trên giao diện Bác sĩ:**

| Mã | Nhãn hiển thị | Ai chuyển |
| --- | --- | --- |
| `PENDING` | Chờ xác nhận | Hệ thống |
| `CONFIRMED` | Đã xác nhận | Người duyệt (xem câu hỏi 2 mục 6) |
| `CHECKED_IN` | Đã check-in, đang chờ | Bệnh nhân / điều dưỡng |
| `TRIAGED` | Đã đo sinh hiệu, sẵn sàng khám | Điều dưỡng |
| `IN_PROGRESS` | Đang khám | **Bác sĩ** (bắt đầu khám) |
| `COMPLETED` | Đã khám xong (chờ thanh toán nếu có thu phí) | **Bác sĩ** (hoàn tất khám) |
| `PAID` | Hoàn tất | Điều dưỡng |
| `CANCELLED` | Đã hủy | Bệnh nhân / điều dưỡng / Admin / hệ thống |
| `NO_SHOW` | Vắng mặt | Hệ thống / điều dưỡng (sau 3 lần gọi) |

---

## 2. Chi tiết theo module

### 2.1 Tài khoản và bảo mật (AC)
*Màn hình: Đăng nhập, Tài khoản*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| BS-AC-01 | **Đăng nhập.** Là bác sĩ, tôi muốn đăng nhập bằng email/SĐT và mật khẩu để vào hệ thống. | **FE:** form đăng nhập, ẩn/hiện mật khẩu, thông báo lỗi rõ ràng. **BE:** `POST /auth/login`; JWT truy cập 15 phút + refresh token trong cookie `httpOnly`; kiểm tra vai trò `DOCTOR`; ghi nhật ký mọi lần đăng nhập (IP, thiết bị). | Sai quá 5 lần thì khóa tài khoản 15 phút. | v1 · P1 |
| BS-AC-02 | **Xác thực hai lớp (MFA).** Là bác sĩ, tôi muốn nhập mã xác thực để dữ liệu bệnh nhân không bị truy cập trái phép. | **FE:** ô nhập mã 6 số, nút gửi lại. **BE:** `POST /auth/mfa/verify`. | Không có mã đúng thì không vào được; mã hết hạn báo rõ. | v1 · P1 |
| BS-AC-03 | **Quên mật khẩu.** Là bác sĩ, tôi muốn lấy lại mật khẩu khi quên để vào lại hệ thống. | **FE:** liên kết "Quên mật khẩu" → nhập email/SĐT → nhận link → đặt mật khẩu mới. **BE:** link dùng một lần, có hạn; có thể do Admin gửi lại (AD-HR-11). | Đặt xong các phiên cũ bị đăng xuất. | v1 · P1 |
| BS-AC-04 | **Hết phiên và làm mới phiên.** Là bác sĩ, tôi muốn phiên làm việc tự làm mới và chỉ đăng xuất khi thật sự không dùng để không mất dữ liệu đang nhập. | **FE:** cảnh báo đếm ngược trước khi tự đăng xuất (sau 15 phút không hoạt động). **BE:** `POST /auth/refresh`. | Token hết hạn tự làm mới, không mất bệnh án đang nhập; nháp được lưu trước khi đăng xuất. | v1 · P1 |
| BS-AC-05 | **Đăng xuất.** Là bác sĩ, tôi muốn đăng xuất khi rời máy dùng chung để không lộ hồ sơ. | **FE:** nút "Đăng xuất" trong menu tài khoản. **BE:** `POST /auth/logout` hủy token. | Đăng xuất xong bấm Back không xem lại được dữ liệu cũ. | Mới · P1 |
| BS-AC-06 | **Hồ sơ cá nhân.** Là bác sĩ, tôi muốn cập nhật ảnh, học vị, kinh nghiệm, giới thiệu để bệnh nhân thấy thông tin đúng khi chọn bác sĩ. | **FE:** trang hồ sơ xem/sửa; tải ảnh có cắt khung 4:5 (≤ 2 MB, jpg/png/webp). **BE:** `GET/PUT /doctors/me`, `POST /doctors/me/avatar`. Dữ liệu hiển thị ở thẻ bác sĩ trên trang chủ (AD-HR-08). | Ảnh sai định dạng bị từ chối; thay đổi hiện trên trang chủ sau khi lưu. | v1 · P2 |
| BS-AC-07 | **Đổi mật khẩu.** Là bác sĩ, tôi muốn đổi mật khẩu khi cần để giữ tài khoản an toàn. | **FE:** mục "Đổi mật khẩu": mật khẩu cũ, mới, nhập lại, thanh đo độ mạnh. **BE:** `PUT /doctors/me/password`. | Đổi xong các thiết bị khác bị đăng xuất. | v1 · P2 |
| BS-AC-08 | **Đề nghị đổi phí khám hoặc chuyên khoa.** Là bác sĩ, tôi muốn gửi đề nghị đổi để Admin xem xét thay vì tự đổi. | **FE:** nút "Đề nghị thay đổi" trong hồ sơ; nhãn "Chờ duyệt" trên mục đang chờ. **BE:** tạo yêu cầu ở AD-AP-01 (loại "Đổi phí/chuyên khoa bác sĩ"), trạng thái `PENDING_APPROVAL`. | Bác sĩ không tự sửa được giá; nhận thông báo khi được duyệt hoặc từ chối. | v1 · P3 |
| BS-AC-09 | **Chọn kênh nhận thông báo.** Là bác sĩ, tôi muốn bật hoặc tắt kênh nhận thông báo để phù hợp thói quen. | **FE:** công tắc Email, SMS, Zalo, Push. **BE:** `PUT /doctors/me/notification-settings`. | Thông báo thiết yếu (chỉ số nguy cấp, lịch bị hủy) không tắt hết được. | v1 · P2 |
| BS-AC-10 | **Chứng chỉ hành nghề.** Là bác sĩ, tôi muốn xem số chứng chỉ và ngày hết hạn, được nhắc trước để kịp gia hạn. | **FE:** mục "Chứng chỉ" (chỉ xem, do Admin nhập), nhãn đỏ khi còn dưới 30 ngày. **BE:** dữ liệu từ AD-HR-09. | Nhắc trước 30 ngày qua thông báo. | Mới · P3 |

### 2.2 Tổng quan trong ngày (DB)
*Màn hình: Tổng quan*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| BS-DB-01 | **Thẻ số liệu.** Là bác sĩ, tôi muốn thấy tình hình hôm nay ngay khi mở hệ thống để chuẩn bị ca khám. | **FE:** 4 thẻ: Tổng lịch hôm nay, Đã check-in, Đang chờ, Đã khám xong. **BE:** `GET /doctors/me/dashboard?date=`; cache 30 giây. | Số khớp với hàng đợi và danh sách lịch. | v1 · P1 |
| BS-DB-02 | **Bệnh nhân tiếp theo.** Là bác sĩ, tôi muốn biết ai sẽ vào khám tiếp để chuẩn bị. | **FE:** danh sách: tên, giờ hẹn, lý do khám, nhãn "Khám mới" / "Tái khám", dấu ưu tiên. (Bỏ nhãn "Video".) | Bấm vào mở hồ sơ bệnh nhân đó. | v1 · P1 |
| BS-DB-03 | **Cảnh báo.** Là bác sĩ, tôi muốn được báo các việc cần xử lý để không bỏ sót. | **FE:** khối cảnh báo: lịch chờ xác nhận, yêu cầu đổi lịch chưa xử lý, kết quả xét nghiệm mới, **chỉ số nguy cấp** từ điều dưỡng (nổi bật đỏ). | Cảnh báo nguy cấp hiện ≤ 3 giây sau khi điều dưỡng lưu. | v1 · P1 (nguy cấp: Mới) |
| BS-DB-04 | **Cập nhật thời gian thực.** Là bác sĩ, tôi muốn trang tự cập nhật khi có bệnh nhân check-in hay lịch bị hủy để khỏi tải lại. | **BE:** kênh WebSocket/SSE `doctor:{id}` đẩy `appointment.checked_in`, `appointment.cancelled`, `triage.critical`. | Thay đổi xuất hiện trong ≤ 3 giây. | v1 · P1 |
| BS-DB-05 | **Thẻ và dòng bấm được.** Là bác sĩ, tôi muốn bấm vào thẻ hoặc cảnh báo để đi thẳng tới nơi xử lý. | **FE:** "Đang chờ" mở Hàng đợi; "Chờ xác nhận" mở Lịch hẹn đã lọc; cảnh báo nguy cấp mở màn hình khám của bệnh nhân đó. | Mở đúng màn hình với bộ lọc đã áp dụng. | Mới · P2 |
| BS-DB-06 | **Bệnh nhân chờ lâu hoặc được ưu tiên.** Là bác sĩ, tôi muốn thấy nổi bật ai đang chờ lâu hay được điều dưỡng ưu tiên để gọi hợp lý. | **FE:** dòng đổi màu vàng/đỏ theo thời gian chờ; nhãn "Được ưu tiên" kèm lý do. | Ngưỡng lấy từ cấu hình (AD-CF-03). | Mới · P2 |
| BS-DB-07 | **Trạng thái tải, trống, lỗi.** Là bác sĩ, tôi muốn màn hình báo rõ khi đang tải, chưa có lịch hoặc lỗi. | **FE:** khung xương khi tải; "Hôm nay chưa có lịch hẹn"; lỗi có nút "Thử lại". | Không để màn hình trống trắng khi lỗi. | Mới · P2 |
| BS-DB-08 | **Ca làm việc hôm nay.** Là bác sĩ, tôi muốn thấy ca và phòng của mình hôm nay để biết mình khám ở đâu, mấy giờ. | **FE:** thẻ nhỏ: giờ ca, phòng, số slot đã đặt/tối đa. | Khớp với lịch trực do Admin phân công. | Mới · P3 |

### 2.3 Lịch làm việc (SC)
*Màn hình: Lịch làm việc. Ca trực do Admin phân công (AD-SC); bác sĩ xem và đăng ký nghỉ.*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| BS-SC-01 | **Xem lịch trực của tôi.** Là bác sĩ, tôi muốn xem các ca của mình theo tuần/tháng để biết khi nào phải có mặt. | **FE:** lịch tuần/tháng; mỗi ca có giờ, phòng, cơ sở, số slot; ca nghỉ hiện màu khác. **BE:** `GET /doctors/me/schedules`. | Chỉ thấy ca của mình; ca do Admin xếp có nhãn "Do phòng khám phân công". | v1 · P1 |
| BS-SC-02 | **Chi tiết ca.** Là bác sĩ, tôi muốn mở một ca để xem số bệnh nhân đã đặt và các slot. | **FE:** panel bên phải: giờ, phòng, thời lượng mỗi lượt, đã đặt/tối đa, danh sách slot và bệnh nhân. | Khớp với dữ liệu lịch hẹn. | Mới · P2 |
| BS-SC-03 | **Đăng ký nghỉ hoặc bận đột xuất.** Là bác sĩ, tôi muốn đánh dấu ngày nghỉ hoặc khung giờ bận để hệ thống chặn đặt lịch. | **FE:** nút "Đăng ký nghỉ": chọn ngày hoặc khoảng giờ, lý do; xác nhận hai bước. **BE:** `POST /doctors/me/time-off`; khóa slot ngay lập tức; ghi nhật ký. | Slot bị khóa ngay sau khi lưu; Admin và điều dưỡng nhận cảnh báo (AD-SC-12, DD-PS-01). | v1 · P1 |
| BS-SC-04 | **Xử lý lịch hẹn bị ảnh hưởng.** Là bác sĩ, tôi muốn thấy các lịch đã đặt trong khoảng nghỉ và chọn hướng xử lý để bệnh nhân không bị bỏ lửng. | **FE:** cửa sổ liệt kê lịch bị ảnh hưởng; mỗi dòng có: đề xuất bác sĩ thay thế, đề xuất giờ mới, hủy kèm thông báo. **BE:** tạo job thông báo từng bệnh nhân; dùng cùng luồng AD-SC-13 và DD-PS-02. | Mọi bệnh nhân bị ảnh hưởng nhận thông báo trong ≤ 1 phút; không lịch nào bị bỏ lửng. | v1 · P1 |
| BS-SC-05 | **Sửa hoặc hủy đăng ký nghỉ.** Là bác sĩ, tôi muốn hủy đăng ký nghỉ khi đổi ý để mở lại giờ khám. | **FE:** nút "Hủy nghỉ" trên đợt nghỉ chưa diễn ra; hộp xác nhận. **BE:** `DELETE /doctors/me/time-off/{id}`; mở lại slot chưa bị xử lý. | Lịch đã bị hủy hoặc dời không tự khôi phục. | Mới · P2 |
| BS-SC-06 | **Đề nghị đổi hoặc thêm ca.** Là bác sĩ, tôi muốn đề nghị phòng khám đổi ca để phù hợp lịch cá nhân. | **FE:** nút "Đề nghị đổi ca" (ngày, giờ, lý do). **BE:** gửi yêu cầu cho Admin duyệt (cần thêm loại yêu cầu ở AD-AP). | Đề nghị hiện nhãn "Chờ duyệt" cho đến khi Admin xử lý. | Mới · P3 |
| BS-SC-07 | **Tự thiết lập khung giờ (nếu được phép).** Là bác sĩ, tôi muốn tự đặt ca theo tuần để bệnh nhân chỉ đặt được giờ tôi khám. | **FE:** lưới tuần kéo thả; form: ngày lặp lại, giờ, thời lượng mỗi lượt (15/20/30 phút), số bệnh nhân tối đa mỗi ca; "Sao chép sang tuần sau"; xem trước số slot. (Bỏ lựa chọn hình thức Video.) **BE:** `GET/POST/PUT/DELETE /doctors/me/schedules`; sinh `time_slots`; kiểm tra chồng ca; sửa ca đã có lịch hẹn trả `409` kèm danh sách lịch bị ảnh hưởng. | Không tạo được hai ca chồng giờ; chỉ làm khi chủ phòng khám cho phép (câu hỏi 3 mục 6). | v1 · P3 |
| BS-SC-08 | **Xuất lịch trực.** Là bác sĩ, tôi muốn in hoặc đưa lịch trực vào lịch điện thoại để nhớ. | **FE:** nút "Xuất PDF", "Thêm vào lịch điện thoại" (.ics). | Tệp đúng giờ và địa điểm. | Mới · P3 |

### 2.4 Lịch hẹn (LH)
*Màn hình: Lịch hẹn*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| BS-LH-01 | **Xem lịch hẹn.** Là bác sĩ, tôi muốn xem lịch dạng calendar hoặc danh sách để nắm khối lượng công việc. | **FE:** chuyển Ngày/Tuần/Tháng/Danh sách; mã màu theo trạng thái. **BE:** `GET /doctors/me/appointments?from=&to=&status=&type=&q=&page=`; phân trang; chỉ trả lịch của chính bác sĩ. | Tải một tuần có 150 lịch dưới 2 giây; xem lịch bác sĩ khác trả `403`. | v1 · P1 |
| BS-LH-02 | **Lọc và tìm.** Là bác sĩ, tôi muốn lọc và tìm để tìm nhanh một bệnh nhân. | **FE:** lọc theo trạng thái, khám mới/tái khám; ô tìm theo tên, SĐT, mã lịch. (Bỏ lọc "hình thức khám".) | Lọc kết hợp được; tìm không phân biệt dấu. | v1 · P1 |
| BS-LH-03 | **Chi tiết lịch.** Là bác sĩ, tôi muốn mở một lịch để xem thông tin bệnh nhân khai và chuẩn bị. | **FE:** panel bên phải: thông tin bệnh nhân, triệu chứng và lý do đã khai, ảnh/kết quả đính kèm, ghi chú đặt lịch, ghi chú check-in của điều dưỡng, nút mở hồ sơ. | Không hiển thị dữ liệu thanh toán. | v1 · P1 |
| BS-LH-04 | **Tab "Chờ xác nhận".** Là bác sĩ, tôi muốn có nơi tập trung các lịch chờ tôi phản hồi để xử lý sớm. | **FE:** tab có huy hiệu số lượng; chỉ hiện nếu bác sĩ là người duyệt (câu hỏi 2 mục 6). | Số trên huy hiệu khớp số lịch `PENDING` của mình. | v1 · P1 |
| BS-LH-05 | **Xác nhận lịch.** Là bác sĩ, tôi muốn xác nhận lịch để bệnh nhân biết kết quả sớm. | **FE:** nút "Xác nhận". **BE:** `PATCH /appointments/{id}/confirm`; phát `appointment.updated`; gửi thông báo cho bệnh nhân. | Bệnh nhân nhận thông báo trong ≤ 1 phút; lịch sang `CONFIRMED`. | v1 · P1 |
| BS-LH-06 | **Từ chối lịch.** Là bác sĩ, tôi muốn từ chối kèm lý do khi không khám được để bệnh nhân đặt lại. | **FE:** nút "Từ chối" bắt buộc chọn lý do. **BE:** `PATCH …/reject`; giải phóng slot. | Giờ được trả lại ngay; bệnh nhân nhận lý do và gợi ý giờ khác (BN-BK-11). | v1 · P1 |
| BS-LH-07 | **Đề xuất giờ khác.** Là bác sĩ, tôi muốn đề xuất giờ khác cho bệnh nhân để giữ được lịch thay vì từ chối. | **FE:** nút "Đề xuất giờ khác" chọn slot trống. **BE:** `PATCH …/propose`; lưu đề xuất gắn vào lịch (cờ riêng, không thêm trạng thái chính). | Bệnh nhân đồng ý thì tự đổi giờ; không đồng ý thì lịch giữ nguyên chờ xử lý. | v1 · P2 |
| BS-LH-08 | **Thao tác hàng loạt.** Là bác sĩ, tôi muốn xác nhận nhiều lịch một lần để tiết kiệm thời gian. | **FE:** ô chọn nhiều dòng, nút "Xác nhận đã chọn"; từ chối vẫn phải có lý do. | Mỗi lịch xử lý độc lập, báo lỗi riêng nếu có. | v1 · P3 |
| BS-LH-09 | **Chặn chuyển trạng thái sai.** Là bác sĩ, tôi muốn hệ thống không cho thao tác sai thứ tự để dữ liệu luôn đúng. | **BE:** máy trạng thái chặn chuyển sai (ví dụ `COMPLETED` → `CONFIRMED`). | Gọi API sai thứ tự trả lỗi rõ ràng. | v1 · P1 |
| BS-LH-10 | **Trạng thái thực tế trong ngày.** Là bác sĩ, tôi muốn lịch hôm nay hiện đúng trạng thái đang diễn ra để biết ai đã đến. | **FE:** nhãn `CHECKED_IN`, `TRIAGED`, `IN_PROGRESS`, `COMPLETED` cập nhật tức thì. | Khớp với hàng đợi. | Mới · P2 |
| BS-LH-11 | **Đi tới hồ sơ.** Là bác sĩ, tôi muốn từ lịch mở nhanh hồ sơ bệnh nhân để chuẩn bị khám. | **FE:** nút "Xem hồ sơ" trong chi tiết lịch. | Mở đúng bệnh nhân; lượt xem được ghi nhật ký (BS-HS-08). | Mới · P2 |
| BS-LH-12 | **Thông báo khi bệnh nhân hủy hoặc đổi.** Là bác sĩ, tôi muốn biết khi bệnh nhân hủy hoặc đổi lịch để sắp xếp lại thời gian. | **FE:** thông báo kèm dòng lịch bị đổi; lịch tự cập nhật trên calendar. | Slot được trả lại ngay. | v1 · P1 |

### 2.5 Hàng đợi hôm nay (HD)
*Màn hình: Hàng đợi hôm nay. Dùng chung dữ liệu với điều dưỡng (DD-HD).*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| BS-HD-01 | **Bảng hàng đợi.** Là bác sĩ, tôi muốn thấy bệnh nhân đã check-in theo thứ tự để gọi đúng người, đúng lúc. | **FE:** bảng: STT, tên, giờ hẹn, giờ check-in, thời gian đã chờ. **BE:** `GET /queue/today`. | Chỉ hàng đợi của chính bác sĩ; khớp với của điều dưỡng. | v1 · P1 |
| BS-HD-02 | **Cảnh báo chờ lâu.** Là bác sĩ, tôi muốn dòng đổi màu khi chờ quá lâu để không để bệnh nhân đợi. | **FE:** vàng khi gần ngưỡng, đỏ khi quá ngưỡng (mặc định 30 phút). | Ngưỡng lấy từ cấu hình. | v1 · P1 |
| BS-HD-03 | **Thông tin từ điều dưỡng.** Là bác sĩ, tôi muốn thấy bệnh nhân đã đo sinh hiệu chưa, có ghi chú gì để khám nhanh. | **FE:** cột "Tiền khám": đã đo/chưa đo; biểu tượng ghi chú check-in (rê chuột xem nội dung); nhãn ưu tiên kèm lý do. | Chỉ gọi được bệnh nhân `CHECKED_IN` hoặc `TRIAGED`. | Mới · P1 |
| BS-HD-04 | **Gọi bệnh nhân tiếp theo.** Là bác sĩ, tôi muốn bấm một nút để gọi người kế tiếp. | **FE:** nút "Gọi bệnh nhân tiếp theo" (phím tắt `G`). **BE:** `POST /queue/{id}/call`; đẩy lên màn hình chờ và ứng dụng bệnh nhân. | Màn hình chờ đổi số trong ≤ 2 giây; bệnh nhân nhận thông báo. | v1 · P1 |
| BS-HD-05 | **Gọi lại.** Là bác sĩ, tôi muốn gọi lại khi bệnh nhân chưa vào. | **FE:** nút "Gọi lại"; hiện số lần đã gọi. **BE:** đếm số lần gọi. | Mỗi lần gọi có nhật ký. | v1 · P1 |
| BS-HD-06 | **Bỏ qua.** Là bác sĩ, tôi muốn tạm bỏ qua một bệnh nhân để gọi người sẵn sàng. | **FE:** nút "Bỏ qua" (kèm lý do ngắn). **BE:** `POST /queue/{id}/skip`. | Bệnh nhân bị bỏ qua vẫn trong hàng, không bị tính vắng mặt. | v1 · P2 |
| BS-HD-07 | **Ưu tiên.** Là bác sĩ, tôi muốn đánh dấu ưu tiên người cao tuổi hoặc cấp cứu nhẹ để khám sớm. | **FE:** nút "Ưu tiên" bắt buộc lý do. **BE:** `POST /queue/{id}/prioritize`. | Mọi thay đổi thứ tự được ghi nhật ký; điều dưỡng thấy ngay. | v1 · P2 |
| BS-HD-08 | **Tự đánh dấu vắng mặt.** Là bác sĩ, tôi muốn hệ thống tự ghi vắng mặt sau khi gọi đủ lần để hàng đợi chạy tiếp. | **BE:** gọi 3 lần không có mặt thì `NO_SHOW` (cấu hình ở AD-CF-03). | Không đánh dấu khi chưa gọi đủ số lần. | v1 · P1 |
| BS-HD-09 | **Thời gian chờ dự kiến.** Là bác sĩ, tôi muốn thấy dự kiến chờ của từng người để thông tin đúng khi bệnh nhân hỏi. | **BE:** tính từ thời lượng khám trung bình của bác sĩ. | Khớp con số hiển thị cho bệnh nhân. | v1 · P2 |
| BS-HD-10 | **Nhật ký đổi thứ tự.** Là bác sĩ, tôi muốn xem ai đã đổi thứ tự hàng đợi để giải thích khi cần. | **FE:** bấm dòng xem lịch sử thay đổi. | Không sửa được nhật ký. | v1 · P2 |
| BS-HD-11 | **Không gọi trùng với điều dưỡng.** Là bác sĩ, tôi muốn khi điều dưỡng và tôi cùng bấm gọi thì chỉ một lần gọi được ghi nhận. | **BE:** xử lý đồng thời, lần gọi sau thấy "đã được gọi lúc …". | Số lần gọi không bị đếm hai lần. | Mới · P1 |
| BS-HD-12 | **Báo trễ.** Là bác sĩ, tôi muốn báo mình trễ để điều dưỡng thông báo cho bệnh nhân đang chờ. | **FE:** nút "Tôi trễ X phút". **BE:** cập nhật thời gian chờ dự kiến; gửi cảnh báo cho điều dưỡng (DD-PS-04, DD-PS-05). | Bệnh nhân nhận thông báo trễ trong ≤ 1 phút. | Mới · P2 |
| BS-HD-13 | **Bệnh nhân nguy cấp lên đầu.** Là bác sĩ, tôi muốn bệnh nhân có chỉ số nguy cấp được đưa lên đầu và báo tôi ngay. | **FE:** chuông và biểu ngữ đỏ "Chỉ số nguy cấp: …"; dòng được ghim đầu hàng. **BE:** sự kiện `triage.critical` từ DD-TK-06. | Bác sĩ nhận cảnh báo ≤ 3 giây; bấm mở thẳng màn hình khám. | Mới · P1 |

### 2.6 Hồ sơ bệnh nhân (HS)
*Màn hình: tab bên trái màn hình khám và trang Hồ sơ bệnh nhân. Chỉ đọc cho đến khi bắt đầu khám.*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| BS-HS-01 | **Thanh tóm tắt cố định.** Là bác sĩ, tôi muốn thấy nhanh thông tin cốt lõi của bệnh nhân để khám đúng trọng tâm và an toàn. | **FE:** thanh đầu màn hình: họ tên, tuổi, giới, nhóm máu, **dị ứng (nổi bật đỏ)**, bệnh mạn tính, thuốc đang dùng; với trẻ em có cân nặng và người giám hộ. **BE:** `GET /patients/{id}/summary`. | Thanh luôn hiện khi cuộn. | v1 · P1 |
| BS-HS-02 | **Dị ứng luôn hiển thị.** Là bác sĩ, tôi muốn dị ứng hiện ở mọi màn hình liên quan đến kê đơn để không kê nhầm. | **FE:** nhãn dị ứng đỏ ở màn hình khám, kê đơn, xem trước đơn. | Không có màn hình kê đơn nào ẩn dị ứng. | v1 · P1 |
| BS-HS-03 | **Lịch sử khám.** Là bác sĩ, tôi muốn xem các lần khám trước để hiểu diễn tiến bệnh. | **FE:** tab "Lịch sử khám" dạng dòng thời gian (ngày, bác sĩ, chuyên khoa, chẩn đoán, lời dặn). **BE:** `GET /patients/{id}/visits`. | Chỉ bản ghi đã hoàn tất. | v1 · P1 |
| BS-HS-04 | **Đơn thuốc cũ.** Là bác sĩ, tôi muốn xem các đơn đã kê để tránh trùng và biết bệnh nhân đang dùng gì. | **FE:** tab "Đơn thuốc": danh sách theo lần khám; nút "Sao chép vào đơn mới" (DT-03). **BE:** `GET /patients/{id}/prescriptions`. | Hiển thị đủ liều và cách dùng. | v1 · P1 |
| BS-HS-05 | **Kết quả xét nghiệm và hình ảnh.** Là bác sĩ, tôi muốn xem kết quả để quyết định hướng xử trí. | **FE:** tab "Kết quả": xem ảnh, tải PDF. **BE:** `GET /patients/{id}/lab-results`; tệp tải bằng đường dẫn ký có hạn. | Kết quả mới có chấm báo chưa xem. | v1 · P2 |
| BS-HS-06 | **Tìm trong hồ sơ.** Là bác sĩ, tôi muốn tìm theo từ khóa để thấy ngay thông tin cần. | **FE:** ô tìm trong hồ sơ (chẩn đoán, thuốc, ngày). | Kết quả được tô sáng. | v1 · P2 |
| BS-HS-07 | **Kiểm soát truy cập.** Là phòng khám, chúng tôi muốn bác sĩ chỉ xem được hồ sơ bệnh nhân có lịch với mình để bảo vệ quyền riêng tư. | **BE:** kiểm tra quan hệ điều trị (có lịch hẹn) hoặc quyền do Admin cấp; ngoài phạm vi trả `403` và ghi nhật ký. | Truy cập sai phạm vi luôn bị chặn và có dấu vết. | v1 · P1 |
| BS-HS-08 | **Nhật ký xem hồ sơ.** Là bác sĩ, tôi muốn biết lượt xem của mình được ghi lại để làm việc đúng quy định. | **FE:** dòng nhắc nhỏ "Lượt xem hồ sơ được ghi lại". **BE:** bảng `audit_logs` (ai, xem gì, lúc nào), hiển thị cho bệnh nhân ở BN-PV-06. | Mọi lượt mở hồ sơ đều có bản ghi. | Mới · P1 |
| BS-HS-09 | **Khi EMR/HIS lỗi.** Là bác sĩ, tôi muốn vẫn xem được dữ liệu của phòng khám khi hệ thống ngoài lỗi. | **FE:** banner "Dữ liệu từ hệ thống ngoài tạm thời chưa có". **BE:** Integration Layer có cơ chế dự phòng. | Không chặn việc khám khi EMR/HIS lỗi. | v1 · P3 |
| BS-HS-10 | **Thông tin bệnh nhân khai lúc đặt lịch.** Là bác sĩ, tôi muốn xem lý do khám và ảnh/kết quả bệnh nhân gửi kèm để chuẩn bị. | **FE:** khối "Bệnh nhân khai": lý do, triệu chứng, ảnh đính kèm (xem phóng to). | Hiển thị rõ nguồn là bệnh nhân tự khai. | Mới · P2 |
| BS-HS-11 | **Biểu đồ sinh hiệu theo thời gian.** Là bác sĩ, tôi muốn xem huyết áp, nhịp tim, cân nặng qua các lần khám để theo dõi bệnh mạn tính. | **FE:** biểu đồ đường, chọn chỉ số và khoảng thời gian. **BE:** `GET /patients/{id}/vitals`. | Dữ liệu lấy từ sinh hiệu điều dưỡng đã ghi. | Mới · P3 |

### 2.7 Khám bệnh (KH)
*Màn hình: Phòng khám (màn hình khám). Bố cục hai cột: trái là tóm tắt bệnh nhân, phải là form bệnh án.*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| BS-KH-01 | **Bắt đầu khám.** Là bác sĩ, tôi muốn bấm bắt đầu khám từ hàng đợi để mở bệnh án. | **FE:** nút "Bắt đầu khám" ở dòng bệnh nhân được gọi. **BE:** `POST /visits` → lịch `IN_PROGRESS`. | Chỉ bắt đầu được cho lịch `CHECKED_IN` hoặc `TRIAGED`; mỗi lịch một bệnh án. | v1 · P1 |
| BS-KH-02 | **Bố cục hai cột.** Là bác sĩ, tôi muốn vừa xem hồ sơ vừa nhập bệnh án để không phải chuyển màn hình. | **FE:** cột trái tóm tắt (BS-HS-01) và các tab hồ sơ; cột phải form bệnh án; thanh đầu cố định nút "Lưu nháp", "Hoàn tất khám". | Cuộn hai cột độc lập. | v1 · P1 |
| BS-KH-03 | **Sinh hiệu.** Là bác sĩ, tôi muốn thấy sinh hiệu điều dưỡng đã đo và bổ sung nếu cần để có dữ liệu đầy đủ. | **FE:** khối sinh hiệu: huyết áp, mạch, nhiệt độ, cân nặng, SpO₂ (điền sẵn từ tiền khám, ghi rõ người đo và giờ đo); cảnh báo giá trị bất thường; bác sĩ sửa/bổ sung có ghi lý do. | Giá trị bất thường tô màu; bản sửa lưu thành bản hiệu chỉnh. | v1 · P1 |
| BS-KH-04 | **Lý do khám và khám lâm sàng.** Là bác sĩ, tôi muốn ghi lý do khám, triệu chứng và khám lâm sàng theo mẫu SOAP để bệnh án rõ ràng. | **FE:** ô "Lý do khám" (điền sẵn từ đặt lịch), "Triệu chứng", "Khám lâm sàng"; hỗ trợ gõ nhanh. | Lý do khám bắt buộc. | v1 · P1 |
| BS-KH-05 | **Chẩn đoán ICD-10.** Là bác sĩ, tôi muốn tìm mã bệnh ICD-10 có gợi ý để chẩn đoán chuẩn. | **FE:** ô tìm theo tên/mã, thêm nhiều chẩn đoán, đánh dấu chính/phụ. **BE:** `GET /icd10?q=`. | Chẩn đoán bắt buộc trước khi hoàn tất khám. | v1 · P1 |
| BS-KH-06 | **Hướng xử trí và lời dặn.** Là bác sĩ, tôi muốn ghi hướng xử trí và lời dặn để bệnh nhân làm theo. | **FE:** ô "Hướng xử trí", "Lời dặn" (bệnh nhân thấy ở BN-HS-02). | Lời dặn hiển thị dễ đọc cho bệnh nhân. | v1 · P1 |
| BS-KH-07 | **Mẫu khám theo chuyên khoa.** Là bác sĩ, tôi muốn có mẫu theo chuyên khoa để ghi nhanh các ca thường gặp. | **FE:** nút "Dùng mẫu" cho Tim mạch, Thần kinh, Nhi, Nội; có thể sửa mẫu của mình. **BE:** `GET /visit-templates?specialty=`. | Dùng mẫu không ghi đè nội dung đã nhập mà không hỏi. | v1 · P2 |
| BS-KH-08 | **Tự lưu nháp.** Là bác sĩ, tôi muốn bệnh án tự lưu để không mất dữ liệu khi gián đoạn. | **FE:** tự lưu mỗi 10 giây; chỉ báo "Đã lưu lúc hh:mm:ss". **BE:** `PUT /visits/{id}`. | Đóng nhầm trang rồi mở lại vẫn còn nội dung. | v1 · P1 |
| BS-KH-09 | **Mất kết nối.** Là bác sĩ, tôi muốn vẫn nhập được khi mạng chập chờn để không phải ngừng khám. | **FE:** lưu nháp cục bộ, banner "Chưa đồng bộ"; tự đồng bộ khi có mạng. | Không mất dữ liệu; báo khi đồng bộ xong. | v1 · P1 |
| BS-KH-10 | **Hoàn tất khám.** Là bác sĩ, tôi muốn hoàn tất để khóa bệnh án và chuyển bệnh nhân sang bước tiếp theo. | **FE:** nút "Hoàn tất khám" (phím tắt `Ctrl+Enter`); hộp xác nhận tóm tắt (chẩn đoán, đơn, tái khám). **BE:** `POST /visits/{id}/complete` → `COMPLETED`; kiểm tra trường bắt buộc (lý do khám, chẩn đoán). | Bệnh án bị khóa; bệnh nhân thấy kết quả ở BN-HS-01. | v1 · P1 |
| BS-KH-11 | **Sửa sau khi hoàn tất.** Là bác sĩ, tôi muốn sửa khi phát hiện sai sót mà vẫn giữ dấu vết để đúng quy định. | **FE:** nút "Tạo bản sửa đổi" bắt buộc lý do; xem được các phiên bản. **BE:** lưu `revision`, người sửa, thời điểm; đồng bộ EMR. | Không ghi đè bản gốc; mọi bản đều xem lại được. | v1 · P1 |
| BS-KH-12 | **Ghi chú nội bộ.** Là bác sĩ, tôi muốn ghi nhận định riêng mà người khác không thấy để làm việc thoải mái. | **FE:** khối "Ghi chú nội bộ" có biểu tượng khóa. **BE:** trường riêng, ẩn với điều dưỡng và bệnh nhân. | Không hiện ở hồ sơ bệnh nhân, báo cáo hay xuất dữ liệu. | Mới · P2 |
| BS-KH-13 | **Chuyển sang chờ thanh toán.** Là bác sĩ, tôi muốn khi tôi hoàn tất thì điều dưỡng biết để thu phí. | **BE:** lịch `COMPLETED` xuất hiện ở "chờ thanh toán" (DD-TT-01); gửi thông báo cho điều dưỡng và bệnh nhân. | Hiện ≤ 3 giây sau khi bác sĩ hoàn tất. | Mới · P1 |
| BS-KH-14 | **Chỉ số theo tuổi cho trẻ em.** Là bác sĩ khoa Nhi, tôi muốn thấy khoảng bình thường theo tuổi để đánh giá nhanh. | **FE:** cạnh mỗi chỉ số hiện khoảng tham chiếu theo tuổi; cảnh báo ngoài khoảng. **BE:** bảng `vital_ranges` do bác sĩ duyệt. | Chỉ là gợi ý; bác sĩ quyết định. | Mới · P3 |
| BS-KH-15 | **Tạm dừng khám.** Là bác sĩ, tôi muốn tạm dừng khi phải ra ngoài để không mất bệnh án đang dở. | **FE:** nút "Tạm dừng"; bệnh án giữ ở trạng thái đang khám, hiện trong hàng đợi. | Quay lại tiếp tục đúng chỗ dở. | Mới · P3 |

### 2.8 Kê đơn thuốc (DT)
*Màn hình: khối "Đơn thuốc" trong màn hình khám. Các cảnh báo chỉ hỗ trợ, quyết định cuối cùng thuộc về bác sĩ.*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| BS-DT-01 | **Tìm thuốc.** Là bác sĩ, tôi muốn tìm thuốc theo tên biệt dược hoặc hoạt chất để kê nhanh. | **FE:** ô tìm có gợi ý khi gõ. **BE:** `GET /medicines?q=`. | Tìm không phân biệt dấu; kết quả hiện trong ≤ 1 giây. | v1 · P1 |
| BS-DT-02 | **Dòng thuốc.** Là bác sĩ, tôi muốn nhập liều, cách dùng, số ngày, số lượng để đơn rõ ràng. | **FE:** mỗi dòng gồm tên thuốc, liều, cách dùng, số ngày, số lượng, ghi chú; thêm/xóa/kéo đổi thứ tự dòng. | Số lượng tự tính từ liều và số ngày, sửa được. | v1 · P1 |
| BS-DT-03 | **Đơn mẫu và sao chép đơn cũ.** Là bác sĩ, tôi muốn dùng đơn mẫu hoặc sao chép đơn lần trước để kê nhanh các ca lặp lại. | **FE:** nút "Đơn mẫu", "Sao chép đơn lần trước". | Sao chép vẫn chạy lại kiểm tra dị ứng và tương tác. | v1 · P2 |
| BS-DT-04 | **Cảnh báo dị ứng.** Là bác sĩ, tôi muốn được báo ngay khi thuốc trùng nhóm dị ứng của bệnh nhân để an toàn. | **FE:** khung đỏ "Bệnh nhân dị ứng …"; chặn hoặc yêu cầu xác nhận kèm lý do. **BE:** kiểm tra với dị ứng đã khai. | Không lưu được thuốc dị ứng nếu chưa có lý do xác nhận. | v1 · P1 |
| BS-DT-05 | **Cảnh báo tương tác thuốc.** Là bác sĩ, tôi muốn được báo tương tác với thuốc bệnh nhân đang dùng để tránh nguy hiểm. | **FE:** cảnh báo vàng/đỏ theo mức độ, kèm gợi ý. **BE:** rule engine hoặc tích hợp CSDL dược (câu hỏi 6 mục 6). | Cảnh báo hiện ngay khi thêm thuốc. | v1 · P1 |
| BS-DT-06 | **Cảnh báo liều theo cân nặng, tuổi.** Là bác sĩ khoa Nhi, tôi muốn được báo khi liều vượt mức theo cân nặng để kê an toàn. | **FE:** hiện cân nặng/tuổi bệnh nhân cạnh dòng thuốc; cảnh báo khi liều ngoài khoảng. **BE:** khoảng liều do bác sĩ duyệt (câu hỏi 7 mục 6). | Chỉ là gợi ý; bác sĩ vẫn quyết định. | Mới · P2 |
| BS-DT-07 | **Xem trước, in, mã QR.** Là bác sĩ, tôi muốn xem trước và in đơn để bệnh nhân nhận được bản chuẩn. | **FE:** nút "Xem trước", "In PDF". **BE:** `POST /visits/{id}/prescriptions`; tạo PDF có mã QR xác thực và mã tra cứu duy nhất. | Mọi đơn có mã tra cứu duy nhất; PDF có dị ứng nổi bật. | v1 · P1 |
| BS-DT-08 | **Gửi đơn cho bệnh nhân.** Là bác sĩ, tôi muốn đơn tự đến ứng dụng của bệnh nhân để họ nhận ngay. | **FE:** nút "Gửi cho bệnh nhân" (tự gửi khi hoàn tất khám nếu bật). **BE:** thông báo cho bệnh nhân (BN-NT-05). | Bệnh nhân xem được đơn ở BN-HS-03. | v1 · P1 |
| BS-DT-09 | **Phiên bản đơn.** Là bác sĩ, tôi muốn sửa đơn sau khi đã gửi mà vẫn giữ lịch sử để đúng quy định. | **FE:** "Tạo bản sửa đổi" kèm lý do. **BE:** lưu phiên bản; bản cũ đánh dấu "Đã thay thế". | Bệnh nhân thấy bản mới nhất và thông báo thay đổi. | v1 · P2 |
| BS-DT-10 | **Đơn và chỉ định thành khoản phí.** Là bác sĩ, tôi muốn thuốc và chỉ định của mình tự đưa vào khoản phí để điều dưỡng thu đúng. | **BE:** tạo `payment_items` từ đơn và chỉ định khi hoàn tất khám (DD-TT-07). Bác sĩ không thấy hay sửa giá. | Khoản phí khớp đúng thuốc và dịch vụ đã chỉ định. | Mới · P2 |
| BS-DT-11 | **Hướng dẫn dùng thuốc dễ đọc.** Là bác sĩ, tôi muốn có câu hướng dẫn chuẩn ("Sáng 1 viên sau ăn") để bệnh nhân hiểu đúng. | **FE:** gợi ý cách dùng chuẩn khi chọn liều. | Hiển thị đúng ở BN-HS-03. | Mới · P3 |

### 2.9 Chỉ định và tái khám (CD)
*Màn hình: khối "Chỉ định" và "Tái khám" trong màn hình khám. Phần xét nghiệm chỉ áp dụng nếu phòng khám có làm hoặc nhận kết quả (câu hỏi 5 mục 6).*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| BS-CD-01 | **Chỉ định cận lâm sàng.** Là bác sĩ, tôi muốn chọn xét nghiệm hoặc chẩn đoán hình ảnh để có thêm dữ kiện. | **FE:** chọn từ danh mục, ghi chú thêm. **BE:** `POST /visits/{id}/orders`. | Chỉ định xuất hiện trong hồ sơ và khoản phí (DT-10). | v1 · P2 |
| BS-CD-02 | **Mức khẩn.** Là bác sĩ, tôi muốn đánh dấu chỉ định khẩn để được xử lý trước. | **FE:** ô chọn "Thường"/"Khẩn". | Chỉ định khẩn có nhãn rõ trên danh sách. | Mới · P3 |
| BS-CD-03 | **Nhận thông báo kết quả.** Là bác sĩ, tôi muốn được báo khi có kết quả để xử lý tiếp. | **BE:** khi có kết quả đẩy thông báo cho bác sĩ chỉ định. | Thông báo kèm đường dẫn mở kết quả. | v1 · P2 |
| BS-CD-04 | **Xem và ghi nhận đã xem kết quả.** Là bác sĩ, tôi muốn đánh dấu đã xem kết quả để không sót. | **FE:** chấm "Chưa xem"; nút "Đã xem". | Chấm biến mất khi đã xem. | Mới · P2 |
| BS-CD-05 | **Hẹn tái khám.** Là bác sĩ, tôi muốn đặt luôn lịch tái khám trong buổi khám để bệnh nhân khỏi tự đặt lại. | **FE:** chọn "sau X ngày/tuần", hiện các giờ trống gần ngày đó để chọn. (Bỏ lựa chọn hình thức khám.) | Chỉ chọn được giờ còn trống. | v1 · P2 |
| BS-CD-06 | **Tạo lịch tái khám.** Là bác sĩ, tôi muốn lịch tái khám được tạo ngay và gửi cho bệnh nhân. | **BE:** `POST /appointments` với `type = FOLLOW_UP`, `parent_visit_id`; gửi nhắc lịch tự động (FR-05). | Bệnh nhân nhận xác nhận ngay và thấy lịch ở BN-LH-01. | v1 · P2 |
| BS-CD-07 | **Gợi ý ngày tái khám.** Là bác sĩ, tôi muốn chọn nhanh mốc thường dùng (1 tuần, 2 tuần, 1 tháng) để đỡ thao tác. | **FE:** nút mốc nhanh. | Mốc chỉ là gợi ý, sửa được. | Mới · P3 |
| BS-CD-08 | **Dặn chuẩn bị trước tái khám.** Là bác sĩ, tôi muốn ghi dặn dò (nhịn ăn, mang kết quả) để bệnh nhân chuẩn bị đúng. | **FE:** ô "Dặn trước tái khám". **BE:** hiển thị ở BN-LH-03. | Dặn dò hiện trong chi tiết lịch hẹn của bệnh nhân. | Mới · P3 |

### 2.10 Thông báo (NT)

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| BS-NT-01 | **Chuông thông báo.** Là bác sĩ, tôi muốn có chuông báo số thông báo chưa đọc để biết có việc cần xử lý. | **FE:** chuông có huy hiệu số. | Huy hiệu về 0 khi đọc hết. | v1 · P1 |
| BS-NT-02 | **Danh sách phân nhóm.** Là bác sĩ, tôi muốn thông báo chia theo nhóm để tìm nhanh. | **FE:** nhóm Lịch hẹn, Kết quả xét nghiệm, Cảnh báo bệnh nhân, Hệ thống. **BE:** `GET /notifications`. | Lọc theo nhóm. | v1 · P1 |
| BS-NT-03 | **Đọc và đi tới mục liên quan.** Là bác sĩ, tôi muốn bấm vào thông báo để đến đúng nơi xử lý. | **FE:** "Đánh dấu đã đọc", "Đọc tất cả"; bấm mở lịch/bệnh nhân/kết quả. **BE:** `PATCH /notifications/{id}/read`. | Mở đúng đối tượng. | v1 · P1 |
| BS-NT-04 | **Thời gian thực và đẩy ngoại tuyến.** Là bác sĩ, tôi muốn nhận thông báo ngay cả khi không mở hệ thống. | **BE:** WebSocket đẩy thời gian thực; thông báo đẩy qua FCM khi ngoại tuyến. | Thông báo mới hiện ≤ 5 giây. | v1 · P2 |
| BS-NT-05 | **Không trùng, theo cấu hình kênh.** Là bác sĩ, tôi muốn mỗi thông báo chỉ đến một lần theo kênh tôi chọn. | **BE:** khử trùng; tôn trọng BS-AC-09. | Một sự kiện không tạo hai thông báo cùng kênh. | v1 · P1 |
| BS-NT-06 | **Thông báo quan trọng không tắt được.** Là phòng khám, chúng tôi muốn bác sĩ luôn nhận cảnh báo nguy cấp và lịch bị hủy để an toàn bệnh nhân. | **FE:** các loại này không có công tắc tắt. | Cảnh báo nguy cấp luôn tới bác sĩ. | Mới · P2 |

### 2.11 Thống kê và đánh giá (TK)
*Màn hình: Thống kê & Đánh giá, chỉ dữ liệu của chính bác sĩ.*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| BS-TK-01 | **Lượt khám theo thời gian.** Là bác sĩ, tôi muốn xem số lượt khám theo ngày/tuần/tháng để biết khối lượng công việc. | **FE:** biểu đồ cột. **BE:** `GET /doctors/me/stats?from=&to=`. | Tổng khớp số lượt khám đã hoàn tất. | v1 · P2 |
| BS-TK-02 | **Tỷ lệ vắng mặt.** Là bác sĩ, tôi muốn biết tỷ lệ bệnh nhân không đến để cân nhắc lịch trực. | **FE:** biểu đồ theo tuần. | Công thức giống ở AD-DB-06. | v1 · P2 |
| BS-TK-03 | **Thời gian khám trung bình.** Là bác sĩ, tôi muốn biết trung bình mỗi ca khám mất bao lâu để xếp lịch hợp lý. | **FE:** thẻ số liệu. **BE:** từ thời điểm `IN_PROGRESS` đến `COMPLETED`. | Khớp dữ liệu gốc. | v1 · P2 |
| BS-TK-04 | **Chẩn đoán thường gặp.** Là bác sĩ, tôi muốn xem các chẩn đoán gặp nhiều để chuẩn bị mẫu khám. | **FE:** danh sách top chẩn đoán (tổng hợp). | Không hiển thị thông tin định danh bệnh nhân. | v1 · P3 |
| BS-TK-05 | **Điểm và nhận xét.** Là bác sĩ, tôi muốn xem điểm trung bình và nhận xét của bệnh nhân để cải thiện chất lượng. | **FE:** điểm trung bình; danh sách nhận xét ẩn danh. **BE:** `GET /doctors/me/reviews`. | Đánh giá bị Admin ẩn thì không hiện ở đây. | v1 · P2 |
| BS-TK-06 | **Lọc theo khoảng thời gian.** Là bác sĩ, tôi muốn chọn khoảng thời gian để so sánh. | **FE:** bộ chọn kỳ (tuần, tháng, tùy chọn). | Mọi biểu đồ đổi theo. | v1 · P2 |
| BS-TK-07 | **Xuất báo cáo.** Là bác sĩ, tôi muốn xuất PDF/Excel để lưu giữ. | **FE:** nút "Xuất". | Tệp không chứa định danh bệnh nhân. | v1 · P3 |
| BS-TK-08 | **Chỉ xem của mình.** Là phòng khám, chúng tôi muốn bác sĩ chỉ thấy số liệu của chính mình. | **BE:** lọc theo bác sĩ đăng nhập. | Gọi API với bác sĩ khác trả `403`. | v1 · P1 |
| BS-TK-09 | **Phản hồi của phòng khám.** Là bác sĩ, tôi muốn thấy phòng khám đã trả lời đánh giá ra sao. | **FE:** phần "Phản hồi" dưới đánh giá (chỉ xem). **BE:** từ AD-RV-03. | Chỉ hiện phản hồi đã đăng. | Mới · P3 |

### 2.12 Khung chung (GN)

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| BS-GN-01 | **Menu theo nhóm.** Là bác sĩ, tôi muốn menu chia nhóm theo công việc để tìm nhanh. | **FE:** nhóm Hôm nay, Lịch, Hồ sơ, Khác (mục 1.4); mục đang chọn tô sáng. | Chỉ hiện mục của vai trò bác sĩ. | Mới · P1 |
| BS-GN-02 | **Phím tắt.** Là bác sĩ, tôi muốn có phím tắt ở màn hình khám để nhập nhanh. | **FE:** `Ctrl+S` lưu nháp, `Ctrl+Enter` hoàn tất khám, `G` gọi bệnh nhân tiếp theo, `/` tìm; bảng phím tắt mở bằng `?`. | Phím tắt không chạy khi đang gõ trong ô nhập (trừ `Ctrl+S`). | v1 · P2 |
| BS-GN-03 | **Trạng thái dùng chung.** Là bác sĩ, tôi muốn mọi màn hình báo tải, trống, lỗi giống nhau. | **FE:** khung xương, trạng thái trống có hướng dẫn, thông báo nổi, nút "Thử lại". | Không màn hình nào để trống trắng khi lỗi. | Mới · P1 |
| BS-GN-04 | **Máy tính và máy tính bảng.** Là bác sĩ, tôi muốn dùng tốt trên máy tính bảng khi đi buồng. | **FE:** responsive; nút đủ lớn; màn hình khám dùng được dọc và ngang. | Dùng được trên màn hình 10 inch. | v1 · P2 |
| BS-GN-05 | **Chế độ chịu lỗi mạng.** Là bác sĩ, tôi muốn biết khi mất mạng và không mất dữ liệu đã nhập. | **FE:** banner "Mất kết nối"; giữ dữ liệu form; tự thử lại. | Banner tự biến mất khi có mạng. | v1 · P2 |
| BS-GN-06 | **Hộp xác nhận thao tác nhạy cảm.** Là bác sĩ, tôi muốn được hỏi lại trước khi từ chối lịch, đăng ký nghỉ, hoàn tất khám. | **FE:** hộp nêu rõ việc sắp làm và hệ quả. | Thao tác khó hoàn tác luôn có hộp xác nhận. | Mới · P1 |
| BS-GN-07 | **Chặn ngoài quyền.** Là phòng khám, chúng tôi muốn bác sĩ không truy cập được dữ liệu ngoài quyền kể cả gọi API trực tiếp. | **BE:** kiểm tra vai trò `DOCTOR` và quan hệ điều trị ở mọi API. | Truy cập ngoài quyền trả `403` và ghi nhật ký. | v1 · P1 |

---

## 3. Dữ liệu bổ sung (ngoài các bảng của v1)

| Bảng / trường | Dùng cho |
| --- | --- |
| `doctors`, `doctor_profiles`, `doctor_credentials` | BS-AC-06, BS-AC-10 |
| `schedules`, `time_slots`, `time_off` | BS-SC |
| `appointments` (thêm `reschedule_proposal`, `checkin_note`, `approved_by`, `reject_reason`) | BS-LH |
| `queue_entries`, `queue_events` | BS-HD |
| `vitals` (người đo, giờ đo, `revision`) | BS-KH-03, BS-HS-11 |
| `visits` (thêm `revision`, `internal_note`) và `visit_revisions` (visit_id, revision, changed_by, reason, at) | BS-KH-11, BS-KH-12 |
| `visit_templates` (specialty_id, name, content) | BS-KH-07 |
| `prescriptions`, `prescription_items`, `prescription_versions` | BS-DT |
| `medicines` (hoạt chất, nhóm, khoảng liều), `drug_interactions` | BS-DT-04..06 |
| `orders` (visit_id, type, urgency, status), `lab_results` | BS-CD |
| `payment_items` (từ đơn và chỉ định) | BS-DT-10 |
| `vital_ranges` (tuổi, chỉ số, ngưỡng) | BS-KH-14 |
| `notifications`, `notification_settings` | BS-NT, BS-AC-09 |
| `audit_logs`, `emr_access_logs` | BS-HS-08 |

## 4. Yêu cầu phi chức năng cho Bác sĩ
- **Bảo mật và pháp lý:** MFA; mã hóa dữ liệu y tế khi lưu và khi truyền; phân quyền theo vai trò và theo quan hệ điều trị; nhật ký không sửa được; tuân thủ Nghị định 13/2023/NĐ-CP.
- **Hiệu năng:** phản hồi trung bình dưới 2 giây; tải một tuần lịch 150 lịch hẹn dưới 2 giây; cache lịch trống bằng Redis; chống đặt trùng bằng khóa giao dịch.
- **Thời gian thực:** cập nhật hàng đợi, cảnh báo nguy cấp trong ≤ 3 giây; gọi bệnh nhân đổi số trên màn hình chờ trong ≤ 2 giây.
- **Độ tin cậy khi khám:** tự lưu nháp mỗi 10 giây; mất mạng vẫn giữ nháp cục bộ; bệnh án đã hoàn tất không bị ghi đè.
- **Trải nghiệm:** ưu tiên máy tính và máy tính bảng; phím tắt; ít bấm; dị ứng luôn nổi bật.
- **Nội dung y tế:** cảnh báo dị ứng, tương tác, liều chỉ hỗ trợ; cần rà soát pháp lý về đơn thuốc điện tử và bệnh án điện tử trước khi triển khai thực tế.

## 5. Lộ trình phát triển đề xuất

| Giai đoạn | Nội dung | Story |
| --- | --- | --- |
| **1 – Khám bệnh cốt lõi** | Đăng nhập, tổng quan, lịch hẹn, hàng đợi (nối với điều dưỡng), hồ sơ bệnh nhân, ghi bệnh án, hoàn tất khám, kê đơn cơ bản có cảnh báo dị ứng | BS-AC-01..05, BS-DB-01..04, BS-LH-01..06, 09, 12, BS-HD-01..05, 08, 11, 13, BS-HS-01..04, 07, 08, BS-KH-01..06, 08..11, 13, BS-DT-01, 02, 04, 05, 07, 08, BS-GN-01, 03, 06, 07 |
| **2 – Hoàn thiện** | Lịch làm việc và nghỉ, đề xuất giờ khác, kết quả xét nghiệm, tái khám, thông báo, thống kê, mẫu khám, ghi chú nội bộ, cảnh báo liều trẻ em | còn lại mức P2 |
| **3 – Mở rộng** | Biểu đồ sinh hiệu, đề nghị đổi ca, chứng chỉ, xuất báo cáo, thao tác hàng loạt, chỉ số theo tuổi | mức P3 |

## 6. Câu hỏi cần chốt / đối chiếu với code
1. Giao diện Bác sĩ hiện có những màn hình nào? Gửi ảnh chụp hoặc code để đổi nhãn "v1" thành "Hiện có".
2. Ai duyệt lịch `PENDING`: bác sĩ, Admin, điều dưỡng hay tự động (AD-CF-04)? Nếu không phải bác sĩ thì bỏ tab "Chờ xác nhận" ở BS-LH-04..06.
3. Bác sĩ có tự tạo và sửa ca không, hay chỉ Admin phân công (BS-SC-07)? Màn hình Admin đã có Phân công lịch trực.
4. Bác sĩ có được gửi đề nghị đổi phí hoặc chuyên khoa không (BS-AC-08)? Cần thêm loại yêu cầu tương ứng ở AD-AP.
5. Phòng khám có làm xét nghiệm, chẩn đoán hình ảnh tại chỗ hay chuyển nơi khác (BS-CD)? Kết quả được nhập bằng cách nào?
6. Danh mục thuốc: ai quản lý, lấy giá từ đâu? Cảnh báo tương tác dùng rule tự viết hay tích hợp cơ sở dữ liệu dược?
7. Bảng chỉ số theo tuổi và khoảng liều cho trẻ em cần bác sĩ của phòng khám duyệt trước khi dùng.
8. Có hệ thống EMR/HIS bên ngoài cần kết nối không (BS-HS-09)?
9. "Đề xuất giờ khác" dùng cờ riêng gắn vào lịch (đề xuất) hay thêm trạng thái mới `RESCHEDULE_REQUESTED` như bản v1?
10. Thời hạn lưu bệnh án, và quy định về bản sửa đổi bệnh án.
11. Endpoint thực tế trong `backend` có khác tên đề xuất ở trên không.

## Phụ lục A. Đối chiếu bản v1 với mã mới

| Bản v1 | Nay nằm ở |
| --- | --- |
| US-01 Đăng nhập an toàn | BS-AC-01..05 |
| US-02 Quản lý hồ sơ cá nhân | BS-AC-06..09 |
| US-03 Xem tổng quan trong ngày | BS-DB-01..08 |
| US-04 Thiết lập khung giờ làm việc | BS-SC-01, 02, 07 (đã bỏ hình thức Video) |
| US-05 Đăng ký nghỉ / bận đột xuất | BS-SC-03..05 |
| US-06 Xem lịch hẹn theo ngày/tuần/tháng | BS-LH-01..03, 10, 11 |
| US-07 Xác nhận / từ chối / đề xuất đổi lịch | BS-LH-04..09, 12 |
| US-08 Quản lý hàng đợi hôm nay | BS-HD-01..13 |
| US-09 Xem hồ sơ bệnh nhân trước khi khám | BS-HS-01..11 |
| US-10 Ghi nhận kết quả khám | BS-KH-01..15 |
| US-11 Kê đơn thuốc | BS-DT-01..11 |
| US-12 Chỉ định xét nghiệm và hẹn tái khám | BS-CD-01..08 |
| US-13 Tư vấn video với bệnh nhân | **Đã bỏ** (không khám từ xa) |
| US-14 Trung tâm thông báo | BS-NT-01..06 |
| US-15 Thống kê cá nhân và xem đánh giá | BS-TK-01..09 |

## Lịch sử thay đổi

| Phiên bản | Ngày | Người sửa | Nội dung |
| --- | --- | --- | --- |
| 1.0 | | | Bản user story Bác sĩ đầu tiên (15 story, 7 epic) |
| 2.0 | 20/10/2026 | | Viết lại theo cấu trúc module; bỏ khám từ xa; nối với điều dưỡng (sinh hiệu, cảnh báo nguy cấp, chờ thanh toán); thêm ghi chú nội bộ, cảnh báo liều trẻ em, báo trễ, nhật ký xem hồ sơ; đồng bộ với admin.md, patient.md, nurse.md |