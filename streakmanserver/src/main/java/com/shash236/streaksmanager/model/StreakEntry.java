package com.shash236.streaksmanager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "streak_entries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StreakEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "streak_id", nullable = false)
    private Streak streak;

    @Column(nullable = false)
    private LocalDate checkInDate;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
