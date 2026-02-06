package com.shash236.streaksmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Entity
@Table(name = "streaks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Streak {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(nullable = false)
    private Integer currentStreak;

    @Column(nullable = false)
    private Integer longestStreak;

    @Column(nullable = false)
    private Boolean active;

    private Long lastCheckIn;

    private Long createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "streak", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<StreakEntry> entries;

    private Long updatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = System.currentTimeMillis();
        }
        if (updatedAt == null) {
            updatedAt = System.currentTimeMillis();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = System.currentTimeMillis();
    }
}
