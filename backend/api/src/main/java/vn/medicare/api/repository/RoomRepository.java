package vn.medicare.api.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import vn.medicare.api.entity.Room;

public interface RoomRepository extends JpaRepository<Room, UUID> {
    List<Room> findByClinicId(UUID clinicId);
    boolean existsByNameAndClinicId(String name, UUID clinicId);
}