package com.shash236.streaksmanager.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class StreakResponse {
    private Long id;
    private String title;
    private String description;
    private Integer currentStreak;
    private Integer longestStreak;
    private Boolean active;
    private LocalDate lastCheckIn;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
