package vn.medicare.api.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.medicare.api.dto.DoctorAppointmentResponse;
import vn.medicare.api.entity.Appointment;
import vn.medicare.api.entity.AppointmentStatus;
import vn.medicare.api.entity.User;
import vn.medicare.api.repository.AppointmentRepository;
import vn.medicare.api.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public List<DoctorAppointmentResponse> getDoctorSchedule(String doctorEmail) {
        User doctor = userRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin Bác sĩ"));

        return appointmentRepository.findByDoctorOrderByAppointmentDateAsc(doctor)
                .stream()
                .map(appt -> DoctorAppointmentResponse.builder()
                        .id(appt.getId())
                        .patientId(appt.getPatient().getId())
                        .patientName(appt.getPatient().getFullName())
                        .patientPhone(appt.getPatient().getPhone() != null ? appt.getPatient().getPhone() : "Chưa cập nhật")
                        .appointmentDate(appt.getAppointmentDate())
                        .status(appt.getStatus().name())
                        .reason(appt.getReason())
                        .build())
                .collect(Collectors.toList());
    }

    public void updateAppointmentStatus(UUID appointmentId, String doctorEmail, String newStatus) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch khám"));

        if (!appointment.getDoctor().getEmail().equals(doctorEmail)) {
            throw new RuntimeException("Bạn không có quyền thao tác trên lịch khám này!");
        }

        appointment.setStatus(AppointmentStatus.valueOf(newStatus.toUpperCase()));
        appointmentRepository.save(appointment);
    }

    public List<DoctorAppointmentResponse> getPendingAppointments(String doctorEmail) {
        User doctor = userRepository.findByEmail(doctorEmail).orElseThrow();
        return appointmentRepository.findByDoctorAndStatusOrderByAppointmentDateAsc(doctor, AppointmentStatus.PENDING)
                .stream().map(appt -> DoctorAppointmentResponse.builder()
                        .id(appt.getId())
                        .patientId(appt.getPatient().getId())
                        .patientName(appt.getPatient().getFullName())
                        .patientPhone(appt.getPatient().getPhone() != null ? appt.getPatient().getPhone() : "Chưa cập nhật")
                        .appointmentDate(appt.getAppointmentDate())
                        .status(appt.getStatus().name())
                        .reason(appt.getReason())
                        .build())
                .collect(Collectors.toList());
    }

    public User getProfile(String email) {
        return userRepository.findByEmail(email).orElseThrow();
    }

    public void updateProfile(String email, String phone, String bio, String avatarUrl) {
        User doctor = userRepository.findByEmail(email).orElseThrow();
        doctor.setPhone(phone);
        doctor.setBio(bio);
        doctor.setAvatarUrl(avatarUrl); 
        userRepository.save(doctor);
    }

    public java.util.Map<String, Object> getDashboardStats(String email) {
        try {
            User doctor = userRepository.findByEmail(email).orElseThrow();
            var allAppts = appointmentRepository.findByDoctorOrderByAppointmentDateAsc(doctor);

            long totalPatients = allAppts.stream()
                    .filter(a -> a.getPatient() != null)
                    .map(a -> a.getPatient().getId())
                    .distinct()
                    .count();

            long completed = allAppts.stream()
                    .filter(a -> a.getStatus() != null && a.getStatus().name().equals("COMPLETED"))
                    .count();

            long pending = allAppts.stream()
                    .filter(a -> a.getStatus() != null && a.getStatus().name().equals("PENDING"))
                    .count();

            java.util.List<java.util.Map<String, Object>> chartData = new java.util.ArrayList<>();
            java.time.LocalDate today = java.time.LocalDate.now();
            java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("dd/MM");

            for (int i = 6; i >= 0; i--) {
                java.time.LocalDate date = today.minusDays(i);
                
                long count = allAppts.stream()
                        .filter(a -> a.getAppointmentDate() != null && a.getAppointmentDate().toLocalDate().equals(date))
                        .count();

                chartData.add(java.util.Map.of(
                        "day", date.format(formatter),
                        "patients", count
                ));
            }

            return java.util.Map.of(
                "totalPatients", totalPatients,
                "completedAppointments", completed,
                "pendingRequests", pending,
                "chartData", chartData
            );
        } catch (Exception e) {
            e.printStackTrace();
            return java.util.Map.of(
                "totalPatients", 0, "completedAppointments", 0, "pendingRequests", 0,
                "chartData", java.util.List.of()
            );
        }
    }
}