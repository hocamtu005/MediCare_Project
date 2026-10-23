package vn.medicare.api.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.medicare.api.entity.Role;
import vn.medicare.api.entity.Room;
import vn.medicare.api.entity.Schedule;
import vn.medicare.api.entity.TimeSlot;
import vn.medicare.api.entity.TimeSlotStatus;
import vn.medicare.api.entity.User;
import vn.medicare.api.repository.RoomRepository;
import vn.medicare.api.repository.ScheduleRepository;
import vn.medicare.api.repository.TimeSlotRepository;
import vn.medicare.api.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AdminScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    public List<Map<String, Object>> getAllSchedules() {
        return scheduleRepository.findAll().stream().map(schedule -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", schedule.getId());
            // Đã đổi getDoctor() thành getStaff()
            map.put("doctorName", schedule.getStaff().getFullName()); 
            map.put("role", schedule.getStaff().getRole().name()); // Gửi thêm role về Frontend
            map.put("workDate", schedule.getWorkDate().toString());
            map.put("startTime", schedule.getStartTime().toString());
            map.put("endTime", schedule.getEndTime().toString());
            map.put("slotDuration", schedule.getSlotDuration());
            
            if (schedule.getRoom() != null) {
                map.put("roomName", schedule.getRoom().getName());
                map.put("clinicName", schedule.getRoom().getClinic().getName());
            } else {
                map.put("roomName", "Chưa phân phòng");
                map.put("clinicName", "N/A");
            }
            return map;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void createSchedule(Map<String, String> data) {
        UUID staffId = UUID.fromString(data.get("doctorId")); // Vẫn dùng key cũ của Frontend
        LocalDate workDate = LocalDate.parse(data.get("workDate"));
        LocalTime startTime = LocalTime.parse(data.get("startTime"));
        LocalTime endTime = LocalTime.parse(data.get("endTime"));
        UUID roomId = UUID.fromString(data.get("roomId"));

        if (scheduleRepository.existsByStaffIdAndWorkDate(staffId, workDate)) {
            throw new RuntimeException("Nhân sự này đã có lịch trực trong ngày " + workDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        }

        if (scheduleRepository.existsRoomConflict(roomId, workDate, startTime, endTime)) {
            throw new RuntimeException("Phòng khám này đã có người khác trực trong khung giờ bạn chọn!");
        }

        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân sự"));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng khám"));

        // Lấy slotDuration (Điều dưỡng có thể gửi lên null hoặc 0)
        Integer slotDuration = null;
        if (data.containsKey("slotDuration") && data.get("slotDuration") != null && !data.get("slotDuration").isEmpty()) {
            slotDuration = Integer.parseInt(data.get("slotDuration"));
        }

        Schedule schedule = Schedule.builder()
                .staff(staff) // Đã đổi tên biến
                .workDate(workDate)
                .startTime(startTime)
                .endTime(endTime)
                .slotDuration(slotDuration)
                .room(room)
                .build();
        schedule = scheduleRepository.save(schedule);

        // NẾU LÀ BÁC SĨ THÌ MỚI CẮT SLOT
        if (staff.getRole() == Role.DOCTOR && slotDuration != null && slotDuration > 0) {
            List<TimeSlot> slots = new ArrayList<>();
            LocalTime currentStartTime = startTime;
            
            while (currentStartTime.plusMinutes(slotDuration).isBefore(endTime) || currentStartTime.plusMinutes(slotDuration).equals(endTime)) {
                LocalTime currentEndTime = currentStartTime.plusMinutes(slotDuration);
                TimeSlot slot = TimeSlot.builder()
                        .schedule(schedule)
                        .startTime(currentStartTime)
                        .endTime(currentEndTime)
                        .status(TimeSlotStatus.OPEN)
                        .build();
                slots.add(slot);
                currentStartTime = currentEndTime; 
            }
            timeSlotRepository.saveAll(slots);
        }
    }

    @Transactional
    public void deleteSchedule(UUID id) {
        // 1. Kiểm tra xem ca trực này có slot nào đã được bệnh nhân đặt (BOOKED) chưa
        boolean hasBookedPatients = timeSlotRepository.existsByScheduleIdAndStatus(id, TimeSlotStatus.BOOKED);
        
        if (hasBookedPatients) {
            // Ném ra lỗi rõ ràng để Frontend hiển thị cho Admin
            throw new RuntimeException("Không thể thu hồi ca trực này vì đã có bệnh nhân đặt lịch! Vui lòng chuyển lịch hoặc yêu cầu hủy lịch của bệnh nhân trước.");
        }

        // 2. Nếu an toàn (chưa có ai đặt hoặc đã hủy hết), tiến hành xóa
        // Phải xóa TimeSlot trước, xóa Schedule sau để không vi phạm khóa ngoại
        timeSlotRepository.deleteByScheduleId(id);
        scheduleRepository.deleteById(id);
    }
}