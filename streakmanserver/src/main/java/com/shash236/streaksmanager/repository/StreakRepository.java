package com.shash236.streaksmanager.repository;

import com.shash236.streaksmanager.model.Streak;
import com.shash236.streaksmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StreakRepository extends JpaRepository<Streak, Long> {
    java.util.List<Streak> findByUserOrderByCreatedAtDesc(User user);

    java.util.Optional<Streak> findByIdAndUser(Long id, User user);
}
