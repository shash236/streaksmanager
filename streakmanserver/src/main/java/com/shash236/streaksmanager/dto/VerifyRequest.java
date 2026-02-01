package com.shash236.streaksmanager.dto;

import lombok.Data;

@Data
public class VerifyRequest {
    private String email;
    private String phone;
    private String otp;
}
