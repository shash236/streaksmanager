package com.shash236.streaksmanager.controller;

import com.shash236.streaksmanager.dto.*;
import com.shash236.streaksmanager.service.StreakService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/streaks")
@RequiredArgsConstructor
@Tag(name = "Streaks", description = "API for managing streaks")
public class StreakController {

    private final StreakService streakService;

    @PostMapping
    @Operation(summary = "Create a new streak")
    public ResponseEntity<StreakResponse> createStreak(@Valid @RequestBody CreateStreakRequest request) {
        return ResponseEntity.ok(streakService.createStreak(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing streak")
    public ResponseEntity<StreakResponse> updateStreak(@PathVariable Long id,
            @RequestBody UpdateStreakRequest request) {
        return ResponseEntity.ok(streakService.updateStreak(id, request));
    }

    @PostMapping("/{id}/start")
    @Operation(summary = "Start a streak (activate)")
    public ResponseEntity<StreakResponse> startStreak(@PathVariable Long id) {
        return ResponseEntity.ok(streakService.startStreak(id));
    }

    @PostMapping("/{id}/pause")
    @Operation(summary = "Pause a streak")
    public ResponseEntity<StreakResponse> pauseStreak(@PathVariable Long id) {
        return ResponseEntity.ok(streakService.pauseStreak(id));
    }

    @PostMapping("/{id}/archive")
    @Operation(summary = "Archive a streak")
    public ResponseEntity<StreakResponse> archiveStreak(@PathVariable Long id) {
        return ResponseEntity.ok(streakService.archiveStreak(id));
    }

    @PostMapping("/{id}/checkin")
    @Operation(summary = "Mark streak as done for today")
    public ResponseEntity<StreakResponse> checkIn(@PathVariable Long id) {
        return ResponseEntity.ok(streakService.checkIn(id));
    }

    @PostMapping("/{id}/uncheck")
    @Operation(summary = "Mark streak as undone for today")
    public ResponseEntity<StreakResponse> uncheck(@PathVariable Long id) {
        return ResponseEntity.ok(streakService.uncheck(id));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get streak details")
    public ResponseEntity<StreakResponse> getStreak(@PathVariable Long id) {
        return ResponseEntity.ok(streakService.getStreak(id));
    }

    @GetMapping("/{id}/metrics")
    @Operation(summary = "Get streak metrics")
    public ResponseEntity<StreakMetricsResponse> getMetrics(@PathVariable Long id) {
        return ResponseEntity.ok(streakService.getMetrics(id));
    }

    @GetMapping("/{id}/history")
    @Operation(summary = "Get streak history")
    public ResponseEntity<java.util.List<StreakEntryResponse>> getHistory(
            @PathVariable Long id,
            @RequestParam(defaultValue = "month") String range) {
        return ResponseEntity.ok(streakService.getStreakHistory(id, range));
    }
}
