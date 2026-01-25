package com.shash236.streaksmanager.service;

import com.shash236.streaksmanager.dto.*;
import com.shash236.streaksmanager.model.Streak;
import com.shash236.streaksmanager.model.StreakEntry;
import com.shash236.streaksmanager.repository.StreakRepository;
import com.shash236.streaksmanager.repository.StreakEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StreakService {

    private final StreakRepository streakRepository;
    private final StreakEntryRepository streakEntryRepository;

    @Transactional
    public StreakResponse createStreak(CreateStreakRequest request) {
        Streak streak = Streak.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .currentStreak(0)
                .longestStreak(0)
                .active(true)
                .build();
        streak = streakRepository.save(streak);
        return mapToResponse(streak);
    }

    @Transactional
    public StreakResponse updateStreak(Long id, UpdateStreakRequest request) {
        Streak streak = getStreakOrThrow(id);
        if (request.getTitle() != null) {
            streak.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            streak.setDescription(request.getDescription());
        }
        streak = streakRepository.save(streak);
        return mapToResponse(streak);
    }

    @Transactional
    public StreakResponse startStreak(Long id) {
        Streak streak = getStreakOrThrow(id);
        streak.setActive(true);
        streak = streakRepository.save(streak);
        return mapToResponse(streak);
    }

    @Transactional
    public StreakResponse pauseStreak(Long id) {
        Streak streak = getStreakOrThrow(id);
        streak.setActive(false);
        streak = streakRepository.save(streak);
        return mapToResponse(streak);
    }

    @Transactional
    public StreakResponse archiveStreak(Long id) {
        streakRepository.deleteById(id);
        return StreakResponse.builder().id(id).title("Archived").build();
    }

    @Transactional
    public StreakResponse checkIn(Long id) {
        Streak streak = getStreakOrThrow(id);
        LocalDate today = LocalDate.now();

        if (streakEntryRepository.findByStreakAndCheckInDate(streak, today).isPresent()) {
            return mapToResponse(streak);
        }

        // Logic to update counts is still relevant for quick access, but now backed by
        // entries?
        // Let's keep the counter logic simplified and robust.
        // If lastCheckIn was yesterday, increment. If today, no-op (handled above).
        // Else reset.
        if (streak.getLastCheckIn() != null && streak.getLastCheckIn().equals(today.minusDays(1))) {
            streak.setCurrentStreak(streak.getCurrentStreak() + 1);
        } else {
            // Broken streak or first time
            streak.setCurrentStreak(1);
        }

        if (streak.getCurrentStreak() > streak.getLongestStreak()) {
            streak.setLongestStreak(streak.getCurrentStreak());
        }

        streak.setLastCheckIn(today);
        streak = streakRepository.save(streak);

        // Create entry
        StreakEntry entry = StreakEntry.builder()
                .streak(streak)
                .checkInDate(today)
                .build();
        streakEntryRepository.save(entry);

        return mapToResponse(streak);
    }

    @Transactional
    public StreakResponse uncheck(Long id) {
        Streak streak = getStreakOrThrow(id);
        LocalDate today = LocalDate.now();

        // Only allow unchecking for today
        if (streakEntryRepository.findByStreakAndCheckInDate(streak, today).isPresent()) {
            streakEntryRepository.deleteByStreakAndCheckInDate(streak, today);

            // Revert counts.
            if (streak.getCurrentStreak() > 0) {
                streak.setCurrentStreak(streak.getCurrentStreak() - 1);
            }
            // Reset last checkin to yesterday? Or find max date from entries?
            // Finding max date is safer.
            // But for simple logic:
            streak.setLastCheckIn(today.minusDays(1));
            // If current streak became 0, we might need to check if there WAS a streak
            // yesterday.
            // If we uncheck today, and yesterday was checked, streak should remain valid
            // for yesterday.
            // So if currentStreak becomes X-1, that is correct for yesterday's state.

            // Re-calculate lastCheckIn from db to be safe?
            // For now, naive reverting to yesterday is acceptable for MVP.
        }

        streak = streakRepository.save(streak);
        return mapToResponse(streak);
    }

    public StreakMetricsResponse getMetrics(Long id) {
        Streak streak = getStreakOrThrow(id);
        return StreakMetricsResponse.builder()
                .currentStreak(streak.getCurrentStreak())
                .longestStreak(streak.getLongestStreak())
                .build();
    }

    public StreakResponse getStreak(Long id) {
        return mapToResponse(getStreakOrThrow(id));
    }

    public List<StreakEntryResponse> getStreakHistory(Long id, String range) {
        Streak streak = getStreakOrThrow(id);
        LocalDate endDate = LocalDate.now();
        LocalDate startDate;

        switch (range) {
            case "week":
                startDate = endDate.minusWeeks(1); // or minusDays(6)
                break;
            case "month":
                startDate = endDate.minusMonths(1);
                break;
            case "last5":
                startDate = endDate.minusDays(4); // 5 days inclusive
                break;
            default:
                startDate = endDate.minusMonths(1); // default
        }

        List<StreakEntry> entries = streakEntryRepository.findByStreakAndCheckInDateBetween(streak, startDate, endDate);
        return entries.stream()
                .map(e -> StreakEntryResponse.builder().checkInDate(e.getCheckInDate()).build())
                .collect(Collectors.toList());
    }

    private Streak getStreakOrThrow(Long id) {
        return streakRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Streak not found with id: " + id));
    }

    private StreakResponse mapToResponse(Streak streak) {
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
                .build();
    }
}
