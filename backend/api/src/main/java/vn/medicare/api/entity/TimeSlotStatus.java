package vn.medicare.api.entity;

public enum TimeSlotStatus {
    OPEN,       // Đang trống, cho phép đặt
    BOOKED,     // Đã có bệnh nhân đặt
    BLOCKED     // Bác sĩ báo bận / Nghỉ đột xuất
}