package com.shash236.streaksmanager.service;

import com.shash236.streaksmanager.dto.*;
import com.shash236.streaksmanager.mapper.StreakDTOMapper;
import com.shash236.streaksmanager.model.Streak;
import com.shash236.streaksmanager.model.StreakEntry;
import com.shash236.streaksmanager.model.User;
import com.shash236.streaksmanager.repository.StreakEntryRepository;
import com.shash236.streaksmanager.repository.StreakRepository;
import com.shash236.streaksmanager.repository.UserRepository;
import com.shash236.streaksmanager.util.StreakCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StreakService {

    private final StreakRepository streakRepository;
    private final StreakEntryRepository streakEntryRepository;
    private final UserRepository userRepository;
    private final StreakCalculator streakCalculator;
    private final StreakDTOMapper streakDTOMapper;

    private static final long MILLIS_PER_DAY = 24 * 60 * 60 * 1000L;

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
        return streakDTOMapper.mapToResponse(streak);
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
        return streakDTOMapper.mapToResponse(streak);
    }

    @Transactional
    public StreakResponse startStreak(Long id, Long userId) {
        Streak streak = getStreakOrThrow(id, userId);
        streak.setActive(true);
        streak = streakRepository.save(streak);
        return streakDTOMapper.mapToResponse(streak);
    }

    @Transactional
    public StreakResponse pauseStreak(Long id, Long userId) {
        Streak streak = getStreakOrThrow(id, userId);
        streak.setActive(false);
        streak = streakRepository.save(streak);
        return streakDTOMapper.mapToResponse(streak);
    }

    @Transactional
    public StreakResponse archiveStreak(Long id, Long userId) {
        Streak streak = getStreakOrThrow(id, userId);
        streakRepository.delete(streak);
        return StreakResponse.builder().id(id).title("Archived").build();
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
                .map(streakDTOMapper::mapToResponse)
                .collect(Collectors.toList());
    }

    public StreakResponse getStreak(Long id, Long userId) {
        return streakDTOMapper.mapToResponse(getStreakOrThrow(id, userId));
    }

    public List<StreakEntryResponse> getStreakHistory(Long id, Long startDate, Long endDate, Long userId) {
        Streak streak = getStreakOrThrow(id, userId);
        Long normStart = streakCalculator.normalizeDate(startDate);
        Long normEnd = streakCalculator.normalizeDate(endDate);

        List<StreakEntry> entries = streakEntryRepository.findByStreakAndCheckInDateBetween(streak, normStart, normEnd);
        return entries.stream()
                .map(e -> StreakEntryResponse.builder().checkInDate(e.getCheckInDate()).build())
                .collect(Collectors.toList());
    }

    public List<StreakEntryResponse> getStreakHistory(Long id, String range, Long userId) {
        long now = System.currentTimeMillis();
        Long endDate = streakCalculator.normalizeDate(now);
        Long startDate;

        switch (range) {
            case "week":
                startDate = endDate - (7 * MILLIS_PER_DAY);
                break;
            case "month":
                startDate = endDate - (30 * MILLIS_PER_DAY);
                break;
            case "last5":
                startDate = endDate - (4 * MILLIS_PER_DAY);
                break;
            default:
                startDate = endDate - (30 * MILLIS_PER_DAY);
        }
        return getStreakHistory(id, startDate, endDate, userId);
    }

    @Transactional
    public StreakResponse recalculateStreak(Long id, Long userId) {
        Streak streak = getStreakOrThrow(id, userId);
        // Fetch all entries including the new one and recalculate
        List<StreakEntry> allEntries = streakEntryRepository.findAllByStreakOrderByCheckInDateAsc(streak);
        streakCalculator.recalculateStatistics(streak, allEntries);
        streak = streakRepository.save(streak);
        return streakDTOMapper.mapToResponse(streak);
    }

    private Streak getStreakOrThrow(Long id, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return streakRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Streak not found or access denied"));
    }
}
