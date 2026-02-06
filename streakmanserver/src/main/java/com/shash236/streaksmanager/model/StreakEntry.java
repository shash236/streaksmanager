package com.shash236.streaksmanager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private Long checkInDate;

    private Long createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = System.currentTimeMillis();
        }
    }
}
