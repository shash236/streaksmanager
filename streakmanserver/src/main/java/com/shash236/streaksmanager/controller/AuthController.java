package com.shash236.streaksmanager.controller;

import com.shash236.streaksmanager.dto.AuthRequest;
import com.shash236.streaksmanager.dto.AuthResponse;
import com.shash236.streaksmanager.dto.VerifyRequest;
import com.shash236.streaksmanager.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow frontend access
public class AuthController {

    private final AuthService authService;

    @PostMapping("/otp/send")
    public ResponseEntity<String> sendOtp(@RequestBody AuthRequest request) {
        String identifier = request.getEmail() != null ? request.getEmail() : request.getPhone();
        if (identifier == null) {
            return ResponseEntity.badRequest().body("Email or Phone required");
        }
        authService.sendOtp(identifier);
        return ResponseEntity.ok("OTP Request Received");
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestBody VerifyRequest request) {
        String identifier = request.getEmail() != null ? request.getEmail() : request.getPhone();
        if (identifier == null) {
            return ResponseEntity.badRequest().build();
        }
        try {
            AuthResponse response = authService.verifyOtp(identifier, request.getOtp());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            authService.logout(token.substring(7));
        }
        return ResponseEntity.ok().build();
    }
}
