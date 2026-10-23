package vn.medicare.api.entity;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "patient_profiles")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PatientProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String gender;
    private String dateOfBirth; // Định dạng YYYY-MM-DD
    private String idNumber; // CCCD
    private String address;
    private String bloodType; // A, B, AB, O
    
    @Column(columnDefinition = "TEXT")
    private String allergies; // Dị ứng
    
    @Column(columnDefinition = "TEXT")
    private String chronicConditions; // Bệnh mạn tính

    private String bloodPressure;
    private String height;
    private String weight;
}