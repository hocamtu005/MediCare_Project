package vn.medicare.api.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.Data;

@Data
public class ScheduleRequest {
    private LocalDate workDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer slotDuration;
}