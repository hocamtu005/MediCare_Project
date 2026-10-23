# MediCare – User Story giao diện Điều dưỡng

*Phiên bản: 2.0 · Cập nhật: 20/10/2026 · Phạm vi: phòng khám 4 chuyên khoa (Tim mạch, Thần kinh, Nhi, Nội), 4 bác sĩ chính và đội ngũ điều dưỡng, không khám từ xa*

---

## 1. Tổng quan

### 1.1 Mục đích, nguồn và phạm vi
Giao diện Điều dưỡng là nơi tiếp đón bệnh nhân, chuyển bệnh nhân sang bác sĩ khám, đo sinh hiệu, điều phối hàng đợi, thu phí sau khám và xử lý các tình huống phát sinh trong ngày. Tài liệu mô tả từng chức năng từ tổng quan đến chi tiết từng nút, ô nhập và trạng thái, để làm căn cứ cập nhật giao diện. Mỗi chức năng là một user story có phần giao diện (FE), backend (BE) và tiêu chí nghiệm thu (AC).

Vai trò này gộp hai việc mà phòng khám nhỏ thường do cùng một người làm: **tiếp đón** (đặt lịch hộ, check-in, thu phí) và **điều dưỡng lâm sàng** (đo sinh hiệu). Nếu sau này tách thành hai vai trò, xem gợi ý ở mục 6.

**Nhân vật:** chị Hoa, 29 tuổi, điều dưỡng kiêm tiếp đón tại phòng khám 4 bác sĩ. Một ngày chị phải nghe điện thoại đặt lịch, đón bệnh nhân, đo sinh hiệu, điều phối ai vào phòng nào, thu phí và xử lý khi bác sĩ trễ hoặc bệnh nhân không đến. Chị thường đứng, dùng máy tính tại quầy và máy tính bảng khi đi lại, nên cần thao tác nhanh, ít bấm, ít gõ.

**Định nghĩa hai chế độ của màn hình hiện có (Tiếp đón & Thanh toán):**
- **Tiếp nhận:** xác nhận bệnh nhân đã đến và chuyển bệnh nhân sang bác sĩ khám.
- **Thanh toán:** sau khi bác sĩ xác nhận khám xong, thu các khoản phí (phí khám, tiền thuốc, dịch vụ) và xuất biên lai.

**Phân quyền (nguyên tắc tối thiểu cần thiết):**
- **Được:** xem, tạo, sửa, hủy lịch hẹn; đăng ký bệnh nhân; check-in; điều phối hàng đợi; nhập sinh hiệu; thu phí; xem dị ứng, bệnh nền, thuốc đang dùng của bệnh nhân.
- **Được nếu Admin cấp quyền:** duyệt lịch chờ duyệt; ghi đè có lý do trong hạn mức.
- **Không được:** xem chẩn đoán, ghi chú chuyên môn, đơn thuốc chi tiết; sửa bệnh án; kê đơn; đổi giá dịch vụ; cấu hình lịch trực của bác sĩ.

**Nguồn:** bản v1 (14 user story theo epic) và code `NurseOverviewPage.tsx` đang chạy. Các hàm dịch vụ đang dùng trong code (`receptionistService`): `getTodaysAppointments`, `checkInPatient`, `processPayment`, `downloadReceiptPdf`, `getDashboardStats`.

**Khác với v1:**
- Bỏ khám từ xa: bỏ story "Hỗ trợ buổi khám từ xa" (v1 US-10).
- Đổi "lễ tân" thành "điều dưỡng"; vòng đời lịch hẹn theo mã đang dùng trong code (`PENDING`…`PAID`), bỏ `PENDING_PAYMENT` và `RESCHEDULED` riêng.
- Sửa mã yêu cầu theo tài liệu hiện hành (báo cáo là FR-10, không còn FR-11).
- Thêm chức năng thấy được qua code nhưng v1 chưa có: hai chế độ Tiếp nhận/Thanh toán, ghi chú check-in, thẻ thu tiền trong ngày, tải biên lai PDF.
- Bổ sung phần thu phí đầy đủ (chi tiết các khoản, phương thức, giảm giá, hoàn tiền) và các điểm còn thiếu của màn hình hiện tại (mục 1.2).

Endpoint ghi trong tài liệu là **đề xuất**, cần đối chiếu với `backend`. Phụ lục A đối chiếu story v1 với mã mới.

### 1.2 Hiện trạng giao diện (theo code `NurseOverviewPage.tsx`)

| Màn hình | Đang có | Còn thiếu |
| --- | --- | --- |
| Tiếp đón & Thanh toán, chế độ **Tiếp nhận** | Bảng ca hôm nay (Giờ hẹn, Bệnh nhân, Bác sĩ phụ trách, Trạng thái, Thao tác); tìm theo tên/SĐT; nút "Check-in" cho lịch `PENDING`/`CONFIRMED`; hộp thoại tiếp đón có ghi chú, nút "Chuyển chờ khám" | Lọc bác sĩ/trạng thái, quét QR, cảnh báo sớm/muộn, nút đo sinh hiệu, xem chi tiết ca, cập nhật tự động |
| Tiếp đón & Thanh toán, chế độ **Thanh toán** | Bảng ca `COMPLETED`/`PAID`; nút "Thu tiền"; hộp thoại thu tiền (một dòng "Tiền khám & dịch vụ", "Tổng cần thu"); thu xong tự tải biên lai PDF; thẻ "Thu tiền trong ngày" và "Tiến độ thu" | Chi tiết các khoản (thuốc, dịch vụ), chọn phương thức, giảm giá, hoàn tiền, xem lại biên lai |
| Chưa thấy trong code | | Bảng điều khiển, đặt lịch hộ, quản lý lịch hẹn, hàng đợi và điều phối, tiền khám (sinh hiệu), màn hình chờ, xử lý bác sĩ nghỉ/trễ, hộp yêu cầu, kết ca |

**Các điểm cần lưu ý từ code hiện tại:**
1. Ca `IN_PROGRESS`, `CANCELLED`, `NO_SHOW` **không hiện ở cả hai chế độ**, nên điều dưỡng không thấy bệnh nhân đang khám hoặc đã hủy (DD-TN-05).
2. Ca `CHECKED_IN` và `TRIAGED` chỉ hiện chữ "Không thao tác", thiếu nút đo sinh hiệu (DD-TN-07).
3. Thu tiền chỉ có một dòng phí và không chọn được phương thức thanh toán (DD-TT-07, DD-TT-09).
4. Danh sách chỉ tải khi mở trang và sau mỗi thao tác, không tự cập nhật khi bệnh nhân khác check-in (DD-TN-18).
5. Nhãn `CONFIRMED` đang là "Mới đến" (dễ hiểu nhầm là đã đến) và `COMPLETED` là "Nợ phí" (dễ hiểu nhầm là còn nợ). Nên đổi, xem DD-TN-06.
6. Lịch `PENDING` (chưa duyệt) vẫn check-in được. Cần chốt có nên cho phép hay không (DD-TN-11).
7. Cột bên phải chỉ có ở chế độ Thanh toán, chế độ Tiếp nhận để trống 3/12 chiều rộng (DD-TN-20).

### 1.3 Tính năng đề xuất thêm

| Ưu tiên | Tính năng | Vì sao hữu ích |
| --- | --- | --- |
| P1 | Hiển thị đủ ca trong ngày (đang khám, đã hủy, vắng mặt) và bộ lọc bác sĩ/trạng thái | Điều dưỡng thấy toàn bộ tình hình, không "mất" bệnh nhân khỏi danh sách |
| P1 | Nút "Đo sinh hiệu" và màn hình tiền khám | Nối bước check-in với bước khám của bác sĩ |
| P1 | Cảnh báo khi check-in (sớm, muộn, chưa duyệt, chưa cọc) | Tránh check-in sai |
| P1 | Chi tiết các khoản phí (khám, thuốc, dịch vụ) và chọn phương thức thanh toán | Khớp với việc thu phí thực tế sau khám |
| P1 | Chặn thu phí khi bác sĩ chưa hoàn tất khám | Tránh thu nhầm |
| P1 | Tự cập nhật danh sách theo thời gian thực | Không phải tải lại trang |
| P1 | Hàng đợi, gọi bệnh nhân, ưu tiên, vắng mặt | Vận hành trơn tru khi đông |
| P2 | Đặt lịch hộ qua điện thoại, khám vãng lai, quản lý lịch hẹn | Phục vụ người không dùng được ứng dụng |
| P2 | Màn hình chờ cho khu chờ | Bệnh nhân biết khi nào đến lượt |
| P2 | Bảng điều khiển, cột thống kê ở chế độ Tiếp nhận | Biết ngay điểm nghẽn |
| P2 | Giảm giá, hoàn tiền có lý do và duyệt; xem lại biên lai | Kiểm soát thất thoát |
| P2 | Xử lý hàng loạt khi bác sĩ nghỉ/trễ | Không bệnh nhân nào bị bỏ lửng |
| P3 | Danh sách chờ, hộp yêu cầu hỗ trợ, SLA, báo cáo ca xuất PDF, in phiếu số thứ tự | Hoàn thiện |

### 1.4 Sơ đồ menu đề xuất

```
TIẾP ĐÓN
  Bảng điều khiển           (mới)
  Tiếp đón & Thanh toán     (hiện có, 2 chế độ: Tiếp nhận / Thanh toán)
  Lịch hẹn                  (mới: đặt lịch hộ, vãng lai, sửa/hủy)
HÀNG ĐỢI & KHÁM
  Hàng đợi & Điều phối      (mới)
  Tiền khám (sinh hiệu)     (mới)
  Màn hình chờ              (mở ở màn hình riêng, không cần đăng nhập)
HỖ TRỢ
  Yêu cầu cần xử lý         (mới)
CA LÀM VIỆC
  Kết ca & Báo cáo          (mới)
  Tài khoản                 (mới)
```

Mã module: TN (Tiếp nhận), TT (Thanh toán), TK (Tiền khám), HD (Hàng đợi), MC (Màn hình chờ), DL (Đặt lịch hộ và lịch hẹn), PS (Xử lý phát sinh), YC (Yêu cầu và danh sách chờ), DB (Bảng điều khiển), KC (Kết ca và báo cáo), AC (Tài khoản và ca trực), GN (Khung chung).

### 1.5 Nguyên tắc chung và quy ước
- **Nhanh và ít thao tác.** Ưu tiên màn hình máy tính và máy tính bảng; có phím tắt cho việc lặp lại; ô tìm kiếm và ô quét QR luôn sẵn sàng nhập.
- **Quyền tối thiểu.** Điều dưỡng không thấy chẩn đoán, đơn thuốc chi tiết; API trả `403` nếu truy cập ngoài quyền.
- **Mọi ghi đè đều có lý do và có nhật ký:** chèn vượt sức chứa, xếp lại hàng đợi, giảm giá, hoàn tiền, hủy lịch.
- **Không bấm trùng:** nút bị khóa khi đang xử lý; thao tác lặp (check-in, thu tiền) không tạo bản ghi thứ hai.
- **Màn hình chờ không lộ dữ liệu cá nhân.**
- **Nhãn:** **Hiện có** = thấy trong code `NurseOverviewPage.tsx`; **Hiện có · đối chiếu** = có nhưng cần xác nhận hành vi; **v1** = đặc tả cũ, chưa thấy trong code; **Mới** = đề xuất thêm. Ưu tiên P1 (làm trước), P2 (nên có), P3 (làm sau).
- **Giá trị đề xuất** (chủ phòng khám chốt, chỉnh ở Admin mục Cấu hình): check-in mở trước 60 phút, đến muộn quá 15 phút, gọi 3 lần cách 5 phút, cảnh báo chờ lâu 30 phút, tối đa 3 lịch chưa khám.

**Nhãn trạng thái lịch hẹn trên giao diện Điều dưỡng:**

| Mã | Nhãn hiện tại trong code | Nhãn đề xuất |
| --- | --- | --- |
| `PENDING` | Chưa duyệt | Chưa duyệt |
| `CONFIRMED` | Mới đến | **Đã xác nhận** (chưa chắc bệnh nhân đã đến) |
| `CHECKED_IN` | Đã Check-in | Đã check-in |
| `TRIAGED` | Đã Sinh hiệu | Đã đo sinh hiệu |
| `IN_PROGRESS` | Đang Khám | Đang khám |
| `COMPLETED` | Nợ phí | **Chờ thanh toán** (đã khám xong) |
| `PAID` | Hoàn tất | Hoàn tất |
| `CANCELLED` | (chưa hiển thị) | Đã hủy |
| `NO_SHOW` | (chưa hiển thị) | Vắng mặt |

---

## 2. Chi tiết theo module

### 2.1 Tiếp nhận (TN)
*Màn hình: Tiếp đón & Thanh toán, chế độ **Tiếp nhận**. Tiếp nhận là xác nhận bệnh nhân đã đến và chuyển sang bác sĩ khám.*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| DD-TN-01 | **Danh sách ca hôm nay.** Là điều dưỡng, tôi muốn thấy các ca khám của hôm nay trong một bảng để biết ai sắp đến. | **FE:** bảng 5 cột: Giờ hẹn (ô xám), Bệnh nhân (tên đậm, dưới là SĐT hoặc "Chưa cập nhật SĐT"), Bác sĩ phụ trách (biểu tượng và "BS. …"), Trạng thái (nhãn màu), Thao tác; các hàng hiện lần lượt. **BE:** `getTodaysAppointments` → `GET /staff/appointments?date=today`. | Chỉ ca của hôm nay; sắp xếp theo giờ hẹn; không hiện chữ "BS. BS." thừa. | Hiện có · P1 |
| DD-TN-02 | **Hai nút chế độ.** Là điều dưỡng, tôi muốn chuyển nhanh giữa Tiếp nhận và Thanh toán để làm đúng việc. | **FE:** hai nút lớn có biểu tượng, mô tả ngắn và huy hiệu số ca chờ (Tiếp nhận: `PENDING`+`CONFIRMED`; Thanh toán: `COMPLETED`); nút đang chọn tô màu, có thanh nhấn chân nút; bấm đổi cả danh sách. | Huy hiệu đếm theo toàn bộ danh sách, không theo ô tìm kiếm; làm mới trang vẫn nhớ chế độ đang chọn (Mới). | Hiện có · P1 |
| DD-TN-03 | **Tìm kiếm.** Là điều dưỡng, tôi muốn tìm bệnh nhân theo tên hoặc SĐT để xử lý nhanh khi họ đến quầy. | **FE:** ô "Tìm tên, SĐT bệnh nhân…" ở đầu trang, lọc ngay khi gõ. **Mở rộng (Mới):** không phân biệt dấu tiếng Việt, tìm thêm theo mã lịch, mã bệnh nhân, CCCD; nút xóa nhanh; phím tắt `/`. | Gõ "nguyen" ra "Nguyễn"; tìm theo mã lịch trả đúng một dòng. | Hiện có · P1 (mở rộng: Mới) |
| DD-TN-04 | **Lọc theo bác sĩ và trạng thái.** Là điều dưỡng, tôi muốn lọc danh sách để chỉ xem một bác sĩ hoặc một nhóm trạng thái. | **FE:** hai ô chọn cạnh ô tìm kiếm; nút "Xóa lọc". | Lọc kết hợp được với ô tìm kiếm và chế độ đang chọn. | Mới · P1 |
| DD-TN-05 | **Xem đủ ca trong ngày.** Là điều dưỡng, tôi muốn thấy cả ca đang khám, đã hủy, vắng mặt để nắm toàn bộ tình hình. | **FE:** thêm tab/bộ lọc "Tất cả hôm nay" (chỉ xem) hiển thị cả `IN_PROGRESS`, `CANCELLED`, `NO_SHOW`; hiện không ca nào trong ba trạng thái này xuất hiện ở hai chế độ. | Tổng số dòng ở "Tất cả hôm nay" bằng tổng lịch của ngày. | Mới · P1 |
| DD-TN-06 | **Nhãn trạng thái.** Là điều dưỡng, tôi muốn nhãn trạng thái dễ hiểu để không nhầm. | **FE:** nhãn màu kèm chữ theo bảng mục 1.5; đổi `CONFIRMED` từ "Mới đến" thành "Đã xác nhận" và `COMPLETED` từ "Nợ phí" thành "Chờ thanh toán"; giữ hiệu ứng nhấp nháy nhẹ cho ca chờ thanh toán. | Nhãn trùng với nhãn bên giao diện Bệnh nhân (`CONFIRMED` là "Đã xác nhận"). | Hiện có · P1 (đổi nhãn: Mới) |
| DD-TN-07 | **Cột Thao tác theo trạng thái.** Là điều dưỡng, tôi muốn mỗi dòng chỉ hiện việc có thể làm tiếp để khỏi nhầm. | **FE:** `PENDING`/`CONFIRMED` → "Check-in"; `CHECKED_IN` → "Đo sinh hiệu" (mở DD-TK-01); `TRIAGED` → "Xem hàng đợi"; các trạng thái khác → "Không thao tác" (chữ nghiêng xám). | Hiện `CHECKED_IN` và `TRIAGED` chỉ có "Không thao tác"; hai nút mới nối sang tiền khám và hàng đợi. | Hiện có · P1 (nút mới: Mới) |
| DD-TN-08 | **Check-in từ danh sách.** Là điều dưỡng, tôi muốn bấm Check-in để chuyển bệnh nhân vào hàng chờ khám. | **FE:** nút "Check-in" mở hộp thoại "Tiếp đón Bệnh nhân": khung thông tin (tên, SĐT, "Bác sĩ khám: BS. …"), ô "Ghi chú (Tùy chọn)", nút "Đóng" và "Chuyển chờ khám". **BE:** `checkInPatient(id, note)` → `POST /appointments/{id}/check-in`. | Bấm ra ngoài hoặc "Đóng" thì đóng hộp thoại (trừ lúc đang xử lý). | Hiện có · P1 |
| DD-TN-09 | **Kết quả sau khi bấm "Chuyển chờ khám".** Là điều dưỡng, tôi muốn biết thao tác thành công hay lỗi để yên tâm. | **FE:** thông báo "Đang xử lý tiếp đón…" rồi "Tiếp đón thành công!"; hộp thoại đóng, xóa ghi chú, tải lại danh sách; nút khóa và hiện "Đang xử lý…" lúc chờ; lỗi hiện nội dung máy chủ trả về. | Bấm hai lần không tạo hai lần check-in. | Hiện có · P1 |
| DD-TN-10 | **Dùng tiếp ghi chú check-in.** Là điều dưỡng, tôi muốn ghi chú lúc check-in được bác sĩ thấy để khỏi dặn miệng. | **FE:** ghi chú hiện ở hàng đợi và màn hình khám của bác sĩ; giới hạn 200 ký tự, nhắc "không ghi chẩn đoán". **BE:** lưu `checkin_note`. | Ghi chú chỉ có nội dung hành chính (ví dụ "đi cùng người nhà", "cần xe lăn"). | Mới · P2 |
| DD-TN-11 | **Check-in lịch chưa duyệt.** Là điều dưỡng, tôi muốn biết khi lịch chưa được duyệt để không check-in nhầm. | **FE:** hiện cho check-in lịch `PENDING`; đề xuất thêm hộp cảnh báo "Lịch chưa được duyệt" kèm lựa chọn "Duyệt và check-in" (nếu có quyền) hoặc "Hủy". **BE:** nếu duyệt thì lưu `approved_by`. | Chốt hành vi ở câu hỏi 2 mục 6 trước khi làm. | Hiện có · đối chiếu · P1 |
| DD-TN-12 | **Cảnh báo khi check-in.** Là điều dưỡng, tôi muốn được báo các trường hợp bất thường trước khi check-in để xử lý đúng. | **FE:** cảnh báo ngay trên hộp thoại: đến quá sớm, đến muộn quá ngưỡng, sai ngày, đã check-in lúc …, chưa thanh toán đặt cọc (nếu có). **BE:** trả mã lỗi rõ ràng theo từng trường hợp, ngưỡng lấy từ cấu hình (AD-CF-03). | Check-in lại cùng lịch trả "đã check-in lúc …" thay vì tạo trùng. | v1 · P1 |
| DD-TN-13 | **Check-in bằng QR hoặc mã.** Là điều dưỡng, tôi muốn quét QR của bệnh nhân để check-in trong vài giây. | **FE:** ô "Quét QR / nhập mã / SĐT" luôn được chọn sẵn (phím tắt `F2`), máy quét QR tự điền và tự tìm lịch; kết quả hiện thẻ ở DD-TN-14. **BE:** `GET /appointments/lookup?code=`. | Quét xong chỉ cần một lần bấm xác nhận; mã sai báo rõ. | v1 · P1 |
| DD-TN-14 | **Thẻ kết quả tra cứu.** Là điều dưỡng, tôi muốn thấy thông tin cần thiết ngay khi tra cứu để xác nhận đúng người. | **FE:** thẻ gồm tên, bác sĩ, giờ hẹn, trạng thái thanh toán (nếu có cọc), giấy tờ cần mang; nút "Check-in". | Không hiển thị chẩn đoán hay lý do khám chi tiết. | v1 · P1 |
| DD-TN-15 | **Xử lý bệnh nhân đến muộn.** Là điều dưỡng, tôi muốn có lựa chọn rõ khi bệnh nhân đến muộn để vẫn phục vụ công bằng. | **FE:** sau cảnh báo, chọn "Xếp lại cuối hàng" hoặc "Đổi lịch", bắt buộc ghi lý do. **BE:** ghi `queue_events`. | Lựa chọn nào cũng có nhật ký; bệnh nhân nhận thông báo nếu đổi lịch. | v1 · P2 |
| DD-TN-16 | **In phiếu số thứ tự.** Là điều dưỡng, tôi muốn in phiếu số cho bệnh nhân không dùng điện thoại. | **FE:** nút "In phiếu" sau check-in (máy in nhiệt): số thứ tự, bác sĩ, phòng. | Phiếu không in thông tin y tế. | v1 · P3 |
| DD-TN-17 | **Xem chi tiết ca.** Là điều dưỡng, tôi muốn mở một ca để xem đầy đủ thông tin hành chính mà không rời danh sách. | **FE:** bấm vào dòng mở panel bên phải: người đặt và kênh đặt, bác sĩ, giờ hẹn, lý do khám do bệnh nhân khai, dòng thời gian trạng thái (ai chuyển, lúc nào), ghi chú check-in. **BE:** `GET /staff/appointments/{id}`. | Không hiển thị chẩn đoán, đơn thuốc, ghi chú chuyên môn. | Mới · P2 |
| DD-TN-18 | **Tự cập nhật danh sách.** Là điều dưỡng, tôi muốn danh sách tự cập nhật khi có bệnh nhân check-in hay bác sĩ hoàn tất để không phải tải lại. | **FE:** cập nhật theo thời gian thực; hiện "Cập nhật lúc hh:mm"; nút "Làm mới"; ngắt kết nối thì báo "Đang kết nối lại". **BE:** kênh WebSocket/SSE `clinic:{id}` đẩy `appointment.*`. | Thay đổi xuất hiện trong ≤ 3 giây; hiện chỉ tải khi mở trang và sau mỗi thao tác. | Mới · P1 |
| DD-TN-19 | **Trạng thái tải, trống, lỗi.** Là điều dưỡng, tôi muốn màn hình báo rõ khi đang tải, không có dữ liệu hoặc lỗi. | **FE:** đang tải hiện biểu tượng quay và "Đang đồng bộ danh sách…"; trống hiện "Chưa có lịch hẹn nào / Không tìm thấy bệnh nhân trong danh mục này."; lỗi hiện "Không thể đồng bộ dữ liệu với hệ thống." (đề xuất thêm nút "Thử lại" và khung xương khi tải). | Không để màn hình trống trắng khi lỗi. | Hiện có · P1 |
| DD-TN-20 | **Cột thống kê ở chế độ Tiếp nhận.** Là điều dưỡng, tôi muốn có thẻ thống kê bên phải để nắm nhanh số ca. | **FE:** thêm cột bên phải (3/12) ở chế độ Tiếp nhận: Chờ tiếp nhận, Đã check-in đang chờ, Đã đo sinh hiệu, Đang khám; bấm thẻ để lọc danh sách. | Hiện cột này để trống ở chế độ Tiếp nhận; số khớp với danh sách. | Mới · P2 |
| DD-TN-21 | **Xem ngày khác.** Là điều dưỡng, tôi muốn xem lịch ngày mai hoặc hôm qua để chuẩn bị và tra cứu. | **FE:** ô chọn ngày; ngày khác hôm nay chỉ xem, không check-in. **BE:** `GET /staff/appointments?date=`. | Ngày khác hôm nay không hiện nút Check-in/Thu tiền. | Mới · P3 |

### 2.2 Thanh toán (TT)
*Màn hình: Tiếp đón & Thanh toán, chế độ **Thanh toán**. Thu các khoản phí (phí khám, tiền thuốc, dịch vụ) **sau khi bác sĩ xác nhận khám xong**. Giá và danh mục dịch vụ do Admin quản lý (AD-SV). Chỉ áp dụng nếu chủ phòng khám chốt giữ thanh toán trên hệ thống (FR-09).*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| DD-TT-01 | **Danh sách thu phí.** Là điều dưỡng, tôi muốn thấy các ca đã khám xong cần thu và đã thu để theo dõi. | **FE:** bảng như DD-TN-01 nhưng chỉ `COMPLETED` ("chờ thanh toán") và `PAID` ("Hoàn tất"). | Ca `IN_PROGRESS` không xuất hiện (xem DD-TT-14). | Hiện có · P1 |
| DD-TT-02 | **Nút Thu tiền.** Là điều dưỡng, tôi muốn bấm Thu tiền ở đúng ca cần thu để mở thanh toán. | **FE:** ca `COMPLETED` có nút đỏ "Thu tiền" (nhấp nháy nhẹ khi chưa rê chuột); ca `PAID` hiện "Không thao tác" (đề xuất đổi thành "Xem biên lai", DD-TT-13). | Bấm Thu tiền mở hộp thoại ở DD-TT-03. | Hiện có · P1 |
| DD-TT-03 | **Hộp thoại thu tiền.** Là điều dưỡng, tôi muốn thấy bệnh nhân và số tiền trước khi thu để không thu nhầm. | **FE:** hộp thoại "Thu tiền Viện phí": khung thông tin (tên, SĐT, bác sĩ khám); khung đỏ nhạt "Tiền khám & dịch vụ" và "Tổng cần thu" (định dạng VNĐ); nút "Đóng", "Thu tiền & Xuất biên lai". | Số tiền hiển thị khớp số tiền hệ thống sẽ ghi nhận. | Hiện có · P1 |
| DD-TT-04 | **Thu tiền và xuất biên lai.** Là điều dưỡng, tôi muốn một lần bấm vừa ghi nhận thu tiền vừa có biên lai để hoàn tất nhanh. | **FE:** thông báo "Đang xử lý thanh toán…" → "Đang xuất biên lai…" → "Thanh toán & Xuất biên lai thành công!"; tự tải tệp `BienLai_<Tên>.pdf`; đóng hộp thoại, tải lại danh sách. **BE:** `processPayment(id)` → `downloadReceiptPdf(id)`. | Lỗi ở bước nào báo đúng bước đó; thu xong ca chuyển `PAID`. | Hiện có · P1 |
| DD-TT-05 | **Thẻ "Thu tiền trong ngày".** Là điều dưỡng, tôi muốn thấy tổng tiền đã thu hôm nay để đối chiếu cuối ngày. | **FE:** thẻ gradient xanh lá bên phải: tổng thu hôm nay (VNĐ). **BE:** `getDashboardStats().totalRevenue`. | Tổng bằng tổng giao dịch thành công trong ngày. | Hiện có · P2 |
| DD-TT-06 | **Thẻ "Tiến độ thu".** Là điều dưỡng, tôi muốn biết còn bao nhiêu ca chờ thu để sắp xếp việc. | **FE:** thẻ có nhãn "Hôm nay" và số "Ca chờ thanh toán". **BE:** `getDashboardStats().completedCount`. | Số bằng số ca `COMPLETED` trong ngày. | Hiện có · P2 |
| DD-TT-07 | **Chi tiết các khoản phí.** Là điều dưỡng, tôi muốn thấy từng khoản (khám, thuốc, dịch vụ) để giải thích cho bệnh nhân và thu đúng. | **FE:** thay một dòng "Tiền khám & dịch vụ" bằng bảng khoản: phí khám, thuốc theo đơn, dịch vụ/xét nghiệm do bác sĩ chỉ định, tổng cộng. **BE:** `GET /appointments/{id}/billing` lấy theo chỉ định của bác sĩ và giá ở AD-SV. | Điều dưỡng không sửa được giá; danh mục giá thuốc cần chốt (câu hỏi 4 mục 6). | Mới · P1 |
| DD-TT-08 | **Đã cọc, BHYT, giảm giá.** Là điều dưỡng, tôi muốn các khoản trừ hiện rõ để biết số còn phải thu. | **FE:** các dòng "Đã đặt cọc", "BHYT chi trả" (nếu có), "Giảm giá" (nếu có), "Còn phải thu". | Tổng = tổng các khoản − các khoản trừ. | v1 · P2 |
| DD-TT-09 | **Chọn phương thức thanh toán.** Là điều dưỡng, tôi muốn chọn tiền mặt, chuyển khoản hoặc ví để ghi nhận đúng. | **FE:** nhóm nút chọn phương thức; với tiền mặt có ô "Khách đưa" và tự tính "Tiền thừa". **BE:** `processPayment(id, { method, amount_received })`. | Hiện chưa chọn được phương thức; thiếu số tiền khách đưa thì không cho hoàn tất tiền mặt. | v1 · P1 |
| DD-TT-10 | **QR chuyển khoản.** Là điều dưỡng, tôi muốn tạo mã QR theo đúng số tiền để bệnh nhân quét trả. | **FE:** hiện QR động và trạng thái "Đang chờ" → "Thành công". **BE:** `POST /payments` (`channel = COUNTER`), webhook cổng thanh toán. | Chỉ hiện cổng đang bật ở AD-CF-07; thành công thì tự chuyển `PAID`. | v1 · P2 |
| DD-TT-11 | **Giảm giá hoặc đổi phí.** Là điều dưỡng, tôi muốn giảm giá trong hạn mức khi có lý do để hỗ trợ trường hợp đặc biệt. | **FE:** nút "Giảm giá" với số tiền hoặc % và lý do bắt buộc; vượt hạn mức thì hiện "Chờ quản lý duyệt". **BE:** tạo yêu cầu ở AD-AP-01. | Mọi giảm giá có lý do và người duyệt trong nhật ký. | v1 · P2 |
| DD-TT-12 | **Hoàn tiền cọc.** Là điều dưỡng, tôi muốn hoàn cọc đúng chính sách để bệnh nhân không phải quay lại. | **FE:** nút "Hoàn tiền" với lý do; số tiền lớn xin duyệt. **BE:** `POST /payments/{id}/refund` kiểm tra quyền và hạn mức. | Hoàn tiền vượt hạn mức chờ Admin duyệt (AD-PY-04). | v1 · P2 |
| DD-TT-13 | **Xem lại, in lại, gửi biên lai.** Là điều dưỡng, tôi muốn mở lại biên lai của ca đã thu khi bệnh nhân cần. | **FE:** ca `PAID` có nút "Xem biên lai": xem PDF, "In lại", "Gửi qua email/Zalo". **BE:** `GET /payments/{id}/receipt`. | Biên lai có mã tra cứu duy nhất, nội dung không đổi giữa các lần in. | Mới · P2 |
| DD-TT-14 | **Chặn thu khi chưa khám xong.** Là điều dưỡng, tôi muốn hệ thống chỉ cho thu phí sau khi bác sĩ hoàn tất khám để tránh thu sai. | **FE:** ca `IN_PROGRESS` hiện nhãn "Chờ bác sĩ hoàn tất" (chỉ xem), không có nút thu. **BE:** kiểm tra `COMPLETED`, ngược lại trả `409`. | Gọi thẳng API khi chưa `COMPLETED` bị từ chối. | Mới · P1 |
| DD-TT-15 | **Chống thu trùng và lỗi thanh toán.** Là điều dưỡng, tôi muốn thao tác thu không bị ghi hai lần dù mạng chập chờn. | **FE:** nút khóa khi đang xử lý; báo lỗi và cho "Thử lại". **BE:** xử lý idempotent, webhook xác thực chữ ký, giao dịch treo quá hạn tự hủy. | Bấm hai lần hoặc webhook gọi lặp chỉ ghi một giao dịch. | v1 · P1 |
| DD-TT-16 | **Ghi nhận chưa thu được.** Là điều dưỡng, tôi muốn ghi lại khi bệnh nhân chưa thể trả để theo dõi sau. | **FE:** nút "Chưa thu được" với lý do và hẹn thanh toán; ca vẫn ở "Chờ thanh toán". | Ca chưa thu hiện trong báo cáo kết ca (DD-KC-03). Cần chủ phòng khám chốt chính sách. | Mới · P3 |

### 2.3 Tiền khám (TK)
*Màn hình: Tiền khám (sinh hiệu), mở từ hàng đợi hoặc từ nút "Đo sinh hiệu" ở DD-TN-07. Đưa lịch từ `CHECKED_IN` sang `TRIAGED`.*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| DD-TK-01 | **Mở màn hình tiền khám.** Là điều dưỡng, tôi muốn mở tiền khám đúng bệnh nhân chỉ bằng một lần bấm để đo ngay. | **FE:** nút "Đo sinh hiệu" ở danh sách và hàng đợi mở màn hình/panel tiền khám. | Chỉ mở được cho lịch `CHECKED_IN`. | v1 · P1 |
| DD-TK-02 | **Thông tin cần chú ý.** Là điều dưỡng, tôi muốn thấy dị ứng, bệnh nền, thuốc đang dùng nổi bật để đo và hỏi đúng trọng tâm. | **FE:** khung đầu màn hình: tên, tuổi, giới; **dị ứng nổi bật màu đỏ**; bệnh nền; thuốc đang dùng. **BE:** `GET /patients/{id}/triage-summary` chỉ trả các trường được phép. | Không hiện chẩn đoán cũ chi tiết, đơn thuốc, ghi chú chuyên môn. | v1 · P1 |
| DD-TK-03 | **Nhập sinh hiệu.** Là điều dưỡng, tôi muốn nhập các chỉ số đo được để bác sĩ có sẵn dữ liệu. | **FE:** huyết áp (tâm thu/tâm trương), mạch, nhiệt độ, nhịp thở, SpO₂, cân nặng, chiều cao; BMI tự tính; bàn phím số trên máy tính bảng. **BE:** `POST /visits/{id}/vitals` lưu `measured_by`, `measured_at`. | Mọi ô số nhập được bằng bàn phím số, chuyển ô bằng phím Tab/Enter. | v1 · P1 |
| DD-TK-04 | **Mức đau, lý do khám, ghi chú.** Là điều dưỡng, tôi muốn ghi lý do khám và mức đau để bác sĩ nắm nhanh. | **FE:** thang mức đau 0–10; ô "Lý do khám/triệu chính" (điền sẵn từ lúc đặt lịch, sửa được); ô ghi chú. | Lý do khám bắt buộc. | v1 · P1 |
| DD-TK-05 | **Kiểm tra giá trị.** Là điều dưỡng, tôi muốn được báo khi nhập số bất thường hoặc vô lý để tránh nhập sai. | **FE:** giá trị vô lý (ví dụ nhiệt độ 73) báo lỗi và không cho lưu; giá trị bất thường nhưng có thể xảy ra tô màu cảnh báo; khoảng tham chiếu theo tuổi, riêng trẻ em dùng bảng khác (khoa Nhi). **BE:** validate theo độ tuổi. | Bảng ngưỡng do bác sĩ phòng khám duyệt trước khi dùng. | v1 · P1 |
| DD-TK-06 | **Cảnh báo nguy cấp.** Là điều dưỡng, tôi muốn hệ thống báo bác sĩ ngay khi chỉ số nguy hiểm để bệnh nhân được xử lý sớm. | **FE:** khung đỏ "Chỉ số nguy cấp, đã báo bác sĩ". **BE:** sinh `triage.critical`, đẩy tới bác sĩ và tự nâng ưu tiên trong hàng đợi (SpO₂ thấp, sốt rất cao, huyết áp rất cao). | Cảnh báo tới bác sĩ ≤ 3 giây. | v1 · P1 |
| DD-TK-07 | **Hoàn tất tiền khám.** Là điều dưỡng, tôi muốn xác nhận đã đo xong để bệnh nhân sẵn sàng vào khám. | **FE:** nút "Hoàn tất tiền khám" → lịch `TRIAGED`; thông báo thành công. **BE:** `POST /visits/{id}/triage-complete`. | Bác sĩ thấy sinh hiệu ngay trong màn hình khám. | v1 · P1 |
| DD-TK-08 | **Sửa sinh hiệu.** Là điều dưỡng, tôi muốn sửa số đã nhập sai khi chưa có bác sĩ khám để dữ liệu đúng. | **FE:** nút "Sửa" trước khi bác sĩ bắt đầu khám; sau đó chỉ tạo bản hiệu chỉnh kèm lý do. **BE:** lưu phiên bản và người sửa. | Sau khi `IN_PROGRESS` không sửa trực tiếp. | v1 · P2 |
| DD-TK-09 | **So với lần đo trước.** Là điều dưỡng, tôi muốn thấy sinh hiệu lần trước để nhận ra thay đổi bất thường. | **FE:** cột nhỏ bên cạnh mỗi ô: giá trị lần trước và ngày. **BE:** `GET /patients/{id}/last-vitals`. | Chỉ dữ liệu sinh hiệu, không kèm chẩn đoán. | Mới · P3 |

### 2.4 Hàng đợi và điều phối (HD)
*Màn hình mới: Hàng đợi & Điều phối.*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| DD-HD-01 | **Bảng hàng đợi.** Là điều dưỡng, tôi muốn thấy hàng đợi của từng bác sĩ để biết ai sẽ vào khám tiếp. | **FE:** bảng: STT, tên, giờ hẹn, giờ check-in, thời gian chờ, trạng thái, nhãn ưu tiên. **BE:** `GET /queue?doctor_id=`. | Thứ tự khớp với màn hình chờ và ứng dụng bệnh nhân. | v1 · P1 |
| DD-HD-02 | **Xem nhiều bác sĩ.** Là điều dưỡng, tôi muốn chuyển giữa các bác sĩ hoặc xem cạnh nhau để điều phối. | **FE:** tab theo bác sĩ hoặc các cột cạnh nhau (4 bác sĩ); số người chờ trên từng tab. | Chuyển tab không mất bộ lọc. | Mới · P2 |
| DD-HD-03 | **Gọi và gọi lại.** Là điều dưỡng, tôi muốn gọi bệnh nhân vào khám và gọi lại khi họ chưa tới. | **FE:** nút "Gọi", "Gọi lại"; tên được đọc và hiện trên màn hình chờ. **BE:** `POST /queue/{id}/call`; đếm số lần gọi. | Màn hình chờ và ứng dụng bệnh nhân đổi số trong ≤ 2 giây. | v1 · P1 |
| DD-HD-04 | **Đánh dấu vắng mặt.** Là điều dưỡng, tôi muốn ghi nhận bệnh nhân không đến sau khi gọi đủ lần để hàng đợi chạy tiếp. | **FE:** nút "Vắng mặt" bật sau khi gọi đủ số lần; có "Khôi phục" trong ngày kèm lý do. **BE:** `POST /queue/{id}/no-show` (mặc định gọi 3 lần cách 5 phút, cấu hình ở AD-CF-03). | Không đánh dấu khi chưa gọi đủ số lần. | v1 · P1 |
| DD-HD-05 | **Ưu tiên.** Là điều dưỡng, tôi muốn đẩy bệnh nhân cần ưu tiên lên trước khi có lý do để họ được khám sớm. | **FE:** nút "Ưu tiên" với lý do bắt buộc: người cao tuổi, thai phụ, trẻ nhỏ, sốt cao, khác. **BE:** `POST /queue/{id}/prioritize`; ghi `queue_events`. | Bệnh nhân thấy nhãn "Được ưu tiên" ở ứng dụng. | v1 · P1 |
| DD-HD-06 | **Đổi thứ tự.** Là điều dưỡng, tôi muốn kéo thả để sắp xếp lại hàng khi cần. | **FE:** kéo thả có hộp xác nhận và lý do. **BE:** `POST /queue/{id}/reorder`. | Mọi thay đổi có nhật ký "ai, trước/sau, lý do". | v1 · P2 |
| DD-HD-07 | **Chuyển bác sĩ hoặc phòng.** Là điều dưỡng, tôi muốn chuyển bệnh nhân sang bác sĩ khác cùng chuyên khoa khi bác sĩ ban đầu bận. | **FE:** nút "Chuyển" chọn bác sĩ còn khả năng nhận. **BE:** `POST /queue/{id}/transfer`. | Bệnh nhân và hai bác sĩ đều nhận thông báo. | v1 · P2 |
| DD-HD-08 | **Tạm hoãn.** Là điều dưỡng, tôi muốn tạm giữ bệnh nhân (đi vệ sinh, nghe điện thoại) mà không mất lượt. | **FE:** nút "Tạm hoãn" và "Tiếp tục". **BE:** `POST /queue/{id}/hold`. | Bệnh nhân tạm hoãn không bị tính vắng mặt. | v1 · P2 |
| DD-HD-09 | **Cảnh báo chờ lâu.** Là điều dưỡng, tôi muốn dòng đổi màu khi chờ quá lâu để xử lý kịp thời. | **FE:** vàng khi gần ngưỡng, đỏ khi quá ngưỡng (mặc định 30 phút). | Ngưỡng lấy từ cấu hình, đổi không cần sửa code. | v1 · P1 |
| DD-HD-10 | **Thời gian chờ dự kiến.** Là điều dưỡng, tôi muốn thời gian chờ được tính lại khi hàng đổi để báo cho bệnh nhân đúng. | **BE:** tính từ thời lượng khám trung bình của từng bác sĩ; cập nhật khi đổi thứ tự hoặc bác sĩ trễ. | Số hiển thị ở ứng dụng bệnh nhân khớp số ở đây. | v1 · P2 |
| DD-HD-11 | **Lịch sử thay đổi hàng đợi.** Là điều dưỡng, tôi muốn xem ai đã đổi gì để giải thích khi bệnh nhân hỏi. | **FE:** bấm vào một dòng xem `queue_events` (hành động, trước/sau, lý do, người làm). | Không sửa được nhật ký. | v1 · P2 |
| DD-HD-12 | **Số thứ tự không trùng.** Là điều dưỡng, tôi muốn số thứ tự không bị cấp trùng khi nhiều người check-in cùng lúc. | **BE:** khóa/giao dịch khi cấp số theo bác sĩ. | Hai check-in cùng lúc nhận hai số khác nhau. | v1 · P1 |
| DD-HD-13 | **Bệnh nhân bỏ về giữa chừng.** Là điều dưỡng, tôi muốn ghi nhận khi bệnh nhân rời đi để hàng đợi chính xác. | **FE:** nút "Bệnh nhân đã rời" với lý do; lịch giữ nguyên trạng thái và có ghi chú. | Chốt xử lý trạng thái ở câu hỏi 5 mục 6. | Mới · P3 |

### 2.5 Màn hình chờ (MC)
*Màn hình riêng đặt ở khu chờ, chỉ đọc, không cần đăng nhập.*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| DD-MC-01 | **Màn hình toàn khung.** Là bệnh nhân đang chờ, tôi muốn nhìn màn hình để biết khi nào đến lượt mà khỏi hỏi. | **FE:** chế độ toàn màn hình: "Đang khám", "Mời vào", danh sách kế tiếp, thời gian chờ dự kiến. **BE:** `GET /displays/{station_id}/state`; kênh `display:{id}`. | Đổi số trong ≤ 2 giây sau khi điều dưỡng gọi. | v1 · P1 |
| DD-MC-02 | **Không lộ dữ liệu cá nhân.** Là phòng khám, chúng tôi muốn màn hình chờ chỉ hiện số thứ tự và tên viết tắt để bảo vệ riêng tư. | **FE:** chỉ hiện số thứ tự và tên dạng "Nguyễn V. A."; không có SĐT, lý do khám. | Không có API nào của màn hình chờ trả họ tên đầy đủ hoặc dữ liệu y tế. | v1 · P1 |
| DD-MC-03 | **Âm báo và giọng đọc.** Là bệnh nhân, tôi muốn nghe thông báo khi gọi số để không bỏ lỡ lượt. | **FE:** âm báo và giọng đọc số/tên khi gọi; nút bật/tắt âm ở chế độ cấu hình. | Gọi lại cũng phát âm lại. | v1 · P2 |
| DD-MC-04 | **Bố cục 1/2/3 phòng.** Là điều dưỡng, tôi muốn chọn bố cục theo số phòng đang hoạt động để màn hình gọn. | **FE:** lựa chọn bố cục; mỗi cột một bác sĩ/phòng. | Đổi bố cục không cần tải lại thủ công. | v1 · P3 |
| DD-MC-05 | **Thông báo chung.** Là điều dưỡng, tôi muốn đăng dòng thông báo cho khu chờ (nghỉ lễ, bác sĩ trễ) để bệnh nhân biết. | **FE:** ô soạn thông báo với thời gian hiệu lực; chạy chữ ở chân màn hình. **BE:** `POST /displays/{id}/announcements`. | Hết hiệu lực thì tự biến mất. | v1 · P3 |
| DD-MC-06 | **Mất kết nối.** Là bệnh nhân, tôi muốn biết khi màn hình mất kết nối để không tin dữ liệu cũ. | **FE:** hiện "Đang kết nối lại" thay vì số cũ; tự nối lại. **BE:** dự phòng tải lại mỗi 10 giây. | Không bao giờ hiện số cũ mà không cảnh báo. | v1 · P2 |
| DD-MC-07 | **Cấu hình màn hình.** Là điều dưỡng, tôi muốn gắn màn hình với đúng quầy/phòng và thu hồi khi mất thiết bị. | **FE:** trang "Màn hình chờ": tạo màn hình mới (nhận liên kết có mã riêng), gắn quầy, "Thu hồi". **BE:** token riêng chỉ đọc. | Token bị thu hồi mất hiệu lực ngay. | Mới · P2 |

### 2.6 Đặt lịch hộ và lịch hẹn (DL)
*Màn hình mới: Lịch hẹn. Dùng cùng Booking Service với bệnh nhân (cùng giữ chỗ, cùng quy tắc).*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| DD-DL-01 | **Bắt đầu đặt lịch hộ.** Là điều dưỡng, tôi muốn mở nhanh luồng đặt lịch khi bệnh nhân gọi điện để phục vụ ngay. | **FE:** nút "Đặt lịch hộ" (phím tắt `N`); ô tìm bệnh nhân theo SĐT/CCCD/mã/tên, kết quả hiện khi gõ. **BE:** `GET /patients/search?q=`. | Tìm thấy hồ sơ trong ≤ 1 giây. | v1 · P1 |
| DD-DL-02 | **Đăng ký nhanh bệnh nhân mới.** Là điều dưỡng, tôi muốn tạo hồ sơ ngay trong luồng nếu bệnh nhân chưa có để khỏi chuyển màn hình. | **FE:** form tối thiểu (họ tên, SĐT, ngày sinh, giới); cảnh báo "Có thể trùng" khi trùng SĐT và ngày sinh. **BE:** `POST /patients`. | Chọn hồ sơ trùng thì dùng hồ sơ cũ, không tạo thêm. | v1 · P1 |
| DD-DL-03 | **Chọn bác sĩ và giờ.** Là điều dưỡng, tôi muốn chọn chuyên khoa, bác sĩ và giờ trống theo ý bệnh nhân để đặt đúng. | **FE:** chọn chuyên khoa → bác sĩ → lịch tuần với giờ trống. **BE:** `GET /doctors/{id}/slots`. | Giờ đã đặt hoặc bác sĩ nghỉ không chọn được. | v1 · P1 |
| DD-DL-04 | **Lý do và người khám.** Là điều dưỡng, tôi muốn ghi lý do khám và chọn đặt cho ai (bệnh nhân hoặc người thân/trẻ em) để hồ sơ đúng. | **FE:** ô lý do; bộ chọn người khám; với trẻ em ghi người giám hộ. | Lý do khám bắt buộc. | v1 · P1 |
| DD-DL-05 | **Giữ chỗ và chống trùng.** Là điều dưỡng, tôi muốn giờ được giữ trong lúc nói chuyện điện thoại để không bị người khác đặt mất. | **FE:** đồng hồ giữ chỗ (mặc định 10 phút). **BE:** `POST /appointments/hold` rồi `POST /appointments`. | Hai nơi cùng đặt một giờ thì chỉ một nơi giữ được. | v1 · P1 |
| DD-DL-06 | **Tóm tắt để đọc lại.** Là điều dưỡng, tôi muốn có khung tóm tắt để đọc lại cho bệnh nhân qua điện thoại để chắc chắn đúng. | **FE:** khung tóm tắt: bác sĩ, ngày giờ, địa chỉ, giấy tờ cần mang, dặn dò; nút "Xác nhận". **BE:** `created_via = STAFF_PHONE`, `created_by`. | Đặt hộ hoàn tất ≤ 90 giây với bệnh nhân đã có hồ sơ. | v1 · P1 |
| DD-DL-07 | **Gửi SMS xác nhận.** Là điều dưỡng, tôi muốn gửi tin xác nhận cho bệnh nhân ngay sau khi đặt để họ có mã và giờ. | **FE:** công tắc "Gửi SMS xác nhận". **BE:** Notification Service. | Lịch hiện đầy đủ ở tài khoản bệnh nhân khi họ đăng nhập (có nhãn "Đặt hộ bởi phòng khám"). | v1 · P2 |
| DD-DL-08 | **Khám vãng lai.** Là điều dưỡng, tôi muốn tiếp nhận người chưa đặt lịch để họ vẫn được khám nếu còn chỗ. | **FE:** nút "Khám vãng lai": hiện bác sĩ còn giờ trống gần nhất hoặc "Chèn vào hàng đợi"; form tối thiểu (họ tên, SĐT, ngày sinh, giới, lý do); quét CCCD hoặc gắn mã QR; chọn BHYT. **BE:** `POST /appointments/walk-in`, `type = WALK_IN`, chèn `queue_entry`. | Bác sĩ nhận thông báo; bệnh nhân vãng lai đi qua cùng các bước check-in như người đã đặt. | v1 · P2 |
| DD-DL-09 | **Chèn vượt sức chứa.** Là điều dưỡng, tôi muốn có xác nhận khi chèn vượt sức chứa ca để bác sĩ không bị quá tải. | **FE:** hộp xác nhận kèm lý do bắt buộc. **BE:** kiểm tra `capacity`; vượt thì ghi nhật ký (và gửi yêu cầu duyệt nếu cấu hình, AD-AP-01). | Không chèn vượt sức chứa mà không có lý do. | v1 · P2 |
| DD-DL-10 | **Danh sách lịch hẹn toàn phòng khám.** Là điều dưỡng, tôi muốn xem và lọc mọi lịch để trả lời khi bệnh nhân gọi hỏi. | **FE:** bảng hoặc lịch; lọc theo bác sĩ, ngày, trạng thái; tìm theo mã/SĐT/tên. **BE:** `GET /staff/appointments?...`. | Tìm theo mã lịch trả đúng một dòng. | v1 · P1 |
| DD-DL-11 | **Chi tiết lịch.** Là điều dưỡng, tôi muốn xem thông tin hành chính và lịch sử thay đổi của một lịch để giải thích. | **FE:** panel bên phải: thông tin hành chính, lịch sử thay đổi (ai sửa, lúc nào, lý do). | Không hiển thị dữ liệu y tế. | v1 · P2 |
| DD-DL-12 | **Đổi giờ.** Là điều dưỡng, tôi muốn dời lịch giúp bệnh nhân khi họ gọi để khỏi phải hủy rồi đặt lại. | **FE:** nút "Đổi giờ" chọn giờ trống mới. **BE:** `POST /appointments/{id}/reschedule`; giữ chỗ giờ mới trước, trả giờ cũ khi giờ mới đã xác nhận. | Không mất lịch cũ nếu đổi thất bại; bệnh nhân nhận thông báo. | v1 · P1 |
| DD-DL-13 | **Hủy lịch.** Là điều dưỡng, tôi muốn hủy lịch kèm lý do để giải phóng giờ cho người khác. | **FE:** nút "Hủy" với lý do bắt buộc và chính sách hoàn cọc; điều dưỡng có thể ghi đè hạn hủy có lý do (theo quyền). **BE:** `POST /appointments/{id}/cancel`. | Hủy xong giờ mở lại ngay; có nhật ký. | v1 · P1 |
| DD-DL-14 | **Gửi lại xác nhận.** Là điều dưỡng, tôi muốn gửi lại tin xác nhận khi bệnh nhân báo chưa nhận được. | **FE:** nút "Gửi lại xác nhận". **BE:** Notification Service, kênh dự phòng khi lỗi. | Không gửi trùng quá 3 lần/giờ. | v1 · P2 |
| DD-DL-15 | **Gọi xác nhận lịch ngày mai.** Là điều dưỡng, tôi muốn có danh sách lịch ngày mai chưa xác nhận để gọi nhắc và ghi kết quả. | **FE:** chế độ "Gọi xác nhận": danh sách kèm nút ghi kết quả (đã xác nhận, không nghe máy, đổi lịch). **BE:** `POST /appointments/{id}/confirmation-call`. | Kết quả "đổi lịch" mở luôn bộ chọn giờ mới. | v1 · P2 |
| DD-DL-16 | **Duyệt lịch chờ duyệt.** Là điều dưỡng, tôi muốn duyệt hoặc từ chối lịch `PENDING` khi được phân quyền để bệnh nhân biết kết quả sớm. | **FE:** nút Duyệt/Từ chối (lý do bắt buộc khi từ chối). **BE:** dùng cùng API với AD-PT-04, kiểm tra quyền. | Chỉ hiện nút khi Admin đã cấp quyền (câu hỏi 7 mục 6). | Mới · P2 |

### 2.7 Xử lý phát sinh (PS)

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| DD-PS-01 | **Cảnh báo bác sĩ nghỉ hoặc trễ.** Là điều dưỡng, tôi muốn được báo ngay khi bác sĩ nghỉ hoặc trễ để xử lý trước khi bệnh nhân đến. | **FE:** cảnh báo nổi và chấm đỏ trên chuông; đưa vào khối "Cần xử lý" (DD-DB-03). **BE:** sự kiện từ lịch nghỉ (AD-SC-12). | Cảnh báo tới trong ≤ 5 giây. | v1 · P1 |
| DD-PS-02 | **Màn hình "Lịch bị ảnh hưởng".** Là điều dưỡng, tôi muốn thấy các bệnh nhân bị ảnh hưởng với ba hướng xử lý để sắp xếp lại nhanh. | **FE:** danh sách bệnh nhân với lựa chọn: chuyển bác sĩ cùng chuyên khoa, dời giờ, hủy kèm hoàn cọc. **BE:** `GET /staff/affected-appointments?doctor_id=&from=&to=`. | Mỗi lịch kết thúc ở một trạng thái rõ ràng, không bệnh nhân nào bị bỏ lửng. | v1 · P1 |
| DD-PS-03 | **Xử lý hàng loạt và hoàn tác.** Là điều dưỡng, tôi muốn xử lý nhiều bệnh nhân một lần và hoàn tác được khi nhầm. | **FE:** ô chọn nhiều dòng, nút áp dụng; nút "Hoàn tác" trong vài phút. **BE:** `POST /appointments/bulk-reschedule\|bulk-cancel`, chạy trong giao dịch. | Hoàn tác trả lịch về trạng thái trước và thông báo lại cho bệnh nhân. | v1 · P1 |
| DD-PS-04 | **Thông báo trễ cho cả hàng đợi.** Là điều dưỡng, tôi muốn gửi nhanh tin "bác sĩ trễ khoảng 20 phút" cho mọi người đang chờ để họ khỏi sốt ruột. | **FE:** mẫu soạn nhanh, chọn thời gian trễ. **BE:** `POST /notifications/broadcast` tới danh sách lịch đã chọn. | Bệnh nhân nhận thông báo trong ≤ 1 phút. | v1 · P2 |
| DD-PS-05 | **Cập nhật thời gian chờ khi bác sĩ trễ.** Là điều dưỡng, tôi muốn thời gian chờ dự kiến tự cộng thêm khi bác sĩ trễ để thông tin đúng. | **FE:** nhập "trễ X phút" trong panel bác sĩ. **BE:** tính lại dự kiến cho cả hàng. | Số ở màn hình chờ và ứng dụng bệnh nhân cập nhật theo. | Mới · P2 |
| DD-PS-06 | **Mất mạng tại quầy.** Là điều dưỡng, tôi muốn vẫn check-in được khi mạng chập chờn để không đứng chờ. | **FE:** chế độ tạm: lưu check-in cục bộ, hiện "Chưa đồng bộ"; tự đồng bộ khi có mạng. | Không mất thao tác; có báo khi đồng bộ xong. | v1 · P2 |

### 2.8 Yêu cầu hỗ trợ và danh sách chờ (YC)

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| DD-YC-01 | **Hộp yêu cầu cần xử lý.** Là điều dưỡng, tôi muốn thấy các yêu cầu từ bệnh nhân (gọi lại, chuyển từ trợ lý AI, thắc mắc hồ sơ, góp ý) để không bỏ sót ai. | **FE:** danh sách yêu cầu với loại, trạng thái (Mới/Đang xử lý/Xong), người phụ trách. **BE:** `GET /support/requests`. | Yêu cầu mới xuất hiện không cần tải lại. | v1 · P2 |
| DD-YC-02 | **Nhận và đóng yêu cầu.** Là điều dưỡng, tôi muốn nhận một yêu cầu và ghi chú khi xong để không xử lý trùng. | **FE:** nút "Nhận", "Đóng" kèm ghi chú. **BE:** `PATCH /support/requests/{id}`. | Mỗi yêu cầu có một người phụ trách duy nhất. | v1 · P2 |
| DD-YC-03 | **Cảnh báo quá hạn xử lý.** Là điều dưỡng, tôi muốn được nhắc khi yêu cầu để quá 15 phút để xử lý kịp. | **FE:** nhãn đỏ "Quá hạn". **BE:** đếm theo `created_at`. | Hạn mặc định 15 phút, chỉnh được. | v1 · P3 |
| DD-YC-04 | **Xem nội dung chat AI.** Là điều dưỡng, tôi muốn xem toàn bộ cuộc chat khi nhận yêu cầu từ trợ lý để khỏi hỏi lại bệnh nhân. | **FE:** panel hiển thị hội thoại (đã che dữ liệu nhạy cảm). | Chỉ hiện khi yêu cầu có nguồn là trợ lý AI. | v1 · P3 |
| DD-YC-05 | **Danh sách chờ.** Là điều dưỡng, tôi muốn khi có giờ trống (do hủy) hệ thống gợi ý bệnh nhân đang chờ để lấp giờ. | **FE:** gợi ý người chờ phù hợp, nút "Mời". **BE:** `GET /waitlist?doctor_id=`, `POST /waitlist/{id}/offer`. | Đề nghị đến bệnh nhân trong ≤ 1 phút sau khi giờ trống. | v1 · P3 |
| DD-YC-06 | **Đề nghị hết hạn.** Là điều dưỡng, tôi muốn đề nghị tự chuyển người kế tiếp khi hết hạn để giờ không bị bỏ trống. | **BE:** hết hạn sau X phút chuyển người kế tiếp theo thứ tự đăng ký. | Thứ tự theo thời điểm đăng ký chờ. | v1 · P3 |

### 2.9 Bảng điều khiển (DB)
*Màn hình mới: Bảng điều khiển ca làm việc.*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| DD-DB-01 | **Số liệu trong ngày.** Là điều dưỡng, tôi muốn thấy tổng quan hôm nay để nắm tình hình ngay đầu ca. | **FE:** thẻ: Lịch hôm nay, Đã check-in, Đang chờ, Đang khám, Xong, Vắng mặt. **BE:** `GET /staff/dashboard?date=&clinic_id=`. | Số khớp danh sách ở DD-TN-05. | v1 · P2 |
| DD-DB-02 | **Bảng theo bác sĩ.** Là điều dưỡng, tôi muốn biết từng bác sĩ đang khám ai, còn bao nhiêu người chờ, trễ bao lâu để điều phối. | **FE:** bảng: bác sĩ, người đang khám, số người chờ, độ trễ so với giờ hẹn. | Độ trễ = giờ bắt đầu thực tế trừ giờ hẹn. | v1 · P2 |
| DD-DB-03 | **Khối "Cần xử lý".** Là điều dưỡng, tôi muốn có danh sách việc cần làm ngay để không bỏ sót. | **FE:** bệnh nhân chờ quá ngưỡng (vàng/đỏ), lịch chờ xác nhận, yêu cầu gọi lại, bác sĩ báo nghỉ. | Xử lý xong thì dòng biến mất; ngưỡng cấu hình được (mặc định 30 phút). | v1 · P2 |
| DD-DB-04 | **Cập nhật thời gian thực.** Là điều dưỡng, tôi muốn số liệu tự đổi khi có thay đổi để khỏi tải lại. | **BE:** kênh `clinic:{id}` đẩy `appointment.*`, `queue.*`; cache 15–30 giây cho số tổng hợp. | Bệnh nhân vừa check-in xuất hiện ≤ 3 giây. | v1 · P2 |
| DD-DB-05 | **Thẻ bấm được.** Là điều dưỡng, tôi muốn bấm thẻ để đi tới danh sách tương ứng đã lọc sẵn. | **FE:** bấm thẻ "Đang chờ" mở Hàng đợi, "Vắng mặt" mở danh sách đã lọc. | Mở đúng màn hình với bộ lọc đã áp dụng. | Mới · P2 |

### 2.10 Kết ca và báo cáo (KC)

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| DD-KC-01 | **Số liệu ca.** Là điều dưỡng, tôi muốn xem tổng kết ca làm để báo cáo và đối chiếu. | **FE:** màn hình "Kết ca": đã tiếp nhận, check-in, vắng mặt, tổng thu. **BE:** `GET /staff/shifts/{id}/summary`. | Số khớp dữ liệu gốc. | v1 · P2 |
| DD-KC-02 | **Việc dang dở và ghi chú bàn giao.** Là điều dưỡng, tôi muốn để lại ghi chú cho ca sau để họ nắm việc chưa xong. | **FE:** danh sách việc dang dở; ô ghi chú bàn giao. **BE:** `POST /staff/shifts/{id}/handover`. | Ca sau thấy ghi chú ngay khi đăng nhập. | v1 · P2 |
| DD-KC-03 | **Đối soát thu tiền theo ca.** Là điều dưỡng, tôi muốn đối chiếu tiền mặt và chuyển khoản/ví của ca để biết có lệch không. | **FE:** bảng theo phương thức, chênh lệch, danh sách ca chưa thu được. **BE:** `GET /staff/shifts/{id}/reconciliation`. | Tổng thu của ca khớp giao dịch ghi nhận; Admin thấy ở AD-PY-05. | v1 · P2 |
| DD-KC-04 | **Chặn kết ca khi còn dang dở.** Là điều dưỡng, tôi muốn hệ thống nhắc khi còn giao dịch chưa chốt để không sót tiền. | **FE:** cảnh báo liệt kê giao dịch chưa chốt. | Không kết ca khi còn giao dịch chưa chốt. | v1 · P2 |
| DD-KC-05 | **Xuất báo cáo.** Là điều dưỡng, tôi muốn xuất PDF báo cáo ca/ngày để lưu giữ. | **FE:** nút "Xuất PDF". **BE:** `GET /staff/reports/daily?date=`. | Báo cáo xuất ra ngoài không chứa thông tin định danh bệnh nhân. | v1 · P3 |
| DD-KC-06 | **Ghi chú bàn giao hiện lúc đăng nhập.** Là điều dưỡng ca sau, tôi muốn thấy ghi chú ngay khi mở ca để tiếp tục công việc. | **FE:** hộp thoại ghi chú ca trước khi vào màn hình chính; nút "Đã đọc". | Chỉ hiện một lần cho mỗi ghi chú. | v1 · P2 |

### 2.11 Tài khoản và ca trực (AC)

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| DD-AC-01 | **Đăng nhập an toàn.** Là điều dưỡng, tôi muốn đăng nhập bằng tài khoản và mã xác thực để chỉ người được phép mới vào. | **FE:** form đăng nhập, ô mã OTP/MFA. **BE:** `POST /auth/login`, `POST /auth/mfa/verify`; khóa sau 5 lần sai; ghi nhật ký. | Sai quá 5 lần thì khóa tạm. | v1 · P1 |
| DD-AC-02 | **Mở ca và chọn quầy.** Là điều dưỡng, tôi muốn chọn quầy hoặc phòng làm việc khi bắt đầu ca để mọi thao tác ghi đúng nơi. | **FE:** chọn "Quầy tiếp đón / Phòng khám số X" sau khi đăng nhập; nhớ lựa chọn lần trước. **BE:** `POST /staff/shifts/start`, `…/end`. | Chưa mở ca thì không thao tác nghiệp vụ được. | v1 · P1 |
| DD-AC-03 | **Khóa màn hình.** Là điều dưỡng, tôi muốn khóa nhanh khi rời quầy để không lộ dữ liệu. | **FE:** phím tắt khóa; nhập lại mật khẩu để mở; tự khóa sau 5 phút không hoạt động. | Khóa xong không thấy dữ liệu bệnh nhân trên màn hình. | v1 · P2 |
| DD-AC-04 | **Hồ sơ cá nhân và đổi mật khẩu.** Là điều dưỡng, tôi muốn sửa thông tin và đổi mật khẩu của mình. | **FE:** menu tài khoản: hồ sơ, đổi mật khẩu, đăng xuất. **BE:** `PUT /staff/me`, `PUT /staff/me/password`. | Đổi mật khẩu cần mật khẩu cũ. | Mới · P2 |
| DD-AC-05 | **Đăng xuất và hết phiên.** Là điều dưỡng, tôi muốn đăng xuất an toàn và hệ thống tự đăng xuất khi không dùng. | **FE:** nút "Đăng xuất"; cảnh báo đếm ngược trước khi hết phiên. **BE:** `POST /auth/logout` hủy token. | Đăng xuất xong bấm Back không xem lại được. | Mới · P1 |
| DD-AC-06 | **Chuông thông báo.** Là điều dưỡng, tôi muốn nhận thông báo các việc cần chú ý để xử lý ngay. | **FE:** chuông có chấm đỏ; loại: bác sĩ báo nghỉ/trễ, yêu cầu gọi lại, chỉ số nguy cấp, lịch bị hủy. **BE:** `GET /staff/notifications`. | Bấm thông báo đi thẳng tới mục liên quan. | Mới · P2 |
| DD-AC-07 | **Nhật ký thao tác.** Là điều dưỡng, tôi muốn mọi thao tác của mình được ghi lại để khi có thắc mắc có căn cứ. | **BE:** gắn mọi thao tác với `shift_id` và `station_id`; ghi đăng nhập/đăng xuất. | Truy vết được về người và quầy. | v1 · P1 |

### 2.12 Khung chung (GN)

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| DD-GN-01 | **Thanh bên theo nhóm.** Là điều dưỡng, tôi muốn menu nhóm theo công việc để tìm nhanh. | **FE:** nhóm Tiếp đón, Hàng đợi & Khám, Hỗ trợ, Ca làm việc (mục 1.4); mục đang chọn tô sáng. | Điều dưỡng không thấy mục dành cho vai trò khác. | Mới · P1 |
| DD-GN-02 | **Phím tắt.** Là điều dưỡng, tôi muốn có phím tắt cho việc lặp lại để thao tác nhanh. | **FE:** `N` đặt lịch hộ, `/` tìm kiếm, `F2` ô quét QR, `Esc` đóng hộp thoại; bảng phím tắt mở bằng `?`. | Phím tắt không hoạt động khi đang gõ trong ô nhập. | v1 · P2 |
| DD-GN-03 | **Trạng thái dùng chung.** Là điều dưỡng, tôi muốn mọi màn hình báo tải, trống, lỗi giống nhau. | **FE:** khung xương khi tải; trống có hướng dẫn; thông báo nổi khi lưu; lỗi có nút "Thử lại". | Không màn hình nào để trống trắng khi lỗi. | Hiện có · P1 (một phần) |
| DD-GN-04 | **Máy tính bảng.** Là điều dưỡng, tôi muốn giao diện dùng tốt trên máy tính bảng khi đi lại. | **FE:** nút đủ lớn, bố cục co giãn; màn hình tiền khám nhập số bằng bàn phím số. | Dùng được trên màn hình 10 inch dọc và ngang. | v1 · P2 |
| DD-GN-05 | **Thiết bị ngoại vi.** Là điều dưỡng, tôi muốn dùng máy quét QR và máy in nhiệt để làm nhanh. | **FE:** máy quét tự điền vào ô quét; in phiếu số và biên lai qua máy in nhiệt. | Không cần cài thêm phần mềm riêng cho máy quét. | v1 · P2 |
| DD-GN-06 | **Chặn ngoài quyền.** Là phòng khám, chúng tôi muốn điều dưỡng không truy cập được dữ liệu ngoài quyền kể cả khi gọi API trực tiếp. | **BE:** kiểm tra vai trò `NURSE` mọi API; không trả chẩn đoán, đơn thuốc chi tiết. | Truy cập ngoài quyền trả `403` và ghi nhật ký. | v1 · P1 |
| DD-GN-07 | **Hộp xác nhận thao tác nhạy cảm.** Là điều dưỡng, tôi muốn được hỏi lại trước khi hủy, ghi đè hoặc hoàn tiền để tránh bấm nhầm. | **FE:** hộp thoại nêu rõ việc sắp làm và hệ quả; nút xác nhận khác màu nút hủy. | Thao tác nhạy cảm luôn có hộp xác nhận. | Mới · P1 |

---

## 3. Dữ liệu bổ sung (ngoài các bảng đã có)

| Bảng / trường | Dùng cho |
| --- | --- |
| `appointments` (thêm `checkin_note`, `checked_in_at`, `checked_in_by`, `checkin_method`, `created_via`, `approved_by`) | DD-TN, DD-DL |
| `appointment_status_history` | DD-TN-17, DD-DL-11 |
| `staff_shifts` (staff_id, station_id, started_at, ended_at, handover_note) | DD-AC, DD-KC |
| `queue_entries`, `queue_events` (queue_entry_id, action, before, after, reason, actor_id, created_at) | DD-HD, DD-TN-15 |
| `vitals` (visit_id, bp_sys, bp_dia, pulse, temp, resp_rate, spo2, weight, height, pain_score, measured_by, measured_at, revision) | DD-TK |
| `vital_ranges` (tuổi, chỉ số, ngưỡng bình thường, ngưỡng nguy cấp) | DD-TK-05, 06 |
| `payments` (thêm `method`, `amount_received`, `channel = COUNTER`), `payment_items` (khoản: khám, thuốc, dịch vụ), `receipts` | DD-TT |
| `discounts` (payment_id, amount, reason, approved_by) | DD-TT-11 |
| `confirmation_calls` (appointment_id, staff_id, outcome, note, called_at) | DD-DL-15 |
| `waitlist` (patient_id, doctor_id, preferred_from, preferred_to, status) | DD-YC-05 |
| `support_requests` (patient_id, source, status, assigned_to, created_at) | DD-YC |
| `displays`, `display_tokens`, `display_announcements` (station_id, message, starts_at, ends_at) | DD-MC |

## 4. Yêu cầu phi chức năng cho Điều dưỡng
- **Bảo mật và pháp lý:** MFA; quyền tối thiểu cần thiết (không xem chẩn đoán, đơn thuốc); nhật ký không sửa được cho mọi thao tác ghi đè; tuân thủ Nghị định 13/2023/NĐ-CP; màn hình chờ không hiển thị dữ liệu nhận dạng.
- **Hiệu năng và độ tin cậy:** thời gian thực ≤ 3 giây; hàng đợi dùng khóa/giao dịch để không cấp trùng số; có chế độ dự phòng khi mất mạng (lưu check-in tạm, đồng bộ lại).
- **Trải nghiệm:** phím tắt, ít thao tác chuột; hỗ trợ máy quét QR và máy in nhiệt; dùng tốt trên máy tính bảng; nút lớn, hộp xác nhận rõ ràng.
- **Nhất quán với tài liệu khác:** trạng thái lịch hẹn, ngưỡng và quy tắc lấy từ cấu hình ở `admin.md` (mục Cấu hình), nhãn trạng thái đồng bộ với `patient.md`.

## 5. Lộ trình phát triển đề xuất

| Giai đoạn | Nội dung | Story |
| --- | --- | --- |
| **1 – Hoàn thiện màn hình hiện có và vận hành lõi** | Hiển thị đủ ca, bộ lọc, nút đo sinh hiệu, cảnh báo check-in, tự cập nhật, chi tiết khoản phí, phương thức thanh toán, chặn thu sớm, tiền khám, hàng đợi, màn hình chờ cơ bản, đặt lịch hộ | DD-TN-01..09, 11..14, 18, 19, DD-TT-01..04, 07, 09, 14, 15, DD-TK-01..07, DD-HD-01, 03..05, 09, 12, DD-MC-01, 02, DD-DL-01..06, 10, 12, 13, DD-PS-01..03, DD-AC-01, 02, 05, 07, DD-GN-01, 03, 06, 07 |
| **2 – Hoàn thiện** | Vãng lai, lịch bị ảnh hưởng nâng cao, giảm giá, hoàn tiền, QR chuyển khoản, xem lại biên lai, bảng điều khiển, kết ca, cột thống kê | còn lại mức P2 |
| **3 – Mở rộng** | Hộp yêu cầu, danh sách chờ, in phiếu số, xuất báo cáo, xem ngày khác, so sánh sinh hiệu | mức P3 |

## 6. Câu hỏi cần chốt / đối chiếu với code
1. Các màn hình điều dưỡng khác (ngoài Tiếp đón & Thanh toán) hiện đã có chưa? Gửi ảnh chụp hoặc code để đổi nhãn "v1" thành "Hiện có".
2. Lịch `PENDING` (chưa duyệt) có được check-in không? Đề xuất: cảnh báo và chỉ cho "Duyệt và check-in" khi có quyền (DD-TN-11).
3. Có còn thu phí tại quầy trên hệ thống không (FR-09)? Nếu không, bỏ module Thanh toán và các thẻ doanh thu.
4. Nguồn giá cho **tiền thuốc** và dịch vụ phát sinh: Admin chỉ mới có danh mục dịch vụ và phí khám (AD-SV); cần chốt có danh mục giá thuốc hay không (DD-TT-07).
5. Bệnh nhân bỏ về giữa chừng: giữ nguyên trạng thái kèm ghi chú, hay có trạng thái riêng (DD-HD-13)?
6. Các ngưỡng đề xuất (check-in 60 phút, muộn 15 phút, gọi 3 lần cách 5 phút, chờ lâu 30 phút) có đúng thực tế không?
7. Điều dưỡng có được duyệt lịch `PENDING` không, hay chỉ Admin (DD-DL-16)?
8. **Nếu tách vai trò:** Lễ tân (hành chính) giữ module TN, TT, DL, MC, YC, KC; Điều dưỡng (lâm sàng) giữ TK, HD và phần điều phối. Các ngưỡng sinh hiệu và quy trình tiền khám cần bác sĩ hoặc quản lý chuyên môn xác nhận trước khi triển khai.
9. Phòng khám có máy quét QR, máy in nhiệt và màn hình lớn cho khu chờ chưa?
10. Endpoint thực tế trong `backend` có khác tên đề xuất ở trên không?

## Phụ lục A. Đối chiếu bản v1 với mã mới

| Bản v1 | Nay nằm ở |
| --- | --- |
| US-01 Đăng nhập theo ca làm việc | DD-AC-01..03, 07 |
| US-02 Nắm tình hình theo thời gian thực | DD-DB-01..05 |
| US-03 Đặt lịch qua điện thoại | DD-DL-01..07 |
| US-04 Đăng ký bệnh nhân đến trực tiếp | DD-DL-08, 09 |
| US-05 Quản lý và sửa lịch hẹn | DD-DL-10..15 |
| US-06 Check-in tại quầy | DD-TN-08, 12..16 |
| US-07 Điều phối hàng đợi | DD-HD-01..12 |
| US-08 Điều khiển màn hình chờ | DD-MC-01..07 |
| US-09 Đo và nhập sinh hiệu | DD-TK-01..09 |
| US-10 Hỗ trợ buổi khám từ xa | **Đã bỏ** (không khám từ xa) |
| US-11 Thu phí và xuất biên lai | DD-TT-01..16 |
| US-12 Xử lý khi bác sĩ nghỉ hoặc trễ | DD-PS-01..06 |
| US-13 Yêu cầu hỗ trợ và danh sách chờ | DD-YC-01..06 |
| US-14 Bàn giao ca và báo cáo | DD-KC-01..06 |
| (mới, từ code hiện có) Màn hình Tiếp đón & Thanh toán | DD-TN-01..11, 18..20, DD-TT-01..06 |

## Lịch sử thay đổi

| Phiên bản | Ngày | Người sửa | Nội dung |
| --- | --- | --- | --- |
| 1.0 | | | Bản user story Điều dưỡng đầu tiên (14 story, 8 epic) |
| 2.0 | 20/10/2026 | | Viết lại theo cấu trúc module; đối chiếu với code `NurseOverviewPage.tsx`; bỏ khám từ xa; thêm chi tiết khoản phí, phương thức thanh toán, hiển thị đủ ca, cảnh báo check-in, tự cập nhật; đồng bộ với admin.md và patient.md |