package com.shash236.streaksmanager.repository;

import com.shash236.streaksmanager.model.Streak;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StreakRepository extends JpaRepository<Streak, Long> {
}
