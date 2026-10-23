package vn.medicare.api.controller;

import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping; // Đã thêm
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.medicare.api.entity.Room; // Đã thêm
import vn.medicare.api.repository.RoomRepository; // Đã thêm
import vn.medicare.api.service.RoomService;

@RestController
@RequestMapping("/admin/clinics/{clinicId}/rooms")
@RequiredArgsConstructor
public class RoomAdminController {
    
    private final RoomService roomService;
    private final RoomRepository roomRepository; // Đã khai báo để dùng trong hàm update

    @GetMapping
    public ResponseEntity<?> getRooms(@PathVariable UUID clinicId) {
        return ResponseEntity.ok(roomService.getRoomsByClinic(clinicId));
    }

    @PostMapping
    public ResponseEntity<?> createRoom(@PathVariable UUID clinicId, @RequestBody Map<String, String> request) {
        try {
            return ResponseEntity.ok(roomService.createRoom(clinicId, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable UUID clinicId, @PathVariable UUID id) {
        try {
            roomService.deleteRoom(id);
            return ResponseEntity.ok().body("{\"message\": \"Xóa phòng thành công\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Đã fix lại đường dẫn cho đúng với React Frontend
    @PutMapping("/{roomId}")
    public ResponseEntity<?> updateRoom(
            @PathVariable UUID clinicId, 
            @PathVariable UUID roomId, 
            @RequestBody Room request) {
        
        try {
            // Tìm phòng theo ID
            Room room = roomRepository.findById(roomId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng"));
            
            // Cập nhật tên mới
            room.setName(request.getName());
            roomRepository.save(room);
            
            return ResponseEntity.ok("{\"message\": \"Cập nhật tên phòng thành công\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}