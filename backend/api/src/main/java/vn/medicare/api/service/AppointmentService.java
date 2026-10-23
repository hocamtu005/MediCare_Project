package vn.medicare.api.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.medicare.api.dto.AppointmentRequest;
import vn.medicare.api.dto.AppointmentResponse;
import vn.medicare.api.entity.Appointment;
import vn.medicare.api.entity.AppointmentStatus;
import vn.medicare.api.entity.AppointmentType;
import vn.medicare.api.entity.User;
import vn.medicare.api.repository.AppointmentRepository;
import vn.medicare.api.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public List<AppointmentResponse> getMyAppointments() {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User patient = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        return appointmentRepository.findByPatientOrderByAppointmentDateDesc(patient)
                .stream()
                .map(appt -> AppointmentResponse.builder()
                        .id(appt.getId())
                        .doctorName(appt.getDoctor().getFullName())
                        .appointmentDate(appt.getAppointmentDate())
                        .status(appt.getStatus().name())
                        .notes(appt.getReason()) // Đã sửa getNotes thành getReason
                        .build())
                .collect(Collectors.toList());
    }

    public AppointmentResponse createAppointment(AppointmentRequest request) {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User patient = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bệnh nhân"));

        User doctor = userRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ"));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        LocalDateTime aptDate = LocalDateTime.parse(request.getAppointmentDate(), formatter);

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                // .appointmentDate(aptDate) // Đã comment vì cấu trúc Model mới dùng TimeSlot
                .type(AppointmentType.OFFLINE) // Gán cứng loại khám trực tiếp cho MVP
                .status(AppointmentStatus.CONFIRMED) // Đã sửa từ SCHEDULED sang CONFIRMED
                .reason(request.getNotes()) // Đã sửa từ notes sang reason
                .build();

        appointment = appointmentRepository.save(appointment);

        return AppointmentResponse.builder()
                .id(appointment.getId())
                .doctorName(doctor.getFullName())
                .appointmentDate(appointment.getAppointmentDate())
                .status(appointment.getStatus().name())
                .notes(appointment.getReason()) // Đã sửa
                .build();
    }
}