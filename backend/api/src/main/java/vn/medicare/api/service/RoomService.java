package vn.medicare.api.service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.medicare.api.entity.Clinic;
import vn.medicare.api.entity.Room;
import vn.medicare.api.repository.ClinicRepository;
import vn.medicare.api.repository.RoomRepository;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final RoomRepository roomRepository;
    private final ClinicRepository clinicRepository;

    public List<Room> getRoomsByClinic(UUID clinicId) {
        return roomRepository.findByClinicId(clinicId);
    }

    @Transactional
    public Room createRoom(UUID clinicId, Map<String, String> data) {
        Clinic clinic = clinicRepository.findById(clinicId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cơ sở"));
        if (roomRepository.existsByNameAndClinicId(data.get("name"), clinicId)) {
            throw new RuntimeException("Tên phòng đã tồn tại trong cơ sở này");
        }
        Room room = Room.builder()
                .name(data.get("name"))
                .clinic(clinic)
                .isActive(true)
                .build();
        return roomRepository.save(room);
    }

    @Transactional
    public void deleteRoom(UUID id) {
        roomRepository.deleteById(id);
    }
}