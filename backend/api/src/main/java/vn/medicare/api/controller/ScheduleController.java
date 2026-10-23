package vn.medicare.api.controller;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.medicare.api.dto.ScheduleRequest;
import vn.medicare.api.service.ScheduleService;

@RestController
@RequestMapping("/api/v1/doctor/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    @PostMapping("/create")
    public ResponseEntity<?> createSchedule(Principal principal, @RequestBody ScheduleRequest request) {
        try {
            return ResponseEntity.ok(scheduleService.createSchedule(principal.getName(), request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-schedules")
    public ResponseEntity<?> getMySchedules(Principal principal) {
        return ResponseEntity.ok(scheduleService.getMySchedules(principal.getName()));
    }
}