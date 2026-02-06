package com.shash236.streaksmanager.service;

import com.shash236.streaksmanager.dto.StreakResponse;
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

@Service
@RequiredArgsConstructor
public class StreakCheckInService {

    private final StreakRepository streakRepository;
    private final StreakEntryRepository streakEntryRepository;
    private final UserRepository userRepository;
    private final StreakCalculator streakCalculator;
    private final StreakDTOMapper streakDTOMapper;

    @Transactional
    public StreakResponse checkIn(Long id, Long date, Long userId) {
        Streak streak = getStreakOrThrow(id, userId);

        // Use provided date directly if present (Trust the UI), otherwise use server
        // time normalized
        Long checkInDate;
        if (date != null) {
            checkInDate = date;
        } else {
            checkInDate = streakCalculator.normalizeDate(System.currentTimeMillis());
        }

        // Idempotency: Duplicate check-in for the same day is ignored
        if (streakEntryRepository.findByStreakAndCheckInDate(streak, checkInDate).isPresent()) {
            return streakDTOMapper.mapToResponse(streak);
        }

        // Create the new entry (this MUST happen before recalculation so the history is
        // complete)
        StreakEntry entry = StreakEntry.builder()
                .streak(streak)
                .checkInDate(checkInDate)
                .build();
        streakEntryRepository.save(entry);

        // Note: Recalculation is now deferred to a separate API call to improve
        // performance
        // and reduce race conditions.

        return streakDTOMapper.mapToResponse(streak);
    }

    @Transactional
    public StreakResponse uncheck(Long id, Long date, Long userId) {
        Streak streak = getStreakOrThrow(id, userId);

        Long uncheckDate;
        if (date != null) {
            uncheckDate = date;
        } else {
            uncheckDate = streakCalculator.normalizeDate(System.currentTimeMillis());
        }

        if (streakEntryRepository.findByStreakAndCheckInDate(streak, uncheckDate).isPresent()) {
            streakEntryRepository.deleteByStreakAndCheckInDate(streak, uncheckDate);
            // Note: Recalculation is deferred.
        }

        return streakDTOMapper.mapToResponse(streak);
    }

    private Streak getStreakOrThrow(Long id, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return streakRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Streak not found or access denied"));
    }
}
