package com.shash236.streaksmanager.controller;

import com.shash236.streaksmanager.dto.*;
import com.shash236.streaksmanager.service.StreakCheckInService;
import com.shash236.streaksmanager.service.StreakService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/streaks")
@RequiredArgsConstructor
@Tag(name = "Streaks", description = "API for managing streaks")
public class StreakController {

    private final StreakService streakService;
    private final StreakCheckInService streakCheckInService;

    @PostMapping
    @Operation(summary = "Create a new streak")
    public ResponseEntity<StreakResponse> createStreak(
            @Valid @RequestBody CreateStreakRequest request,
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(streakService.createStreak(request, userId));
    }

    @GetMapping
    @Operation(summary = "Get all streaks")
    public ResponseEntity<java.util.List<StreakResponse>> getAllStreaks(@AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(streakService.getAllStreaks(userId));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing streak")
    public ResponseEntity<StreakResponse> updateStreak(
            @PathVariable Long id,
            @RequestBody UpdateStreakRequest request,
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(streakService.updateStreak(id, request, userId));
    }

    @PostMapping("/{id}/start")
    @Operation(summary = "Start a streak (activate)")
    public ResponseEntity<StreakResponse> startStreak(@PathVariable Long id, @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(streakService.startStreak(id, userId));
    }

    @PostMapping("/{id}/pause")
    @Operation(summary = "Pause a streak")
    public ResponseEntity<StreakResponse> pauseStreak(@PathVariable Long id, @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(streakService.pauseStreak(id, userId));
    }

    @PostMapping("/{id}/archive")
    @Operation(summary = "Archive a streak")
    public ResponseEntity<StreakResponse> archiveStreak(@PathVariable Long id, @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(streakService.archiveStreak(id, userId));
    }

    @PostMapping("/{id}/checkin")
    @Operation(summary = "Mark streak as done for today or specific date")
    public ResponseEntity<StreakResponse> checkIn(
            @PathVariable Long id,
            @RequestParam(required = false) Long date,
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(streakCheckInService.checkIn(id, date, userId));
    }

    @PostMapping("/{id}/uncheck")
    @Operation(summary = "Mark streak as undone for today or specific date")
    public ResponseEntity<StreakResponse> uncheck(
            @PathVariable Long id,
            @RequestParam(required = false) Long date,
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(streakCheckInService.uncheck(id, date, userId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get streak details")
    public ResponseEntity<StreakResponse> getStreak(@PathVariable Long id, @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(streakService.getStreak(id, userId));
    }

    @GetMapping("/{id}/metrics")
    @Operation(summary = "Get streak metrics")
    public ResponseEntity<StreakMetricsResponse> getMetrics(@PathVariable Long id,
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(streakService.getMetrics(id, userId));
    }

    @GetMapping("/{id}/history")
    @Operation(summary = "Get streak history")
    public ResponseEntity<java.util.List<StreakEntryResponse>> getHistory(
            @PathVariable Long id,
            @RequestParam(required = false) String range,
            @RequestParam(required = false) Long startDate,
            @RequestParam(required = false) Long endDate,
            @AuthenticationPrincipal Long userId) {

        if (startDate != null && endDate != null) {
            return ResponseEntity.ok(streakService.getStreakHistory(id, startDate, endDate, userId));
        }

        // Fallback to range string if explicit dates not provided
        return ResponseEntity.ok(streakService.getStreakHistory(id, range != null ? range : "month", userId));
    }

    @PostMapping("/{id}/recalculate")
    @Operation(summary = "Force recalculate streak statistics")
    public ResponseEntity<StreakResponse> recalculateStreak(@PathVariable Long id,
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(streakService.recalculateStreak(id, userId));
    }
}
