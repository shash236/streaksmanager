package com.shash236.streaksmanager.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StreakResponse {
    private Long id;
    private String title;
    private String description;
    private Integer currentStreak;
    private Integer longestStreak;
    private Boolean active;
    private Long lastCheckIn;
    private Long createdAt;
    private Long updatedAt;
    private java.util.List<Long> pastWeekHistory;
}
