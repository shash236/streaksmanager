package com.shash236.streaksmanager.mapper;

import com.shash236.streaksmanager.dto.StreakResponse;
import com.shash236.streaksmanager.model.Streak;
import com.shash236.streaksmanager.model.StreakEntry;
import com.shash236.streaksmanager.repository.StreakEntryRepository;
import com.shash236.streaksmanager.util.StreakCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class StreakDTOMapper {

    private final StreakEntryRepository streakEntryRepository;
    private final StreakCalculator streakCalculator;

    private static final long MILLIS_PER_DAY = 24 * 60 * 60 * 1000L;

    public StreakResponse mapToResponse(Streak streak) {
        Long today = streakCalculator.normalizeDate(System.currentTimeMillis());
        Long weekStart = today - (6 * MILLIS_PER_DAY);

        // Widen the search range to account for client-server timezone differences
        // (e.g. client ahead of server)
        Long queryStart = weekStart - MILLIS_PER_DAY;
        Long queryEnd = today + MILLIS_PER_DAY;

        List<StreakEntry> entries = streakEntryRepository.findByStreakAndCheckInDateBetween(streak, queryStart,
                queryEnd);
        List<Long> historyDates = entries.stream().map(StreakEntry::getCheckInDate).collect(Collectors.toList());

        return StreakResponse.builder()
                .id(streak.getId())
                .title(streak.getTitle())
                .description(streak.getDescription())
                .currentStreak(streak.getCurrentStreak())
                .longestStreak(streak.getLongestStreak())
                .active(streak.getActive())
                .lastCheckIn(streak.getLastCheckIn())
                .createdAt(streak.getCreatedAt())
                .updatedAt(streak.getUpdatedAt())
                .pastWeekHistory(historyDates)
                .build();
    }
}
