package vn.medicare.api.entity;

public enum AppointmentStatus {
    HOLDING,                // Đang giữ slot (khi đang thao tác đặt hộ)
    PENDING,                // Chờ duyệt
    CONFIRMED,              // Đã xác nhận (sắp khám)
    CHECKED_IN,             // Đã đến viện (nhận số)
    TRIAGED,                // Đã đo sinh hiệu (Sẵn sàng vào khám)
    IN_PROGRESS,            // Đang khám
    COMPLETED,              // Hoàn tất khám
    CANCELLED,              // Đã hủy
    NO_SHOW,                // Bỏ khám (Gọi 3 lần không vào)
    RESCHEDULE_REQUESTED,    // Yêu cầu đổi lịch
    PAID,
}