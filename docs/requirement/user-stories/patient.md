# MediCare – User Story giao diện Bệnh nhân

*Phiên bản: 2.0 · Cập nhật: 20/10/2026 · Phạm vi: phòng khám 4 chuyên khoa (Tim mạch, Thần kinh, Nhi, Nội), 4 bác sĩ chính và đội ngũ điều dưỡng, không khám từ xa*

---

## 1. Tổng quan

### 1.1 Mục đích, nguồn và phạm vi
Giao diện Bệnh nhân gồm **trang công khai** (xem thông tin, đặt lịch khi chưa đăng nhập) và **khu vực sau đăng nhập** (lịch hẹn, hồ sơ sức khỏe, hàng đợi, thông báo, tài khoản). Tài liệu mô tả từng chức năng từ tổng quan đến chi tiết từng nút, ô nhập và trạng thái, để làm căn cứ cập nhật giao diện. Mỗi chức năng là một user story có phần giao diện (FE), backend (BE) và tiêu chí nghiệm thu (AC).

**Nhân vật:**
- **Chị Lan, 32 tuổi,** đi làm giờ hành chính, đặt lịch chủ yếu bằng điện thoại vào buổi tối. Đặt cho cả con nhỏ (khám Nhi) và mẹ 68 tuổi.
- **Bác Hùng, 65 tuổi,** ít dùng công nghệ, cần đặt qua điện thoại cho nhân viên, chữ to, thao tác đơn giản.

**Nguồn:** bản v1 (16 user story theo epic), bản thiết kế trang chủ công khai (`README` trang chủ), và phạm vi đã chốt: 4 chuyên khoa, không khám từ xa, không hiển thị giá ở trang công khai.

**Khác với v1:**
- Bỏ khám từ xa: bỏ story "Đặt và tham gia khám video", bộ lọc "hình thức", bước chọn hình thức khám.
- Bỏ giá khỏi trang công khai: thẻ bác sĩ và bộ lọc không còn phí khám. Giá chỉ hiện ở bước thanh toán và biên lai, và chỉ khi chốt còn thu phí trên hệ thống (FR-09).
- Thêm module **Trang chủ công khai** (16 story) theo bản thiết kế.
- Sửa mã yêu cầu theo tài liệu hiện hành (đánh giá là FR-11, không còn FR-10 khám từ xa).
- Đổi "lễ tân" thành "điều dưỡng"; trạng thái lịch hẹn theo mã đang dùng trong code (`PENDING`…`PAID`).
- Bổ sung hồ sơ trẻ em, lịch bị phòng khám thay đổi, bước chờ duyệt, thông báo sự kiện, nhật ký truy cập hồ sơ của tôi, trạng thái dùng chung.

Endpoint ghi trong tài liệu là **đề xuất**, cần đối chiếu với `backend`. Phụ lục A đối chiếu story v1 với mã mới.

### 1.2 Hiện trạng giao diện
Chưa có ảnh chụp giao diện Bệnh nhân hiện tại, nên chưa thể xác định chức năng nào đã làm. Vì vậy mọi story lấy từ v1 được gắn nhãn **v1** (đặc tả cũ, cần đối chiếu với code), còn story thêm mới gắn nhãn **Mới**. Khi có ảnh chụp, đổi nhãn "v1" thành "Hiện có" cho phần đã làm.

### 1.3 Tính năng đề xuất thêm so với v1

| Ưu tiên | Tính năng | Vì sao hữu ích |
| --- | --- | --- |
| P1 | Trang chủ công khai có ô đặt lịch nhanh, 4 chuyên khoa, 4 bác sĩ kèm giờ trống gần nhất | Bệnh nhân thấy ngay có thể đặt lịch ở đâu |
| P1 | Đặt lịch khi chưa đăng nhập, chỉ đăng nhập ở bước xác nhận | Giảm số người bỏ giữa chừng |
| P1 | Trạng thái "Chờ xác nhận" và thông báo được duyệt/từ chối | Khớp với bước duyệt lịch của Admin |
| P1 | Thông báo và lựa chọn xử lý khi bác sĩ nghỉ hoặc đổi giờ | Bệnh nhân không phải gọi hỏi |
| P2 | Hồ sơ trẻ em (người giám hộ) | Nhi là một trong 4 chuyên khoa |
| P2 | Dòng thời gian trạng thái buổi khám (đã đặt → check-in → đo sinh hiệu → khám → hoàn tất) | Bệnh nhân biết mình đang ở bước nào |
| P2 | Chi tiết một lần khám (sinh hiệu, chẩn đoán, lời dặn) | Theo dõi sức khỏe |
| P2 | Chọn "bất kỳ bác sĩ" cùng chuyên khoa | Có giờ khám sớm hơn |
| P3 | Danh sách chờ "báo tôi khi có giờ trống" | Tận dụng giờ bị hủy |
| P3 | Nhật ký ai đã xem hồ sơ của tôi | Minh bạch dữ liệu y tế |
| P3 | Biểu đồ sinh hiệu theo thời gian, lưu bác sĩ yêu thích | Tiện lợi cho bệnh mạn tính |

### 1.4 Sơ đồ trang

```
CÔNG KHAI (chưa đăng nhập)
  Trang chủ                 (hero, ô đặt lịch nhanh, chuyên khoa, bác sĩ, điều dưỡng, quy trình, đánh giá, ...)
  Chuyên khoa               (4 chuyên khoa, trang chi tiết từng khoa)
  Bác sĩ                    (danh sách, trang chi tiết, lịch trống)
  Đặt lịch                  (4 bước, xem giờ trống không cần đăng nhập)
  Tin sức khỏe, Hỏi đáp, Liên hệ
  Đăng nhập / Đăng ký

SAU ĐĂNG NHẬP
  Trang chủ                 (thẻ "Lịch sắp tới")
  Đặt lịch
  Lịch hẹn của tôi          (sắp tới, đã khám, đã hủy; chi tiết, hủy, đổi)
  Hàng đợi của tôi          (check-in, số thứ tự)
  Hồ sơ sức khỏe            (lịch sử khám, đơn thuốc, kết quả)
  Thông báo
  Tài khoản                 (hồ sơ, người thân, quyền riêng tư, cài đặt, hỗ trợ)
  Trợ lý AI                 (bong bóng chat, nếu có làm)
```

Trên điện thoại dùng thanh tab dưới: Trang chủ · Đặt lịch · Lịch hẹn · Hồ sơ · Tài khoản.

Mã module: HP (Trang chủ công khai), AC (Tài khoản và hồ sơ), PV (Quyền riêng tư), SR (Tìm bác sĩ), BK (Đặt lịch), AI (Trợ lý AI), LH (Lịch hẹn của tôi), NT (Nhắc lịch và thông báo), CI (Check-in và hàng đợi), PY (Thanh toán), HS (Hồ sơ sức khỏe), RV (Đánh giá), SP (Hỗ trợ và trợ năng), GN (Khung chung).

### 1.5 Nguyên tắc chung và quy ước
- **Ưu tiên điện thoại.** Nút chính với tới được bằng ngón cái; chữ đủ lớn; độ tương phản đạt WCAG AA.
- **Xem giờ trống và bắt đầu đặt lịch không cần đăng nhập.** Chỉ yêu cầu đăng nhập hoặc đăng ký ở bước xác nhận.
- **Trạng thái luôn hiển thị bằng màu và chữ**, không chỉ bằng màu.
- **Dữ liệu y tế riêng tư.** Bệnh nhân chỉ thấy dữ liệu của mình và của người thân đã liên kết; nội dung thông báo không chứa thông tin bệnh lý.
- **Không hiển thị giá** ở trang chủ, danh sách và trang chi tiết bác sĩ.
- **Luôn có đường lui:** nút hotline và "Nhờ nhân viên gọi lại" ở mọi màn hình quan trọng.
- **Nhãn:** **v1** = có trong đặc tả cũ, cần đối chiếu code; **Mới** = đề xuất thêm. Ưu tiên P1 (làm trước), P2 (nên có), P3 (làm sau).
- **Giá trị đề xuất** (chủ phòng khám chốt, chỉnh được ở `admin.md` mục Cấu hình): giữ chỗ 10 phút, hủy/đổi trước 4 giờ, đổi tối đa 2 lần, tối đa 3 lịch chưa khám, check-in mở trước 60 phút.

**Nhãn trạng thái lịch hẹn hiển thị cho bệnh nhân:**

| Mã | Nhãn hiển thị | Ghi chú |
| --- | --- | --- |
| `HOLDING` | Đang giữ chỗ (còn mm:ss) | Tạm thời, trong lúc đặt lịch |
| `PENDING` | Chờ xác nhận | Chờ phòng khám duyệt (hoặc chờ thanh toán nếu có đặt cọc) |
| `CONFIRMED` | Đã xác nhận | Có mã đặt lịch và QR |
| `CHECKED_IN` | Đã check-in, đang chờ | Có số thứ tự |
| `TRIAGED` | Đã đo sinh hiệu, chờ gọi vào khám | |
| `IN_PROGRESS` | Đang khám | |
| `COMPLETED` | Đã khám xong | Nếu thu phí: "Chờ thanh toán" |
| `PAID` | Hoàn tất | |
| `CANCELLED` | Đã hủy | Kèm lý do |
| `NO_SHOW` | Vắng mặt | |

---

## 2. Chi tiết theo module

### 2.1 Trang chủ công khai (HP)
*Màn hình: Trang chủ trước khi đăng nhập. Dữ liệu bác sĩ lấy từ AD-HR-08, chuyên khoa từ AD-CK-04, nội dung từ AD-CT-01..04, đánh giá từ AD-RV.*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| BN-HP-01 | **Thanh điều hướng.** Là bệnh nhân, tôi muốn thấy menu, hotline và nút đặt lịch ở mọi lúc để không phải cuộn lên tìm. | **FE:** logo; menu Chuyên khoa, Đội ngũ, Quy trình, Tin sức khỏe, Liên hệ; hotline bấm để gọi; nút "Đăng nhập" (phụ) và "Đặt lịch khám" (nổi bật); cố định khi cuộn; trên điện thoại gom vào menu 3 gạch và có thanh "Đặt lịch" cố định ở đáy. | Bấm mục menu cuộn mượt đến đúng khối; hotline mở trình gọi điện trên điện thoại. | Mới · P1 |
| BN-HP-02 | **Khối đầu trang (hero).** Là bệnh nhân, tôi muốn hiểu ngay phòng khám giúp gì cho mình để quyết định đặt lịch. | **FE:** ảnh thật đội ngũ; tiêu đề nêu lợi ích; dòng phụ; hai nút "Đặt lịch ngay" và "Gọi tư vấn". | Hero hiển thị đủ trên màn hình điện thoại 360 px mà không phải cuộn ngang. | Mới · P1 |
| BN-HP-03 | **Ô đặt lịch nhanh.** Là bệnh nhân, tôi muốn chọn chuyên khoa, bác sĩ, ngày ngay trên trang chủ để xem giờ trống nhanh. | **FE:** 4 ô: Chuyên khoa → Bác sĩ → Ngày khám → nút "Xem giờ trống"; chọn chuyên khoa thì danh sách bác sĩ lọc theo. **BE:** `GET /doctors?specialty=`, `GET /doctors/{id}/slots?date=`. | Bấm "Xem giờ trống" mở bước chọn giờ (BN-BK-02) với lựa chọn đã điền sẵn; không cần đăng nhập. | Mới · P1 |
| BN-HP-04 | **Dải số liệu tin cậy.** Là bệnh nhân, tôi muốn thấy phòng khám có bao nhiêu chuyên khoa, bác sĩ, đánh giá để tin tưởng hơn. | **FE:** 4 ô: số chuyên khoa, số bác sĩ, đội ngũ điều dưỡng, điểm đánh giá. **BE:** `GET /public/stats`. | Số lấy từ dữ liệu thật; ô chưa có dữ liệu thì ẩn, không hiện số giả. | Mới · P2 |
| BN-HP-05 | **Khối 4 chuyên khoa.** Là bệnh nhân, tôi muốn biết mỗi chuyên khoa khám những gì để chọn đúng khoa. | **FE:** 4 thẻ lớn (Tim mạch, Thần kinh, Nhi, Nội): ảnh hoặc biểu tượng, tên, dòng "nên đi khám khi…", liên kết "Xem bác sĩ". **BE:** `GET /specialties`. | Thứ tự theo `sort_order` ở Admin; chuyên khoa bị ẩn không xuất hiện. | Mới · P1 |
| BN-HP-06 | **Khối 4 bác sĩ.** Là bệnh nhân, tôi muốn thấy bác sĩ và giờ trống gần nhất để đặt luôn. | **FE:** 4 thẻ: ảnh chân dung, họ tên, học vị, chuyên khoa, kinh nghiệm, điểm đánh giá, "Trống: 14:30 hôm nay", nút "Đặt lịch"; bấm thẻ mở trang chi tiết. **Không hiển thị phí khám.** **BE:** `GET /doctors?featured=true`. | Bác sĩ tắt "hiển thị website" thì không xuất hiện; "giờ trống gần nhất" khớp dữ liệu thật. | Mới · P1 |
| BN-HP-07 | **Khối đội ngũ điều dưỡng.** Là bệnh nhân, tôi muốn biết ai sẽ đón tiếp mình để yên tâm. | **FE:** ảnh nhóm tại quầy tiếp đón và 3 vai trò: đón tiếp và check-in, đo sinh hiệu, hỗ trợ đặt lịch qua điện thoại. **BE:** nội dung từ `site_settings`. | Ảnh thật, có mô tả `alt`. | Mới · P3 |
| BN-HP-08 | **Khối quy trình.** Là bệnh nhân, tôi muốn biết các bước đặt lịch và đi khám để chuẩn bị. | **FE:** 4 bước đánh số: Chọn bác sĩ → Chọn giờ (giữ chỗ 10 phút) → Nhận xác nhận và nhắc lịch → Đến khám, check-in bằng QR; kèm 2–3 ảnh chụp màn hình app. | Nội dung khớp quy tắc thực tế (giữ chỗ, check-in) ở phần Cấu hình. | Mới · P2 |
| BN-HP-09 | **Lý do chọn phòng khám.** Là bệnh nhân, tôi muốn thấy các ưu điểm cụ thể để so sánh với nơi khác. | **FE:** 4 ưu điểm kèm biểu tượng: số thứ tự điện tử, nhắc lịch tự động, xem đơn thuốc và kết quả trên app, bảo mật hồ sơ. | Không dùng lời cam kết kết quả điều trị ("khỏi hoàn toàn", "số 1"). | Mới · P3 |
| BN-HP-10 | **Đánh giá của bệnh nhân.** Là bệnh nhân, tôi muốn đọc nhận xét thật của người đã khám để yên tâm. | **FE:** carousel 3–5 nhận xét: tên viết tắt, số sao, ngày khám; vuốt hoặc bấm mũi tên. **BE:** `GET /public/reviews?limit=5`. | Chỉ hiện đánh giá đang hiển thị (chưa bị ẩn); ít hơn 3 đánh giá thì ẩn cả khối. | Mới · P2 |
| BN-HP-11 | **Cơ sở vật chất.** Là bệnh nhân, tôi muốn xem ảnh phòng khám trước khi đến. | **FE:** lưới 4–6 ảnh (sảnh tiếp đón, phòng khám, khu chờ, khu trẻ em); bấm để phóng to; tải lười. **BE:** `GET /public/media`. | Ảnh dạng WebP, có `alt`; không tải ảnh ngoài màn hình khi chưa cuộn tới. | Mới · P3 |
| BN-HP-12 | **Tin sức khỏe.** Là bệnh nhân, tôi muốn đọc cẩm nang về 4 chuyên khoa để hiểu bệnh của mình. | **FE:** 3 bài mới nhất có ảnh bìa; bấm vào mở bài đầy đủ; liên kết "Xem tất cả". **BE:** `GET /public/articles?limit=3`. | Chỉ bài đã xuất bản; có thẻ meta cho SEO. | Mới · P3 |
| BN-HP-13 | **Câu hỏi thường gặp.** Là bệnh nhân, tôi muốn có sẵn câu trả lời để khỏi phải gọi hỏi. | **FE:** danh sách thu gọn/mở rộng: hủy/đổi lịch, giấy tờ cần mang, check-in thế nào, hồ sơ có bảo mật không, người lớn tuổi có đặt hộ được không. **BE:** `GET /public/faqs`. | Thứ tự theo cấu hình Admin; mở một câu không đóng các câu khác. | Mới · P3 |
| BN-HP-14 | **Liên hệ và chân trang.** Là bệnh nhân, tôi muốn biết địa chỉ, giờ làm việc và cách liên hệ để đến đúng nơi. | **FE:** bản đồ nhúng, địa chỉ, giờ làm việc, hotline, Zalo, email, hướng dẫn gửi xe, ảnh mặt tiền; chân trang có giấy phép hoạt động, chính sách bảo mật, điều khoản, mạng xã hội. **BE:** `GET /public/site-settings`. | Bấm địa chỉ mở bản đồ chỉ đường; thông tin khớp cấu hình Admin (AD-CT-04). | Mới · P2 |
| BN-HP-15 | **Thành phần nổi.** Là bệnh nhân, tôi muốn gọi hoặc nhắn nhanh ở bất cứ đâu trên trang. | **FE:** nút gọi nhanh, nút Zalo, bong bóng chat trợ lý AI (nếu có làm); thanh "Đặt lịch" cố định ở đáy trên điện thoại. | Các nút không che nội dung và không chồng lên nhau trên màn hình nhỏ. | Mới · P2 |
| BN-HP-16 | **Tốc độ và SEO.** Là bệnh nhân, tôi muốn trang tải nhanh trên mạng điện thoại để không bỏ đi. | **FE:** ảnh WebP, tải lười, phông chữ tải trước; thẻ tiêu đề, mô tả, Open Graph cho từng trang; sơ đồ trang (sitemap). | Trang chủ tải dưới 3 giây trên 4G; trang bài viết chia sẻ lên Zalo/Facebook hiện đúng ảnh và tiêu đề. | Mới · P2 |

### 2.2 Tài khoản và hồ sơ cá nhân (AC)
*Màn hình: Đăng ký, Đăng nhập, Tài khoản*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| BN-AC-01 | **Đăng ký.** Là bệnh nhân, tôi muốn đăng ký bằng số điện thoại hoặc email để bắt đầu đặt lịch nhanh. | **FE:** form họ tên, SĐT/email, mật khẩu; báo lỗi ngay dưới từng ô; ẩn/hiện mật khẩu; thanh đo độ mạnh mật khẩu; hộp đồng ý xử lý dữ liệu cá nhân (không tích sẵn) kèm liên kết chính sách. **BE:** `POST /auth/register`; chống trùng SĐT/email; băm mật khẩu bằng bcrypt/argon2; lưu bản ghi đồng ý (thời điểm, phiên bản chính sách) theo Nghị định 13/2023/NĐ-CP. | Chưa đồng ý chính sách thì không đăng ký được; SĐT đã dùng báo rõ và gợi ý đăng nhập. | v1 · P1 |
| BN-AC-02 | **Xác thực OTP.** Là bệnh nhân, tôi muốn xác nhận số điện thoại bằng mã để tài khoản đúng chủ. | **FE:** 6 ô nhập số, tự chuyển ô; đếm ngược 60 giây; nút "Gửi lại mã". **BE:** `POST /auth/otp/verify`; giới hạn gửi 5 lần/giờ. | Mã hết hạn sau 5 phút; nhập sai nhiều lần thì khóa tạm. | v1 · P1 |
| BN-AC-03 | **Đăng nhập.** Là bệnh nhân, tôi muốn đăng nhập bằng SĐT/email và mật khẩu để vào tài khoản. | **FE:** form đăng nhập, ẩn/hiện mật khẩu, "Ghi nhớ đăng nhập", liên kết "Quên mật khẩu". **BE:** `POST /auth/login`, `POST /auth/refresh`; JWT + refresh token. | Sai mật khẩu quá 5 lần thì khóa tạm thời kèm thông báo; đăng nhập xong quay về đúng trang/bước đang dở. | v1 · P1 |
| BN-AC-04 | **Đăng nhập Google/Zalo.** Là bệnh nhân, tôi muốn đăng nhập bằng tài khoản có sẵn để khỏi nhớ mật khẩu. | **FE:** nút "Tiếp tục với Google", "Tiếp tục với Zalo". **BE:** `POST /auth/social`; yêu cầu bổ sung SĐT nếu chưa có. | Tài khoản trùng email được liên kết, không tạo hai tài khoản. | v1 · P2 |
| BN-AC-05 | **Quên và đặt lại mật khẩu.** Là bệnh nhân, tôi muốn lấy lại mật khẩu khi quên để vào lại tài khoản. | **FE:** nhập SĐT/email → nhận mã/link → nhập mật khẩu mới (có thanh đo độ mạnh). **BE:** `POST /auth/forgot-password`; link dùng một lần, có hạn. | Đặt lại xong các phiên cũ bị đăng xuất. | v1 · P1 |
| BN-AC-06 | **Đổi mật khẩu.** Là bệnh nhân, tôi muốn đổi mật khẩu khi cần để giữ tài khoản an toàn. | **FE:** mục "Đổi mật khẩu" trong Tài khoản: mật khẩu cũ, mới, nhập lại. **BE:** `PUT /patients/me/password`. | Phải nhập đúng mật khẩu cũ; đổi xong các thiết bị khác bị đăng xuất. | Mới · P2 |
| BN-AC-07 | **Hồ sơ cá nhân.** Là bệnh nhân, tôi muốn xem và sửa thông tin của mình để dữ liệu luôn đúng. | **FE:** trang hồ sơ: họ tên, ngày sinh, giới tính, CCCD, địa chỉ, SĐT, email, số BHYT (nếu có), ảnh đại diện (tải lên, cắt khung). **BE:** `GET/PUT /patients/me`; kiểm tra định dạng CCCD/SĐT; mã hóa CCCD; ghi nhật ký khi sửa. | Đổi SĐT/email cần xác nhận lại bằng mã; CCCD hiển thị dạng che bớt. | v1 · P1 |
| BN-AC-08 | **Thông tin sức khỏe ban đầu.** Là bệnh nhân, tôi muốn khai nhóm máu, dị ứng, bệnh mạn tính, thuốc đang dùng để bác sĩ khám an toàn hơn. | **FE:** mục "Sức khỏe của tôi": nhóm máu, dị ứng (nổi bật), bệnh mạn tính, thuốc đang dùng; có nút "Không có". **BE:** `PUT /patients/me/health`; mã hóa dữ liệu y tế. | Dị ứng và bệnh nền hiện cho bác sĩ và điều dưỡng khi khám. | v1 · P1 |
| BN-AC-09 | **Quản lý người thân.** Là bệnh nhân, tôi muốn lưu thông tin người thân để đặt hộ mà không nhập lại. | **FE:** mục "Người thân": danh sách, Thêm/Sửa/Ẩn (họ tên, quan hệ, ngày sinh, giới tính, SĐT, dị ứng); bộ chọn "Đặt cho ai?" khi đặt lịch. **BE:** `GET/POST/PUT/DELETE /patients/me/dependents`; mỗi hồ sơ phụ gắn với tài khoản chính. | Ẩn người thân không làm mất lịch sử khám cũ. | v1 · P1 |
| BN-AC-10 | **Hồ sơ trẻ em.** Là phụ huynh, tôi muốn tạo hồ sơ cho con nhỏ để đặt lịch khám Nhi. | **FE:** khi thêm người thân dưới 16 tuổi: bắt buộc ngày sinh, cân nặng, ghi rõ người giám hộ (là chính tôi); nhắc "Người giám hộ đi cùng khi khám". **BE:** `guardian_id` trên hồ sơ phụ. | Chỉ người giám hộ xem và đặt lịch cho hồ sơ này; tuổi tính tự động. | Mới · P2 |
| BN-AC-11 | **Đăng xuất.** Là bệnh nhân, tôi muốn đăng xuất khi dùng máy chung để không lộ dữ liệu. | **FE:** nút "Đăng xuất" cuối trang Tài khoản. **BE:** `POST /auth/logout` hủy token. | Đăng xuất xong bấm Back không xem lại được dữ liệu cũ. | Mới · P1 |

### 2.3 Quyền riêng tư (PV)
*Màn hình: Tài khoản → Quyền riêng tư*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| BN-PV-01 | **Xem và rút đồng ý.** Là bệnh nhân, tôi muốn xem những gì tôi đã đồng ý và rút lại khi muốn để kiểm soát dữ liệu. | **FE:** danh sách đồng ý (loại, ngày, phiên bản chính sách), nút "Rút đồng ý" kèm giải thích chức năng bị ảnh hưởng. **BE:** `GET/PATCH /patients/me/consents`. | Mọi thay đổi đồng ý được ghi lại. | v1 · P2 |
| BN-PV-02 | **Yêu cầu xuất dữ liệu.** Là bệnh nhân, tôi muốn tải toàn bộ dữ liệu của mình để lưu giữ. | **FE:** nút "Yêu cầu xuất dữ liệu", trạng thái xử lý, nút tải khi xong. **BE:** `POST /patients/me/data-export`; chạy nền, link tải có hạn, được Admin xử lý theo AD-PT-15. | Yêu cầu có phản hồi trong thời gian quy định. | v1 · P2 |
| BN-PV-03 | **Yêu cầu xóa tài khoản.** Là bệnh nhân, tôi muốn xóa tài khoản khi không dùng nữa. | **FE:** nút "Yêu cầu xóa tài khoản", cảnh báo hậu quả (lịch sắp tới bị hủy, bệnh án bắt buộc lưu không xóa được), xác nhận hai bước. **BE:** `POST /patients/me/delete-request`; bệnh án thuộc diện bắt buộc lưu thì ẩn danh hoặc khóa thay vì xóa hẳn (cần rà soát pháp lý). | Bệnh nhân nhận thông báo kết quả; lịch sắp tới được xử lý trước khi xóa. | v1 · P2 |
| BN-PV-04 | **Thiết bị đăng nhập.** Là bệnh nhân, tôi muốn xem thiết bị đang đăng nhập và đăng xuất từ xa để chặn truy cập lạ. | **FE:** danh sách thiết bị (tên, thời gian, địa điểm gần đúng); nút "Đăng xuất thiết bị này", "Đăng xuất mọi thiết bị". **BE:** `GET /patients/me/sessions`, `DELETE …/{id}`. | Phiên bị thu hồi mất hiệu lực ngay. | v1 · P3 |
| BN-PV-05 | **Đồng ý lại khi chính sách đổi.** Là bệnh nhân, tôi muốn được báo khi chính sách quyền riêng tư thay đổi để biết mình đồng ý điều gì. | **FE:** hộp thoại hiển thị phần thay đổi, nút "Đồng ý" / "Xem sau". **BE:** so phiên bản trong `consents` với phiên bản mới nhất (AD-PT-16). | Chưa đồng ý bản mới thì không dùng được chức năng cần dữ liệu y tế mới. | Mới · P3 |
| BN-PV-06 | **Ai đã xem hồ sơ của tôi.** Là bệnh nhân, tôi muốn biết ai đã mở hồ sơ của mình để yên tâm. | **FE:** mục "Nhật ký truy cập hồ sơ": ngày giờ, vai trò (Bác sĩ, Điều dưỡng), tên bác sĩ nếu là bác sĩ điều trị. **BE:** `GET /patients/me/access-logs` từ `emr_access_logs`. | Chỉ hiện các lượt xem liên quan hồ sơ của chính bệnh nhân. | Mới · P3 |

### 2.4 Tìm bác sĩ và chuyên khoa (SR)
*Màn hình: Chuyên khoa, Danh sách bác sĩ, Chi tiết bác sĩ*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| BN-SR-01 | **Danh sách và trang chuyên khoa.** Là bệnh nhân, tôi muốn xem 4 chuyên khoa và chi tiết từng khoa để chọn đúng nơi khám. | **FE:** lưới 4 thẻ; trang từng khoa: mô tả, "nên đi khám khi…", danh sách bác sĩ của khoa. **BE:** `GET /specialties`, `GET /specialties/{id}`. | Chuyên khoa bị ẩn không còn xuất hiện. | v1 · P1 |
| BN-SR-02 | **Tìm kiếm.** Là bệnh nhân, tôi muốn gõ tên bác sĩ, chuyên khoa hoặc triệu chứng để tìm nhanh. | **FE:** ô tìm kiếm lớn, gợi ý khi gõ (sau 300 ms), nút xóa nhanh. **BE:** `GET /search?q=`, tìm không phân biệt dấu tiếng Việt. | Gõ "tim" ra chuyên khoa Tim mạch; gõ "nguyen" ra "Nguyễn". | v1 · P1 |
| BN-SR-03 | **Danh sách bác sĩ.** Là bệnh nhân, tôi muốn xem các bác sĩ dạng thẻ và sắp xếp để chọn người phù hợp. | **FE:** thẻ gồm ảnh, tên, chuyên khoa, kinh nghiệm, điểm đánh giá, giờ trống gần nhất; sắp xếp theo giờ trống gần nhất, đánh giá, kinh nghiệm. **Không có phí khám.** **BE:** `GET /doctors?q=&specialty=&sort=&page=`; chỉ bác sĩ đang hoạt động và bật hiển thị. | Danh sách tải dưới 2 giây; giờ trống khớp dữ liệu thật. | v1 · P1 |
| BN-SR-04 | **Bộ lọc.** Là bệnh nhân, tôi muốn lọc theo chuyên khoa, ngày, giới tính, đánh giá để thu hẹp lựa chọn. | **FE:** các ô lọc, nút "Xóa lọc"; số kết quả hiện ngay. **BE:** thêm tham số `date`, `gender`, `min_rating`. (Bỏ lọc "hình thức" và "mức phí" của v1.) | Lọc kết hợp được nhiều điều kiện cùng lúc. | v1 · P2 |
| BN-SR-05 | **Trang chi tiết bác sĩ.** Là bệnh nhân, tôi muốn xem đầy đủ thông tin bác sĩ trước khi đặt để yên tâm. | **FE:** ảnh, họ tên, học vị, chuyên khoa, kinh nghiệm, giới thiệu, quá trình công tác, đánh giá; lịch trống 7 ngày tới; nút "Đặt lịch" cố định. **BE:** `GET /doctors/{id}`. | Nút Đặt lịch mở đúng bước chọn giờ của bác sĩ đó. | v1 · P1 |
| BN-SR-06 | **Lịch trống theo tuần.** Là bệnh nhân, tôi muốn thấy các ô giờ còn trống của bác sĩ để chọn ngay. | **FE:** lịch tuần; giờ đã hết/đã khóa/nghỉ hiển thị mờ, không chọn được; chuyển tuần trước/sau. **BE:** `GET /doctors/{id}/slots?from=&to=`; cache Redis. | Giờ bác sĩ nghỉ hoặc phòng khám đóng cửa không có ô chọn. | v1 · P1 |
| BN-SR-07 | **Trạng thái rỗng, tải, lỗi.** Là bệnh nhân, tôi muốn được gợi ý khi không có kết quả để không bị bế tắc. | **FE:** khung xương khi tải; không có giờ trống thì hiện "Bác sĩ khác cùng chuyên khoa" và "Ngày có giờ gần nhất"; lỗi mạng có nút "Thử lại". | Không màn hình nào để trống trắng khi lỗi. | v1 · P1 |
| BN-SR-08 | **Đánh giá của bác sĩ.** Là bệnh nhân, tôi muốn đọc đánh giá của người đã khám để tham khảo. | **FE:** điểm trung bình, danh sách nhận xét có phân trang, lọc theo số sao. **BE:** `GET /doctors/{id}/reviews`. | Chỉ hiện đánh giá không bị ẩn. | v1 · P2 |
| BN-SR-09 | **Lưu bác sĩ và chia sẻ.** Là bệnh nhân, tôi muốn lưu bác sĩ hay khám và gửi liên kết cho người nhà để lần sau đặt nhanh. | **FE:** biểu tượng trái tim "Yêu thích"; nút "Chia sẻ" (sao chép liên kết, Zalo). **BE:** `POST/DELETE /patients/me/favorite-doctors/{id}`. | Danh sách yêu thích hiện ở đầu bước chọn bác sĩ khi đặt lịch. | Mới · P3 |

### 2.5 Đặt lịch (BK)
*Màn hình: Đặt lịch (4 bước). Xem giờ trống không cần đăng nhập; đăng nhập ở bước xác nhận.*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| BN-BK-01 | **Bước 1: chọn chuyên khoa và bác sĩ.** Là bệnh nhân, tôi muốn chọn chuyên khoa rồi chọn bác sĩ, hoặc để hệ thống chọn bác sĩ có giờ sớm nhất, để đặt nhanh. | **FE:** thanh tiến trình 4 bước; chọn chuyên khoa; chọn bác sĩ hoặc "Bất kỳ bác sĩ (có giờ sớm nhất)". **BE:** `GET /doctors?specialty=`, `GET /specialties/{id}/earliest-slot`. | Chọn "Bất kỳ bác sĩ" thì hiển thị bác sĩ được gán trước khi xác nhận. | v1 · P1 (Bất kỳ bác sĩ: Mới · P2) |
| BN-BK-02 | **Bước 2: chọn ngày và giờ.** Là bệnh nhân, tôi muốn chọn khung giờ trống trên lịch để có chỗ khám phù hợp. | **FE:** lịch tuần, nhóm giờ sáng/chiều; giờ đã hết mờ đi; nút "Giờ gần nhất". **BE:** `GET /doctors/{id}/slots?date=`. | Chọn giờ xong nút "Tiếp tục" mới sáng lên. | v1 · P1 |
| BN-BK-03 | **Giữ chỗ.** Là bệnh nhân, tôi muốn giờ đã chọn được giữ cho mình để không bị người khác đặt mất. | **FE:** đồng hồ đếm ngược trên đầu các bước sau (mặc định 10 phút). **BE:** `POST /appointments/hold` (khóa Redis, trạng thái `HOLDING`). | Hết giờ giữ chỗ thì báo rõ, trả giờ lại và cho chọn lại; làm mới trang vẫn thấy đồng hồ đúng. | v1 · P1 |
| BN-BK-04 | **Chống đặt trùng.** Là bệnh nhân, tôi muốn được báo ngay khi giờ vừa bị người khác đặt để chọn lại. | **FE:** hộp thoại "Giờ này vừa được đặt" kèm 3 giờ gần nhất của cùng bác sĩ hoặc cùng chuyên khoa. **BE:** khóa giao dịch; trả `409`. | Hai người cùng chọn một giờ thì chỉ một người giữ được. | v1 · P1 |
| BN-BK-05 | **Bước 3: thông tin khám.** Là bệnh nhân, tôi muốn cho biết đặt cho ai và lý do khám để bác sĩ chuẩn bị. | **FE:** chọn "Đặt cho ai?" (bản thân, người thân, thêm người mới ngay tại đây); lý do/triệu chứng (ô nhập tự do và chọn nhanh theo chuyên khoa); đính kèm tối đa 3 ảnh/kết quả cũ (không bắt buộc). **BE:** `POST /appointments/{id}/attachments`. | Lý do khám là bắt buộc; ảnh sai định dạng hoặc quá nặng bị từ chối rõ ràng. | v1 · P1 |
| BN-BK-06 | **Đăng nhập ở bước xác nhận.** Là bệnh nhân chưa có tài khoản, tôi muốn đăng nhập hoặc đăng ký ngay lúc xác nhận để không mất lựa chọn đã làm. | **FE:** cửa sổ đăng nhập/đăng ký hiện ra khi bấm "Xác nhận"; sau khi xong quay lại đúng bước với dữ liệu đã nhập. | Không mất giờ đã giữ trong lúc đăng ký (đồng hồ vẫn chạy, đủ thời gian cho OTP). | Mới · P1 |
| BN-BK-07 | **Bước 4: xem lại và xác nhận.** Là bệnh nhân, tôi muốn xem lại toàn bộ thông tin trước khi xác nhận để tránh nhầm. | **FE:** tóm tắt (bác sĩ, ngày, giờ, địa điểm, người khám, lý do); tóm tắt quy định hủy/đổi; nút "Xác nhận đặt lịch"; (nếu có thu cọc thì có bước thanh toán, xem BN-PY). **BE:** `POST /appointments`; phát sự kiện `appointment.created`. | Bấm xác nhận hai lần không tạo hai lịch. | v1 · P1 |
| BN-BK-08 | **Quy tắc đặt lịch.** Là bệnh nhân, tôi muốn được báo rõ lý do khi không đặt được để biết cách xử lý. | **FE:** thông báo cụ thể: "Bạn đã có lịch khác lúc này", "Bạn đã đủ 3 lịch chưa khám" kèm liên kết đến lịch cũ. **BE:** kiểm tra trùng giờ, giới hạn lịch chưa khám. | Thông báo luôn kèm hướng xử lý (hủy lịch cũ hoặc chọn giờ khác). | v1 · P1 |
| BN-BK-09 | **Màn hình thành công.** Là bệnh nhân, tôi muốn có mã đặt lịch và QR ngay sau khi đặt để dùng khi đến khám. | **FE:** mã đặt lịch, mã QR, tóm tắt, dặn dò (giấy tờ cần mang, đến sớm bao lâu), nút "Thêm vào lịch điện thoại", "Chỉ đường", "Xem lịch hẹn". **BE:** sinh mã và QR; gửi xác nhận qua SMS/Email/App ≤ 1 phút. | Tệp lịch (.ics) có đúng giờ và địa điểm; QR quét được ở quầy. | v1 · P1 |
| BN-BK-10 | **Lịch chờ duyệt.** Là bệnh nhân, tôi muốn biết lịch của mình đang chờ phòng khám xác nhận để không lo lắng. | **FE:** nhãn "Chờ xác nhận" kèm dòng "Phòng khám sẽ xác nhận trong vòng …"; thông báo khi được duyệt. **BE:** trạng thái `PENDING` theo cấu hình tự động duyệt (AD-CF-04); xử lý ở AD-PT-04. | Khi được duyệt chuyển `CONFIRMED` và nhận thông báo trong ≤ 1 phút. | Mới · P1 |
| BN-BK-11 | **Lịch bị từ chối.** Là bệnh nhân, tôi muốn biết lý do khi lịch bị từ chối và được gợi ý giờ khác để đặt lại nhanh. | **FE:** thông báo có lý do và nút "Chọn giờ khác" mở lại bước 2 với bác sĩ cũ. **BE:** `reject_reason` từ AD-PT-04. | Giờ cũ được trả lại ngay. | Mới · P2 |
| BN-BK-12 | **Mất kết nối khi đang đặt.** Là bệnh nhân, tôi muốn dữ liệu đã nhập không mất khi mạng chập chờn để không phải làm lại. | **FE:** lưu nháp cục bộ; banner "Mất kết nối"; khi có mạng tự gửi lại. | Vào lại vẫn thấy lựa chọn cũ và đồng hồ giữ chỗ còn lại. | Mới · P2 |
| BN-BK-13 | **Đặt tái khám.** Là bệnh nhân, tôi muốn đặt tái khám từ một lần khám cũ để khỏi chọn lại từ đầu. | **FE:** nút "Đặt tái khám" ở chi tiết lần khám; điền sẵn bác sĩ và người khám; gợi ý ngày theo lời dặn của bác sĩ. **BE:** `POST /appointments` với `type = FOLLOW_UP`, `parent_visit_id`. | Lịch tái khám bác sĩ đã đặt sẵn (nếu có) hiển thị ở đầu danh sách. | v1 · P2 |
| BN-BK-14 | **Danh sách chờ giờ trống.** Là bệnh nhân, tôi muốn được báo khi có người hủy để lấy giờ sớm hơn. | **FE:** nút "Báo tôi khi có giờ trống" ở ngày đã hết giờ; chọn khoảng ngày mong muốn. **BE:** bảng `waitlist`; khi có giờ trả về thì gửi đề nghị, hết hạn sau X phút thì chuyển người kế tiếp. | Bệnh nhân nhận thông báo kèm nút "Đặt ngay". | Mới · P3 |

### 2.6 Trợ lý AI (AI)
*Màn hình: bong bóng chat và màn hình chat. Giai đoạn 3, chỉ làm nếu chốt có trợ lý AI. Cấu hình ở AD-AI.*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| BN-AI-01 | **Mở khung chat.** Là bệnh nhân, tôi muốn mở chat ở mọi trang để hỏi nhanh. | **FE:** bong bóng chat nổi và màn hình chat đầy đủ; câu hỏi gợi ý nhanh ("Đặt lịch khám Nhi", "Giờ làm việc"); chỉ báo "đang trả lời". **BE:** `POST /ai/conversations`. | Luôn hiện dòng: "Trợ lý chỉ gợi ý chuyên khoa, không thay thế chẩn đoán của bác sĩ". | v1 · P3 |
| BN-AI-02 | **Nhập bằng chữ và giọng nói.** Là bệnh nhân, tôi muốn nói thay vì gõ để nhanh hơn, nhất là khi tay bận. | **FE:** ô nhập văn bản và nút micro; hiện chữ nhận dạng được để sửa trước khi gửi. **BE:** `POST /ai/conversations/{id}/messages` (streaming). | Không gửi âm thanh lên máy chủ nếu bệnh nhân chưa đồng ý. | v1 · P3 |
| BN-AI-03 | **Cảnh báo khẩn cấp.** Là bệnh nhân, tôi muốn được hướng dẫn gọi cấp cứu ngay khi mô tả dấu hiệu nguy hiểm để được an toàn. | **FE:** khung đỏ "Hãy gọi cấp cứu 115" kèm nút gọi; chat dừng đặt lịch. **BE:** nhận diện từ khóa (đau ngực, khó thở, nghi đột quỵ…) trước mọi xử lý khác. | Trường hợp khẩn cấp không bao giờ tiếp tục sang đặt lịch. | v1 · P3 |
| BN-AI-04 | **Gợi ý chuyên khoa.** Là bệnh nhân, tôi muốn được gợi ý chuyên khoa từ mô tả của mình để biết nên khám ở đâu. | **FE:** câu trả lời nêu chuyên khoa gợi ý (trong 4 chuyên khoa) và lý do ngắn, kèm lời nhắc không chẩn đoán. **BE:** ánh xạ triệu chứng → chuyên khoa (AD-AI-03). | Không bao giờ đưa chẩn đoán hay kê thuốc. | v1 · P3 |
| BN-AI-05 | **Thẻ gợi ý bác sĩ và giờ.** Là bệnh nhân, tôi muốn chọn bác sĩ và giờ ngay trong chat để đặt nhanh. | **FE:** thẻ (bác sĩ, giờ trống) có nút "Đặt lịch này" dẫn đến bước xác nhận (BN-BK-07). **BE:** gọi cùng API đặt lịch như giao diện thường. | Đặt qua chat cho kết quả giống hệt đặt trên giao diện thường (có giữ chỗ, có quy tắc). | v1 · P3 |
| BN-AI-06 | **Hỏi thông tin cố định.** Là bệnh nhân, tôi muốn hỏi giờ làm việc, địa chỉ, giấy tờ cần mang để khỏi gọi điện. | **FE:** câu trả lời ngắn, có nút "Gọi phòng khám". **BE:** kịch bản cố định (AD-AI-02), không tự sinh nội dung khi đã có câu trả lời chuẩn. | Không trả lời về giá nếu phòng khám chưa công bố. | Mới · P3 |
| BN-AI-07 | **Hủy/đổi lịch qua chat.** Là bệnh nhân, tôi muốn nhờ trợ lý hủy hoặc đổi lịch để làm nhanh. | **FE:** trợ lý hỏi lại để xác nhận ("Bạn muốn hủy lịch 9:00 ngày 22/10?") trước khi thực hiện. **BE:** gọi API hủy/đổi như BN-LH-04, 05. | Không hủy khi chưa có xác nhận rõ ràng; quá hạn thì báo như ở giao diện thường. | v1 · P3 |
| BN-AI-08 | **Chuyển cho nhân viên.** Là bệnh nhân, tôi muốn gặp người thật bất cứ lúc nào để được hỗ trợ. | **FE:** nút "Chuyển cho nhân viên" luôn hiện; ngoài giờ làm việc thì hiện giờ nhân viên có mặt và hotline. **BE:** chuyển hội thoại kèm đầy đủ ngữ cảnh cho điều dưỡng (hộp yêu cầu). | Nhân viên thấy toàn bộ nội dung đã chat, bệnh nhân không phải kể lại. | v1 · P3 |
| BN-AI-09 | **Lịch sử và xóa hội thoại.** Là bệnh nhân, tôi muốn xem lại hoặc xóa nội dung đã chat để kiểm soát dữ liệu. | **FE:** danh sách hội thoại cũ, nút "Xóa". **BE:** lưu có che dữ liệu nhạy cảm, đặt thời hạn lưu. | Xóa xong không còn hiển thị cho bệnh nhân. | Mới · P3 |
| BN-AI-10 | **Khi trợ lý tạm dừng.** Là bệnh nhân, tôi muốn được hướng dẫn khi trợ lý không hoạt động để vẫn đặt được lịch. | **FE:** thông báo "Trợ lý đang bảo trì" kèm nút "Đặt lịch thường" và hotline. **BE:** đọc trạng thái từ cấu hình (AD-AI-06). | Bong bóng chat không biến mất đột ngột mà báo lý do. | Mới · P3 |

### 2.7 Lịch hẹn của tôi (LH)
*Màn hình: Lịch hẹn của tôi, Chi tiết lịch hẹn*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| BN-LH-01 | **Danh sách lịch hẹn.** Là bệnh nhân, tôi muốn thấy mọi lịch khám của mình để không quên. | **FE:** tab "Sắp tới / Đã khám / Đã hủy"; thẻ lịch (bác sĩ, ngày giờ, địa điểm, nhãn trạng thái màu và chữ). **BE:** `GET /appointments/me?status=&page=`. | Sắp xếp theo thời gian gần nhất; chỉ thấy lịch của mình và người thân. | v1 · P1 |
| BN-LH-02 | **Lọc và tìm.** Là bệnh nhân, tôi muốn lọc theo người thân để xem lịch của từng người. | **FE:** bộ chọn "Tất cả / Tôi / từng người thân"; tìm theo tên bác sĩ hoặc mã lịch. **BE:** thêm tham số `patient_id`. | Không xem được lịch của người khác (403). | v1 · P2 |
| BN-LH-03 | **Chi tiết lịch hẹn.** Là bệnh nhân, tôi muốn xem đầy đủ một lịch để chuẩn bị đúng. | **FE:** mã đặt lịch, QR, bác sĩ, ngày giờ, địa chỉ kèm bản đồ/chỉ đường, dặn dò (giấy tờ, nhịn ăn nếu có), lý do khám, nhãn trạng thái; nút Hủy, Đổi lịch. **BE:** `GET /appointments/{id}`. | Mã QR phóng to được để quét ở quầy. | v1 · P1 |
| BN-LH-04 | **Hủy lịch.** Là bệnh nhân, tôi muốn tự hủy lịch khi không đến được để giờ đó cho người khác. | **FE:** nút "Hủy lịch" mở hộp xác nhận: chính sách hoàn cọc (nếu có), chọn lý do; quá hạn thì nút bị vô hiệu kèm giải thích và hotline. **BE:** `POST /appointments/{id}/cancel`; kiểm tra thời hạn (mặc định trước 4 giờ). | Hủy trong hạn: trạng thái `CANCELLED`, giờ mở lại ngay; quá hạn: API trả `422` kèm lý do. | v1 · P1 |
| BN-LH-05 | **Đổi lịch.** Là bệnh nhân, tôi muốn dời lịch sang giờ khác để không phải hủy rồi đặt lại. | **FE:** nút "Đổi lịch" mở bộ chọn giờ (giữ bác sĩ, gợi ý bác sĩ khác cùng chuyên khoa); hiển thị số lần đổi còn lại. **BE:** `POST /appointments/{id}/reschedule`; giữ chỗ giờ mới trước, giờ cũ chỉ trả khi giờ mới đã xác nhận; tối đa 2 lần. | Không mất lịch cũ nếu đổi thất bại; bác sĩ nhận thông báo. | v1 · P1 |
| BN-LH-06 | **Thêm vào lịch và chia sẻ.** Là bệnh nhân, tôi muốn thêm lịch khám vào điện thoại và gửi cho người nhà để cùng nhớ. | **FE:** nút "Thêm vào lịch" (.ics), "Chia sẻ" (Zalo, sao chép nội dung). | Nội dung chia sẻ không chứa thông tin bệnh lý. | v1 · P2 |
| BN-LH-07 | **Dòng thời gian buổi khám.** Là bệnh nhân, tôi muốn biết mình đang ở bước nào trong buổi khám để yên tâm chờ. | **FE:** thanh tiến trình: Đã xác nhận → Check-in → Đo sinh hiệu → Đang khám → Hoàn tất; bước hiện tại tô sáng. **BE:** từ `appointment_status_history`. | Chuyển trạng thái trong ≤ 3 giây khi điều dưỡng/bác sĩ thao tác. | Mới · P2 |
| BN-LH-08 | **Lịch đã khám.** Là bệnh nhân, tôi muốn từ lịch đã khám xem kết quả, đặt tái khám và đánh giá để tiện theo dõi. | **FE:** thẻ lịch đã khám có nút "Xem kết quả", "Đặt tái khám", "Đánh giá". | Nút hiển thị đúng theo trạng thái (chưa đánh giá thì hiện nút đánh giá). | v1 · P2 |
| BN-LH-09 | **Phòng khám đổi hoặc hủy lịch.** Là bệnh nhân, tôi muốn được báo ngay khi bác sĩ nghỉ hoặc đổi giờ và có cách xử lý để khỏi phải gọi hỏi. | **FE:** biểu ngữ trên lịch bị ảnh hưởng với 3 lựa chọn: đổi sang bác sĩ khác, dời giờ, hủy (hoàn cọc nếu có). **BE:** nhận từ luồng AD-SC-13 / AD-PT-05..07; thông báo ≤ 1 phút. | Lịch không bị bỏ lửng: luôn có một trạng thái rõ ràng. | Mới · P1 |
| BN-LH-10 | **Lịch vắng mặt.** Là bệnh nhân, tôi muốn biết lịch của mình bị đánh dấu vắng mặt và cách đặt lại. | **FE:** nhãn "Vắng mặt" kèm nút "Đặt lịch mới" và hotline. **BE:** từ trạng thái `NO_SHOW`. | Nội dung nhẹ nhàng, không phê phán. | Mới · P3 |

### 2.8 Nhắc lịch và thông báo (NT)
*Màn hình: Thông báo, Cài đặt thông báo*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| BN-NT-01 | **Nhắc lịch tự động.** Là bệnh nhân, tôi muốn được nhắc trước giờ khám để không quên. | **FE:** tin nhắc qua push/SMS/Zalo/Email. **BE:** gửi 24 giờ và 2 giờ trước giờ khám; có thử lại và kênh dự phòng khi lỗi; không gửi cho lịch đã hủy. | Không gửi trùng; nội dung không có thông tin bệnh lý. | v1 · P1 |
| BN-NT-02 | **Nút hành động trong tin nhắn.** Là bệnh nhân, tôi muốn xác nhận, đổi hoặc hủy ngay trong tin nhắc để khỏi mở app. | **FE:** nút "Xác nhận sẽ đến", "Đổi lịch", "Hủy". **BE:** link dùng một lần, có hạn. | Bấm "Xác nhận" cập nhật lịch; link hết hạn thì báo và hướng dẫn. | v1 · P1 |
| BN-NT-03 | **Trung tâm thông báo.** Là bệnh nhân, tôi muốn xem lại các thông báo trong app để không bỏ sót. | **FE:** chuông có chấm đỏ; danh sách (chưa đọc/đã đọc), "Đọc tất cả"; bấm đi thẳng tới mục liên quan. **BE:** `GET /notifications`, `PATCH /notifications/{id}/read`; đẩy realtime. | Chấm đỏ mất khi đọc hết. | v1 · P1 |
| BN-NT-04 | **Cài đặt kênh nhận.** Là bệnh nhân, tôi muốn chọn kênh nhận thông báo để phù hợp thói quen. | **FE:** công tắc Push, SMS, Zalo, Email; chọn múi giờ nhắc. **BE:** `PUT /patients/me/notification-settings`. | Thông báo thiết yếu (xác nhận, hủy, đổi lịch) không tắt hết được. | v1 · P2 |
| BN-NT-05 | **Thông báo theo sự kiện.** Là bệnh nhân, tôi muốn nhận tin khi lịch có thay đổi để nắm tình hình. | **FE:** các loại: đặt lịch thành công, được duyệt/từ chối, đổi/hủy, tới lượt, có kết quả/đơn thuốc mới, mời đánh giá. **BE:** Notification Service theo sự kiện. | Mỗi sự kiện gửi đúng một lần. | Mới · P1 |
| BN-NT-06 | **Xin quyền thông báo đẩy.** Là bệnh nhân, tôi muốn được hỏi bật thông báo đúng lúc để không bị làm phiền sớm. | **FE:** hỏi sau khi đặt lịch thành công, kèm lý do ("để nhắc giờ khám"). | Từ chối thì dùng SMS/Zalo, không hỏi lại liên tục. | Mới · P3 |

### 2.9 Check-in và hàng đợi (CI)
*Màn hình: Check-in, Hàng đợi của tôi*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| BN-CI-01 | **Mở check-in đúng lúc.** Là bệnh nhân, tôi muốn thấy nút Check-in khi sắp đến giờ để làm ngay khi tới phòng khám. | **FE:** nút "Check-in" sáng lên khi còn ≤ 60 phút; trước đó hiện "Mở lúc 08:00". **BE:** giờ mở lấy từ cấu hình (AD-CF-03). | Bấm khi chưa đến giờ không gửi yêu cầu lên máy chủ. | v1 · P1 |
| BN-CI-02 | **Quét QR hoặc xuất trình QR.** Là bệnh nhân, tôi muốn check-in bằng QR để khỏi xếp hàng ở quầy. | **FE:** mở camera quét QR đặt tại phòng khám; hoặc phóng to QR cá nhân cho điều dưỡng quét. **BE:** `POST /appointments/{id}/check-in` kiểm tra mã địa điểm và khung giờ. | Quét hai lần không tạo hai số thứ tự. | v1 · P1 |
| BN-CI-03 | **Kết quả check-in.** Là bệnh nhân, tôi muốn thấy số thứ tự ngay sau khi check-in để biết mình đứng thứ mấy. | **FE:** số thứ tự lớn, bác sĩ, phòng, số người phía trước. **BE:** tạo `queue_entry`, phát sự kiện tới bác sĩ, điều dưỡng, màn hình chờ. | Bác sĩ thấy bệnh nhân trong hàng đợi ≤ 3 giây. | v1 · P1 |
| BN-CI-04 | **Lỗi check-in.** Là bệnh nhân, tôi muốn được hướng dẫn rõ khi check-in không được để biết làm gì tiếp. | **FE:** thông báo theo từng lỗi: quá sớm, quá muộn, đã check-in lúc …, sai mã QR; luôn kèm "Gặp điều dưỡng ở quầy". | Không có thông báo lỗi chung chung. | v1 · P1 |
| BN-CI-05 | **Xác minh vị trí.** Là phòng khám, chúng tôi muốn chắc bệnh nhân thật sự có mặt khi check-in. | **FE:** xin quyền vị trí (tùy chọn); báo "Bạn chưa ở gần phòng khám" nếu xa. **BE:** so khoảng cách với tọa độ cơ sở. | Từ chối cấp vị trí thì vẫn check-in được bằng QR tại chỗ. | v1 · P3 |
| BN-CI-06 | **Hàng đợi của tôi.** Là bệnh nhân, tôi muốn biết còn bao lâu đến lượt để không phải ngồi chờ liên tục. | **FE:** số của tôi, số đang khám, số người phía trước, thời gian chờ dự kiến cập nhật động. **BE:** kênh WebSocket/SSE `queue:{appointment_id}`; ước tính từ thời lượng khám trung bình của bác sĩ. | Số khớp với màn hình chờ tại quầy. | v1 · P1 |
| BN-CI-07 | **Báo đến lượt.** Là bệnh nhân, tôi muốn được báo khi sắp và khi đến lượt để di chuyển kịp. | **FE:** thông báo "Sắp đến lượt bạn" (còn 2 người) và "Mời vào phòng khám". | Thông báo đến trong ≤ 3 giây sau khi điều dưỡng/bác sĩ gọi. | v1 · P1 |
| BN-CI-08 | **Các tình huống trong lúc chờ.** Là bệnh nhân, tôi muốn biết khi mình đang được đo sinh hiệu, được ưu tiên hoặc bị xếp lại để hiểu vì sao. | **FE:** nhãn "Đang đo sinh hiệu", "Được ưu tiên", "Được xếp lại, lý do: …". **BE:** từ `queue_events`. | Lý do xếp lại hiển thị bằng lời dễ hiểu. | Mới · P2 |
| BN-CI-09 | **Mất mạng khi chờ.** Là bệnh nhân, tôi muốn số thứ tự không sai khi mạng chập chờn để không hiểu nhầm. | **FE:** tự nối lại; chuyển sang tải lại mỗi 15 giây; hiện "Đang kết nối lại" thay vì số cũ không cảnh báo. | Kết nối lại thì dữ liệu cập nhật đúng. | v1 · P2 |
| BN-CI-10 | **Đến muộn.** Là bệnh nhân đến muộn, tôi muốn biết mình phải làm gì để vẫn được khám. | **FE:** thông báo "Bạn đến muộn quá 15 phút. Vui lòng gặp điều dưỡng để xếp lại hoặc đổi lịch". | Nội dung dùng đúng giá trị ngưỡng trong cấu hình (AD-CF-03). | Mới · P2 |

### 2.10 Thanh toán (PY)
*Chỉ áp dụng nếu chủ phòng khám chốt giữ thanh toán trên hệ thống (FR-09). Đây là nơi duy nhất hiển thị giá cho bệnh nhân.*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| BN-PY-01 | **Tóm tắt chi phí.** Là bệnh nhân, tôi muốn thấy rõ phải trả bao nhiêu trước khi thanh toán để không bị bất ngờ. | **FE:** các khoản (phí khám, đã cọc, BHYT nếu có), tổng cần trả. **BE:** `GET /appointments/{id}/billing`, lấy phí từ AD-SV. | Số tiền khớp với số tiền điều dưỡng thấy ở quầy. | v1 · P2 |
| BN-PY-02 | **Chọn phương thức.** Là bệnh nhân, tôi muốn trả bằng ví điện tử hoặc chuyển khoản cho tiện. | **FE:** VNPay, MoMo, ZaloPay, chuyển khoản (mã QR). **BE:** `POST /payments` trả URL hoặc QR. | Chỉ hiện cổng đang bật ở AD-CF-07. | v1 · P2 |
| BN-PY-03 | **Chờ kết quả.** Là bệnh nhân, tôi muốn thấy giao dịch đang ở bước nào để biết đã thanh toán xong chưa. | **FE:** trạng thái đang xử lý / thành công / thất bại, nút "Thử lại"; cảnh báo không đóng trang. **BE:** webhook xác thực chữ ký và chỉ ghi nhận một lần. | Gọi lặp từ cổng không tạo giao dịch trùng. | v1 · P2 |
| BN-PY-04 | **Giao dịch hết hạn.** Là bệnh nhân, tôi muốn được báo khi giao dịch hết hạn để đặt lại. | **FE:** thông báo kèm nút "Đặt lại". **BE:** tự hủy giao dịch treo quá hạn và trả slot. | Slot được trả lại ngay khi hết hạn. | v1 · P2 |
| BN-PY-05 | **Biên lai và lịch sử giao dịch.** Là bệnh nhân, tôi muốn tải biên lai và xem lại các lần thanh toán để lưu giữ. | **FE:** danh sách giao dịch, nút "Tải biên lai (PDF)". **BE:** `GET /payments/me`, `GET /payments/{id}/receipt`. | Biên lai có mã tra cứu duy nhất. | v1 · P2 |
| BN-PY-06 | **Hoàn cọc.** Là bệnh nhân, tôi muốn theo dõi khoản hoàn khi hủy đúng hạn để biết bao giờ nhận lại. | **FE:** trạng thái hoàn tiền (đang xử lý/đã hoàn). **BE:** liên kết AD-PY-04. | Số tiền hoàn đúng chính sách tại thời điểm đặt lịch. | Mới · P2 |
| BN-PY-07 | **Thanh toán tại quầy sau khám.** Là bệnh nhân, tôi muốn thấy trong app khoản còn phải trả sau khi khám xong để chuẩn bị. | **FE:** lịch ở trạng thái "Chờ thanh toán" (`COMPLETED`) hiện số tiền; sau khi điều dưỡng thu thì chuyển "Hoàn tất" (`PAID`) và có biên lai. | Trạng thái đổi trong ≤ 3 giây sau khi điều dưỡng thu tiền. | Mới · P2 |

### 2.11 Hồ sơ sức khỏe (HS)
*Màn hình: Hồ sơ sức khỏe (chỉ đọc)*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| BN-HS-01 | **Lịch sử khám.** Là bệnh nhân, tôi muốn xem các lần đã khám để theo dõi sức khỏe. | **FE:** dòng thời gian (ngày, bác sĩ, chuyên khoa, chẩn đoán tóm tắt, lời dặn). **BE:** `GET /patients/me/visits`; chỉ hiện sau khi bác sĩ hoàn tất. | Chỉ thấy dữ liệu của mình và người thân đã liên kết. | v1 · P1 |
| BN-HS-02 | **Chi tiết một lần khám.** Là bệnh nhân, tôi muốn xem đầy đủ một lần khám để hiểu bác sĩ đã dặn gì. | **FE:** sinh hiệu, chẩn đoán, hướng xử trí, lời dặn, lịch tái khám, đơn thuốc liên quan. **BE:** `GET /patients/me/visits/{id}`; ghi nhật ký khi xem. | Không hiện ghi chú nội bộ của bác sĩ. | Mới · P1 |
| BN-HS-03 | **Đơn thuốc.** Là bệnh nhân, tôi muốn xem đơn thuốc dễ đọc và tải về để mua và dùng đúng. | **FE:** danh sách thuốc (liều, cách dùng, số ngày) hiển thị dạng thẻ dễ đọc; nút "Tải PDF". **BE:** `GET /patients/me/prescriptions`. | Bản PDF có mã QR xác thực. | v1 · P1 |
| BN-HS-04 | **Kết quả xét nghiệm và hình ảnh.** Là bệnh nhân, tôi muốn xem và tải kết quả để mang đi khám nơi khác khi cần. | **FE:** danh sách kết quả, xem trực tiếp, tải về. **BE:** `GET /patients/me/lab-results`; tệp tải bằng đường dẫn ký có thời hạn. | Đường dẫn tải hết hạn sau thời gian ngắn. | v1 · P2 |
| BN-HS-05 | **Lọc và tìm.** Là bệnh nhân, tôi muốn lọc theo người thân, chuyên khoa, thời gian để tìm đúng hồ sơ. | **FE:** các ô lọc; ô tìm theo bác sĩ hoặc chẩn đoán. | Lọc kết hợp được. | v1 · P2 |
| BN-HS-06 | **Biểu đồ sinh hiệu.** Là bệnh nhân có bệnh mạn tính, tôi muốn xem huyết áp, cân nặng qua các lần khám để theo dõi xu hướng. | **FE:** biểu đồ đường theo thời gian. **BE:** `GET /patients/me/vitals`. | Chỉ dùng dữ liệu do điều dưỡng ghi tại phòng khám. | Mới · P3 |
| BN-HS-07 | **Hỏi về hồ sơ.** Là bệnh nhân, tôi muốn gửi thắc mắc khi thấy thông tin chưa đúng để được xem xét. | **FE:** nút "Báo thông tin chưa đúng" ở mỗi lần khám, ô mô tả. **BE:** `POST /support/record-queries`; chuyển điều dưỡng và bác sĩ. | Bệnh nhân không tự sửa bệnh án; yêu cầu có người xử lý và phản hồi. | Mới · P3 |

### 2.12 Đánh giá (RV)
*Màn hình: Đánh giá sau khám*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| BN-RV-01 | **Lời mời đánh giá.** Là bệnh nhân, tôi muốn được mời đánh giá sau khi khám để góp ý dễ dàng. | **FE:** thông báo và thẻ trong lịch đã khám. **BE:** gửi sau khi lịch `COMPLETED` hoặc `PAID`. | Chỉ mời một lần cho mỗi lượt khám. | v1 · P2 |
| BN-RV-02 | **Gửi đánh giá.** Là bệnh nhân, tôi muốn chấm sao và viết nhận xét để phản hồi chất lượng. | **FE:** sao 1–5 cho bác sĩ, thời gian chờ, cơ sở vật chất; nhận xét tùy chọn; lựa chọn ẩn danh. **BE:** `POST /appointments/{id}/reviews`; lọc từ ngữ không phù hợp. | Không đánh giá được lịch chưa khám; mỗi lịch một đánh giá. | v1 · P2 |
| BN-RV-03 | **Sửa đánh giá.** Là bệnh nhân, tôi muốn sửa đánh giá trong vài ngày để chỉnh lại khi cần. | **FE:** nút "Sửa" trong 7 ngày. **BE:** `PUT /reviews/{id}`. | Quá 7 ngày không sửa được. | v1 · P2 |
| BN-RV-04 | **Phản hồi của phòng khám.** Là bệnh nhân, tôi muốn thấy phòng khám trả lời đánh giá của mình để biết góp ý được ghi nhận. | **FE:** phần "Phản hồi" dưới đánh giá. **BE:** từ AD-RV-03. | Chỉ hiện phản hồi đã đăng. | Mới · P3 |

### 2.13 Hỗ trợ và trợ năng (SP)
*Màn hình: mọi màn hình quan trọng, trang Hỗ trợ*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| BN-SP-01 | **Hotline và gọi lại.** Là bệnh nhân lớn tuổi, tôi muốn gọi hoặc nhờ nhân viên gọi lại để được giúp. | **FE:** nút hotline và "Nhờ nhân viên gọi lại" luôn hiển thị; form (SĐT, giờ thuận tiện). **BE:** `POST /support/callback-requests`. | Yêu cầu hiện ở hộp yêu cầu của điều dưỡng; có xác nhận đã gửi. | v1 · P1 |
| BN-SP-02 | **Lịch do nhân viên đặt hộ.** Là bệnh nhân, tôi muốn thấy lịch do điều dưỡng đặt hộ trong tài khoản để không bị lệch với thực tế. | **FE:** lịch có nhãn "Đặt hộ bởi phòng khám". **BE:** `created_via = STAFF_PHONE`. | Hiển thị đầy đủ khi bệnh nhân đăng nhập lần đầu sau đó. | v1 · P1 |
| BN-SP-03 | **Chế độ chữ lớn.** Là người lớn tuổi, tôi muốn chữ to và tương phản cao để đọc được. | **FE:** công tắc "Chữ lớn" trong Cài đặt (và trên đầu trang); nhớ lựa chọn; áp dụng mọi màn hình. **BE:** lưu ở `patient_settings`. | Không vỡ bố cục ở cỡ chữ lớn; độ tương phản đạt WCAG AA. | v1 · P1 |
| BN-SP-04 | **Giao diện đơn giản.** Là người ít dùng công nghệ, tôi muốn mỗi màn hình chỉ một việc chính để không bị rối. | **FE:** nút nhãn rõ ràng bằng chữ (không chỉ biểu tượng); hạn chế thao tác kéo thả; không chỉ dùng màu để báo trạng thái. | Có thể hoàn tất đặt lịch chỉ bằng các nút bấm lớn. | v1 · P2 |
| BN-SP-05 | **Nhắc lịch cho người không có smartphone.** Là bệnh nhân không dùng smartphone, tôi muốn nhận nhắc lịch qua SMS hoặc cuộc gọi. | **FE:** lựa chọn "Chỉ SMS/gọi điện" khi điều dưỡng đặt hộ. **BE:** kênh SMS và gọi điện trong Notification Service. | Người này vẫn nhận đủ nhắc 24 giờ và 2 giờ. | v1 · P2 |
| BN-SP-06 | **Trang trợ giúp và góp ý.** Là bệnh nhân, tôi muốn có hướng dẫn và nơi góp ý để dùng dễ hơn. | **FE:** trang "Trợ giúp" (hướng dẫn đặt lịch có hình, liên kết Hỏi đáp); form "Góp ý". **BE:** `POST /support/feedback`. | Góp ý có xác nhận đã gửi. | Mới · P3 |

### 2.14 Khung chung (GN)
*Áp dụng cho mọi màn hình Bệnh nhân*

| Mã | User story | FE / BE | Tiêu chí nghiệm thu | Nhãn |
| --- | --- | --- | --- | --- |
| BN-GN-01 | **Điều hướng.** Là bệnh nhân, tôi muốn đi lại giữa các khu vực dễ dàng để tìm đúng chức năng. | **FE:** web có thanh menu trên cùng; điện thoại có thanh tab dưới (Trang chủ, Đặt lịch, Lịch hẹn, Hồ sơ, Tài khoản); sau đăng nhập, trang chủ có thẻ "Lịch sắp tới" kèm nút Check-in khi đến giờ. | Mục đang chọn được tô sáng; thanh tab không che nội dung. | Mới · P1 |
| BN-GN-02 | **Trạng thái dùng chung.** Là bệnh nhân, tôi muốn mọi màn hình báo tải, trống, lỗi giống nhau để dễ hiểu. | **FE:** khung xương khi tải; trạng thái trống có hướng dẫn ("Chưa có lịch hẹn. Bấm Đặt lịch"); thông báo nổi khi lưu thành công; lỗi có nút "Thử lại". | Không màn hình nào chỉ để trống trắng khi lỗi. | Mới · P1 |
| BN-GN-03 | **Mất mạng.** Là bệnh nhân, tôi muốn biết khi mất mạng và không mất dữ liệu đã nhập. | **FE:** biểu ngữ "Mất kết nối"; giữ dữ liệu form; tự thử lại khi có mạng. | Biểu ngữ tự biến mất khi có mạng. | Mới · P2 |
| BN-GN-04 | **Hết phiên đăng nhập.** Là bệnh nhân, tôi muốn không bị đẩy ra giữa chừng để tiếp tục việc đang làm. | **FE:** tự làm mới token; nếu hết hạn thì đưa về đăng nhập rồi quay lại đúng trang. **BE:** `POST /auth/refresh`. | Không mất dữ liệu đang nhập khi phải đăng nhập lại. | Mới · P2 |
| BN-GN-05 | **Ngôn ngữ và định dạng.** Là bệnh nhân, tôi muốn ngày giờ hiển thị quen thuộc để không nhầm. | **FE:** tiếng Việt; ngày dd/mm/yyyy; giờ 24 giờ; múi giờ GMT+7. | Mọi nơi hiển thị ngày giờ dùng cùng một định dạng. | Mới · P2 |

---

## 3. Dữ liệu bổ sung (ngoài các bảng của v1)

| Bảng / trường | Dùng cho |
| --- | --- |
| `users`, `patients`, `dependents` (thêm `guardian_id`), `consents` | BN-AC, BN-PV |
| `patient_settings` (chữ lớn, kênh nhận thông báo, múi giờ) | BN-SP-03, BN-NT-04 |
| `favorite_doctors` | BN-SR-09 |
| `appointments` (thêm `reject_reason`, `created_via`, `parent_visit_id`, `type`) | BN-BK, BN-LH |
| `appointment_attachments` | BN-BK-05 |
| `appointment_status_history` | BN-LH-07 |
| `queue_entries`, `queue_events` | BN-CI |
| `waitlist` (patient_id, doctor_id, preferred_from, preferred_to, status) | BN-BK-14 |
| `payments`, `receipts` | BN-PY |
| `notifications`, `notification_settings` | BN-NT |
| `ai_conversations`, `ai_messages` | BN-AI |
| `reviews` (thêm `reply`) | BN-RV |
| `emr_access_logs` | BN-PV-06 |
| `support_requests` (callback, record_query, feedback) | BN-SP, BN-HS-07 |
| `articles`, `faqs`, `media`, `site_settings` (đọc công khai) | BN-HP |

## 4. Yêu cầu phi chức năng cho Bệnh nhân
- **Bảo mật và pháp lý:** TLS và mã hóa dữ liệu y tế; đồng ý rõ ràng khi xử lý dữ liệu sức khỏe (Nghị định 13/2023/NĐ-CP); giới hạn tốc độ cho đăng nhập, OTP, đặt lịch; nhật ký truy cập hồ sơ.
- **Hiệu năng:** tra cứu giờ trống và đặt lịch dưới 2 giây giờ cao điểm; trang chủ tải dưới 3 giây trên 4G; cache lịch trống bằng Redis; chống đặt trùng bằng khóa giao dịch.
- **Thời gian thực:** cập nhật số thứ tự và trạng thái lịch trong ≤ 3 giây; có phương án dự phòng khi mất kết nối.
- **Trải nghiệm:** ưu tiên điện thoại, responsive; khả năng truy cập WCAG AA; thông báo lỗi dễ hiểu, kèm cách xử lý; không mất dữ liệu đã nhập khi mạng chập chờn.
- **Nội dung y tế:** không dùng lời cam kết kết quả điều trị; trợ lý AI luôn nhắc không thay thế chẩn đoán; cần rà soát pháp lý về quảng cáo y tế và lưu trữ hồ sơ.

## 5. Lộ trình phát triển đề xuất

| Giai đoạn | Nội dung | Story |
| --- | --- | --- |
| **1 – Đặt lịch cốt lõi** | Trang chủ công khai cơ bản, đăng ký/đăng nhập, tìm bác sĩ, đặt lịch (có giữ chỗ, chờ duyệt), xem/hủy/đổi lịch, nhắc lịch, check-in và hàng đợi, hồ sơ cá nhân và người thân, hỗ trợ người lớn tuổi | BN-HP-01..03, 05, 06, BN-AC-01..03, 05, 07..09, 11, BN-SR-01..03, 05..07, BN-BK-01..10, BN-LH-01, 03..05, 09, BN-NT-01..03, 05, BN-CI-01..04, 06, 07, BN-SP-01..03, BN-GN-01, 02 |
| **2 – Hoàn thiện** | Hồ sơ sức khỏe, thanh toán (nếu giữ), đánh giá, hồ sơ trẻ em, dòng thời gian trạng thái, quyền riêng tư, phần còn lại của trang chủ | BN-HP-04, 08, 10, 14..16, BN-AC-04, 06, 10, BN-PV-01..03, BN-SR-04, 08, BN-BK-11..13, BN-LH-02, 06..08, BN-NT-04, BN-CI-08..10, BN-PY-01..07, BN-HS-01..05, BN-RV-01..03, BN-SP-04, 05, BN-GN-03..05 |
| **3 – Mở rộng** | Trợ lý AI, danh sách chờ, nhật ký truy cập hồ sơ, yêu thích, biểu đồ sinh hiệu, nội dung website | còn lại, gồm BN-AI-01..10 |

## 6. Câu hỏi cần chốt / đối chiếu với code
1. Giao diện Bệnh nhân hiện có những màn hình nào? Gửi ảnh chụp để đổi nhãn "v1" sang "Hiện có".
2. Còn thu phí hoặc đặt cọc trên hệ thống không (FR-09)? Nếu không, bỏ module PY và bước thanh toán ở BN-BK-07.
3. Có làm trợ lý AI không? Nếu không, bỏ module AI, bong bóng chat ở BN-HP-15 và liên kết ở BN-SR-02.
4. Chỉ làm web responsive hay có cả ứng dụng iOS/Android? (ảnh hưởng thông báo đẩy, quét QR, vị trí).
5. Lịch mới đặt có cần phòng khám duyệt không, hay tự động xác nhận (AD-CF-04)?
6. Các giá trị đề xuất ở mục 1.5 (giữ chỗ 10 phút, hủy trước 4 giờ, tối đa 3 lịch, check-in 60 phút) có đúng thực tế không?
7. Có nhận bảo hiểm y tế không (hiển thị ở BN-AC-07 và BN-PY-01)?
8. Hồ sơ trẻ em: ngưỡng tuổi cần người giám hộ (đề xuất dưới 16 tuổi).
9. Thời hạn lưu bệnh án và cách xử lý yêu cầu xóa dữ liệu (cần tư vấn pháp lý).
10. Endpoint thực tế trong `backend` có khác tên đề xuất ở trên không.

## Phụ lục A. Đối chiếu bản v1 với mã mới

| Bản v1 | Nay nằm ở |
| --- | --- |
| US-01 Đăng ký và đăng nhập | BN-AC-01..05 |
| US-02 Hồ sơ cá nhân và người thân | BN-AC-07..10 |
| US-03 Quyền riêng tư dữ liệu | BN-PV-01..06 |
| US-04 Tìm bác sĩ / chuyên khoa | BN-SR-01..09 (đã bỏ phí khám và lọc "hình thức") |
| US-05 Đặt lịch khám | BN-BK-01..12 (đã bỏ bước chọn hình thức khám) |
| US-06 Chat với trợ lý AI | BN-AI-01..10 |
| US-07 Xem danh sách lịch hẹn | BN-LH-01..03 |
| US-08 Hủy hoặc đổi lịch | BN-LH-04, 05 |
| US-09 Nhận nhắc lịch và xác nhận lại | BN-NT-01..04 |
| US-10 Check-in khi đến phòng khám | BN-CI-01..05 |
| US-11 Theo dõi số thứ tự | BN-CI-06..09 |
| US-12 Thanh toán / đặt cọc | BN-PY-01..05 |
| US-13 Xem lịch sử khám, đơn thuốc, kết quả | BN-HS-01, 03..05; BN-BK-13 |
| US-14 Đặt và tham gia khám video | **Đã bỏ** (không khám từ xa) |
| US-15 Đánh giá sau khám | BN-RV-01..03 |
| US-16 Hỗ trợ người không rành công nghệ | BN-SP-01..05 |

## Lịch sử thay đổi

| Phiên bản | Ngày | Người sửa | Nội dung |
| --- | --- | --- | --- |
| 1.0 | | | Bản user story Bệnh nhân đầu tiên (16 story, 10 epic) |
| 2.0 | 20/10/2026 | | Viết lại theo cấu trúc module: bỏ khám từ xa và giá ở trang công khai; thêm Trang chủ công khai, hồ sơ trẻ em, chờ duyệt, lịch bị phòng khám thay đổi, thông báo sự kiện, trạng thái dùng chung; đồng bộ với admin.md |