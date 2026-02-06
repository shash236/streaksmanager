package com.shash236.streaksmanager.repository;

import com.shash236.streaksmanager.model.Streak;
import com.shash236.streaksmanager.model.StreakEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StreakEntryRepository extends JpaRepository<StreakEntry, Long> {
    List<StreakEntry> findByStreakAndCheckInDateBetween(Streak streak, Long startDate, Long endDate);

    Optional<StreakEntry> findByStreakAndCheckInDate(Streak streak, Long checkInDate);

    void deleteByStreakAndCheckInDate(Streak streak, Long checkInDate);

    List<StreakEntry> findAllByStreakOrderByCheckInDateAsc(Streak streak);
}
