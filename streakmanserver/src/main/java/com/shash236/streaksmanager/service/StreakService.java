package com.shash236.streaksmanager.service;

import com.shash236.streaksmanager.dto.*;
import com.shash236.streaksmanager.model.Streak;
import com.shash236.streaksmanager.model.StreakEntry;
import com.shash236.streaksmanager.model.User;
import com.shash236.streaksmanager.repository.StreakRepository;
import com.shash236.streaksmanager.repository.StreakEntryRepository;
import com.shash236.streaksmanager.repository.UserRepository;
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
    private final UserRepository userRepository;

    @Transactional
    public StreakResponse createStreak(CreateStreakRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Streak streak = Streak.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .currentStreak(0)
                .longestStreak(0)
                .active(true)
                .user(user)
                .build();
        streak = streakRepository.save(streak);
        return mapToResponse(streak);
    }

    @Transactional
    public StreakResponse updateStreak(Long id, UpdateStreakRequest request, Long userId) {
        Streak streak = getStreakOrThrow(id, userId);
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
    public StreakResponse startStreak(Long id, Long userId) {
        Streak streak = getStreakOrThrow(id, userId);
        streak.setActive(true);
        streak = streakRepository.save(streak);
        return mapToResponse(streak);
    }

    @Transactional
    public StreakResponse pauseStreak(Long id, Long userId) {
        Streak streak = getStreakOrThrow(id, userId);
        streak.setActive(false);
        streak = streakRepository.save(streak);
        return mapToResponse(streak);
    }

    @Transactional
    public StreakResponse archiveStreak(Long id, Long userId) {
        Streak streak = getStreakOrThrow(id, userId);
        streakRepository.delete(streak);
        return StreakResponse.builder().id(id).title("Archived").build();
    }

    @Transactional
    public StreakResponse checkIn(Long id, LocalDate date, Long userId) {
        Streak streak = getStreakOrThrow(id, userId);
        LocalDate checkInDate = (date != null) ? date : LocalDate.now();
        LocalDate today = LocalDate.now();

        if (streakEntryRepository.findByStreakAndCheckInDate(streak, checkInDate).isPresent()) {
            return mapToResponse(streak);
        }

        // Only update current streak counters if checking in for today or yesterday
        // AND the streak logic holds.
        if (checkInDate.equals(today)) {
            if (streak.getLastCheckIn() != null && streak.getLastCheckIn().equals(today.minusDays(1))) {
                streak.setCurrentStreak(streak.getCurrentStreak() + 1);
            } else if (streak.getLastCheckIn() == null || !streak.getLastCheckIn().equals(today)) {
                // If not today (already checked) and not yesterday (broken), reset to 1
                streak.setCurrentStreak(1);
            }
            streak.setLastCheckIn(today);
            if (streak.getCurrentStreak() > streak.getLongestStreak()) {
                streak.setLongestStreak(streak.getCurrentStreak());
            }
        } else {
            // For past dates, we simply add the entry.
        }

        streak = streakRepository.save(streak);

        // Create entry
        StreakEntry entry = StreakEntry.builder()
                .streak(streak)
                .checkInDate(checkInDate)
                .build();
        streakEntryRepository.save(entry);

        recalculateStreakStats(streak);
        streak = streakRepository.save(streak); // Save again with updated stats

        return mapToResponse(streak);
    }

    @Transactional
    public StreakResponse uncheck(Long id, LocalDate date, Long userId) {
        Streak streak = getStreakOrThrow(id, userId);
        LocalDate uncheckDate = (date != null) ? date : LocalDate.now();

        if (streakEntryRepository.findByStreakAndCheckInDate(streak, uncheckDate).isPresent()) {
            streakEntryRepository.deleteByStreakAndCheckInDate(streak, uncheckDate);
            // Recalculate everything
            recalculateStreakStats(streak);
        }

        streak = streakRepository.save(streak);
        return mapToResponse(streak);
    }

    public StreakMetricsResponse getMetrics(Long id, Long userId) {
        Streak streak = getStreakOrThrow(id, userId);
        return StreakMetricsResponse.builder()
                .currentStreak(streak.getCurrentStreak())
                .longestStreak(streak.getLongestStreak())
                .build();
    }

    public List<StreakResponse> getAllStreaks(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return streakRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public StreakResponse getStreak(Long id, Long userId) {
        return mapToResponse(getStreakOrThrow(id, userId));
    }

    public List<StreakEntryResponse> getStreakHistory(Long id, LocalDate startDate, LocalDate endDate, Long userId) {
        Streak streak = getStreakOrThrow(id, userId);
        List<StreakEntry> entries = streakEntryRepository.findByStreakAndCheckInDateBetween(streak, startDate, endDate);
        return entries.stream()
                .map(e -> StreakEntryResponse.builder().checkInDate(e.getCheckInDate()).build())
                .collect(Collectors.toList());
    }

    public List<StreakEntryResponse> getStreakHistory(Long id, String range, Long userId) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate;

        switch (range) {
            case "week":
                startDate = endDate.minusWeeks(1);
                break;
            case "month":
                startDate = endDate.minusMonths(1);
                break;
            case "last5":
                startDate = endDate.minusDays(4);
                break;
            default:
                startDate = endDate.minusMonths(1);
        }
        return getStreakHistory(id, startDate, endDate, userId);
    }

    private Streak getStreakOrThrow(Long id, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return streakRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Streak not found or access denied"));
    }

    private void recalculateStreakStats(Streak streak) {
        List<StreakEntry> entries = streakEntryRepository.findAllByStreakOrderByCheckInDateAsc(streak);

        int currentStreak = 0;
        int longestStreak = 0;
        int tempStreak = 0;
        LocalDate lastDate = null;
        LocalDate today = LocalDate.now();

        for (StreakEntry entry : entries) {
            LocalDate date = entry.getCheckInDate();

            if (lastDate == null) {
                tempStreak = 1;
            } else {
                if (date.equals(lastDate.plusDays(1))) {
                    tempStreak++;
                } else if (!date.equals(lastDate)) {
                    tempStreak = 1;
                }
            }
            lastDate = date;

            if (tempStreak > longestStreak) {
                longestStreak = tempStreak;
            }
        }

        if (lastDate != null && (lastDate.equals(today) || lastDate.equals(today.minusDays(1)))) {
            currentStreak = tempStreak;
        } else {
            currentStreak = 0;
        }

        streak.setCurrentStreak(currentStreak);
        streak.setLongestStreak(longestStreak);
        streak.setLastCheckIn(lastDate);
    }

    private StreakResponse mapToResponse(Streak streak) {
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.minusDays(6);

        List<StreakEntry> entries = streakEntryRepository.findByStreakAndCheckInDateBetween(streak, weekStart, today);
        List<LocalDate> historyDates = entries.stream().map(StreakEntry::getCheckInDate).collect(Collectors.toList());

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
