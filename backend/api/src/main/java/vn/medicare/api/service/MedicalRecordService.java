package vn.medicare.api.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.medicare.api.dto.MedicalRecordRequest;
import vn.medicare.api.dto.MedicalRecordResponse;
import vn.medicare.api.entity.Appointment;
import vn.medicare.api.entity.MedicalRecord;
import vn.medicare.api.entity.User;
import vn.medicare.api.repository.AppointmentRepository;
import vn.medicare.api.repository.MedicalRecordRepository;
import vn.medicare.api.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository; // Thêm repo này để gắn appointment vào medical record

    public List<MedicalRecordResponse> getMyRecords() {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User patient = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bệnh nhân"));

        return medicalRecordRepository.findByPatientIdOrderByCreatedAtDesc(patient.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public MedicalRecordResponse createRecord(MedicalRecordRequest request) {
        String doctorEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User doctor = userRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ"));

        User patient = userRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bệnh nhân"));
                
        // Lấy lịch khám tương ứng (tạm lấy theo ID từ request, nếu có)
        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch khám tương ứng"));

        MedicalRecord record = MedicalRecord.builder()
                .appointment(appointment) // Yêu cầu bắt buộc của Entity mới
                .patient(patient)
                .doctor(doctor)
                .diagnosisIcd10(request.getDiagnosis()) // Map chuẩn Entity SOAP
                .plan(request.getTreatmentPlan() + " | " + request.getNotes()) // Gộp đơn thuốc và lời dặn vào Plan
                .status("COMPLETED")
                .build();

        record = medicalRecordRepository.save(record);
        return mapToResponse(record);
    }

    public List<MedicalRecordResponse> getPatientRecords(UUID patientId) {
    return medicalRecordRepository.findByPatientIdOrderByCreatedAtDesc(patientId)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    private MedicalRecordResponse mapToResponse(MedicalRecord record) {
        return MedicalRecordResponse.builder()
                .id(record.getId())
                .doctorName(record.getDoctor().getFullName())
                .diagnosis(record.getDiagnosisIcd10()) // Đã sửa
                .treatmentPlan(record.getPlan())       // Đã sửa
                .notes("N/A")                          // Bỏ trống vì đã gộp vào plan
                .createdAt(record.getCreatedAt())
                .build();
    }
}