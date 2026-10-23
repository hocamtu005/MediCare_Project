package vn.medicare.api.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.medicare.api.service.AIService;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AIController {
    private final AIService aiService;

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody Map<String, String> payload) {
        try {
            return ResponseEntity.ok(aiService.chatWithAI(payload.get("message")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi kết nối AI: " + e.getMessage());
        }
    }
}