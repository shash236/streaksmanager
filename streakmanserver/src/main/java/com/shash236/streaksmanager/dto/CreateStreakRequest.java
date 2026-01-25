package com.shash236.streaksmanager.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateStreakRequest {
    @NotBlank(message = "Title is required")
    private String title;
    private String description;
}
