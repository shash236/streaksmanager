package com.shash236.streaksmanager.repository;

import com.shash236.streaksmanager.model.Streak;
import com.shash236.streaksmanager.model.StreakEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StreakEntryRepository extends JpaRepository<StreakEntry, Long> {
    List<StreakEntry> findByStreakAndCheckInDateBetween(Streak streak, LocalDate startDate, LocalDate endDate);

    Optional<StreakEntry> findByStreakAndCheckInDate(Streak streak, LocalDate checkInDate);

    void deleteByStreakAndCheckInDate(Streak streak, LocalDate checkInDate);
}
