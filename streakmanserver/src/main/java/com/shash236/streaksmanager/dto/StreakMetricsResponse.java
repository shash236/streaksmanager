package com.shash236.streaksmanager.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StreakMetricsResponse {
    private Integer currentStreak;
    private Integer longestStreak;
}
