package vn.medicare.api.service;

import java.time.LocalTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.medicare.api.dto.ScheduleRequest;
import vn.medicare.api.entity.Schedule;
import vn.medicare.api.entity.TimeSlot;
import vn.medicare.api.entity.TimeSlotStatus;
import vn.medicare.api.entity.User;
import vn.medicare.api.repository.ScheduleRepository;
import vn.medicare.api.repository.TimeSlotRepository;
import vn.medicare.api.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final UserRepository userRepository;

    @Transactional
    public String createSchedule(String doctorEmail, ScheduleRequest request) {
        User doctor = userRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ"));

        // Đã sửa existsByDoctorAndWorkDate -> existsByStaffAndWorkDate
        if (scheduleRepository.existsByStaffAndWorkDate(doctor, request.getWorkDate())) {
            throw new RuntimeException("Bạn đã có lịch làm việc trong ngày này rồi!");
        }

        // 1. Lưu Ca làm việc (Đã sửa .doctor -> .staff)
        Schedule schedule = Schedule.builder()
                .staff(doctor)
                .workDate(request.getWorkDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .slotDuration(request.getSlotDuration())
                .build();
        schedule = scheduleRepository.save(schedule);

        // 2. Thuật toán tự động cắt nhỏ thời gian thành các TimeSlot
        LocalTime current = request.getStartTime();
        while (current.plusMinutes(request.getSlotDuration()).isBefore(request.getEndTime()) 
                || current.plusMinutes(request.getSlotDuration()).equals(request.getEndTime())) {
            
            TimeSlot slot = TimeSlot.builder()
                    .schedule(schedule)
                    .startTime(current)
                    .endTime(current.plusMinutes(request.getSlotDuration()))
                    .status(TimeSlotStatus.OPEN)
                    .build();
            
            timeSlotRepository.save(slot);
            current = current.plusMinutes(request.getSlotDuration());
        }

        return "Đăng ký ca làm việc thành công!";
    }

    public List<Schedule> getMySchedules(String doctorEmail) {
        User doctor = userRepository.findByEmail(doctorEmail).orElseThrow();
        // Đã sửa findByDoctorOrderByWorkDateDesc -> findByStaffOrderByWorkDateDesc
        return scheduleRepository.findByStaffOrderByWorkDateDesc(doctor);
    }
}