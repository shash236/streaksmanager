package com.shash236.streaksmanager.util;

import com.shash236.streaksmanager.model.Streak;
import com.shash236.streaksmanager.model.StreakEntry;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class StreakCalculator {

    private static final long MILLIS_PER_DAY = 24 * 60 * 60 * 1000L;

    /**
     * Recalculates the current and longest streak stats based on the provided
     * history of entries.
     * The entries list MUST be sorted by checkInDate ascending.
     * The passed Streak object is modified in place.
     */
    public void recalculateStatistics(Streak streak, List<StreakEntry> entries) {
        int currentStreak = 0;
        int longestStreak = 0;
        int tempStreak = 0;
        Long lastDate = null;
        Long today = normalizeDate(System.currentTimeMillis());

        for (StreakEntry entry : entries) {
            Long date = entry.getCheckInDate();

            if (lastDate == null) {
                tempStreak = 1;
            } else {
                long diff = date - lastDate;
                // Strict streak logic: Check-ins must be consecutive days (diff <= 1 day).
                // Normalized dates ensures diff is multiple of MILLIS_PER_DAY.
                if (diff <= MILLIS_PER_DAY) {
                    if (diff > 0) {
                        tempStreak++;
                    }
                    // if diff == 0, it's a duplicate entry (safe to ignore)
                } else {
                    // Gap > 1 day, reset
                    tempStreak = 1;
                }
            }
            lastDate = date;

            if (tempStreak > longestStreak) {
                longestStreak = tempStreak;
            }
        }

        // Logic to set current streak
        // Check if the last check-in is recent enough to keep the streak alive.
        // We use a 2-day window (today - 2 * MILLIS_PER_DAY) to accommodate users in
        // timezones
        // ahead of UTC where "Yesterday" local might normalize to "2 days ago" UTC.
        if (lastDate != null && lastDate >= today - 2 * MILLIS_PER_DAY) {
            currentStreak = tempStreak;
        } else {
            currentStreak = 0;
        }

        streak.setCurrentStreak(currentStreak);
        streak.setLongestStreak(longestStreak);
        streak.setLastCheckIn(lastDate);
    }

    public Long normalizeDate(Long epochMillis) {
        if (epochMillis == null)
            return null;
        // Floor to the beginning of the UTC day (00:00:00)
        return epochMillis - (epochMillis % MILLIS_PER_DAY);
    }
}
