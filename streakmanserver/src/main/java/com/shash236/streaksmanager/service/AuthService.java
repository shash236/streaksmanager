package com.shash236.streaksmanager.service;

import com.shash236.streaksmanager.dto.AuthResponse;
import com.shash236.streaksmanager.model.User;
import com.shash236.streaksmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;

    // In-memory stores for MVP
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();
    private final Map<String, Long> tokenStore = new ConcurrentHashMap<>();

    private final EmailService emailService;

    public void sendOtp(String identifier) {
        // Generate 6-digit OTP
        String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
        otpStore.put(identifier, otp);

        // Log it for local testing
        log.info("OTP for {}: {}", identifier, otp);

        // Send via Email if identifier is an email
        if (identifier.contains("@")) {
            emailService.sendOtpEmail(identifier, otp);
        }
    }

    public AuthResponse verifyOtp(String identifier, String otp) {
        if (!otp.equals(otpStore.get(identifier))) {
            throw new RuntimeException("Invalid OTP");
        }

        // Clear OTP
        otpStore.remove(identifier);

        // Find or create user
        User user = null;
        if (identifier.contains("@")) {
            user = userRepository.findByEmail(identifier)
                    .orElseGet(() -> userRepository.save(User.builder().email(identifier).build()));
        } else {
            user = userRepository.findByPhone(identifier)
                    .orElseGet(() -> userRepository.save(User.builder().phone(identifier).build()));
        }

        // Generate Token
        String token = UUID.randomUUID().toString();
        tokenStore.put(token, user.getId());

        return AuthResponse.builder()
                .token(token)
                .user(user)
                .build();
    }

    public Long getUserIdFromToken(String token) {
        return tokenStore.get(token);
    }

    public void logout(String token) {
        tokenStore.remove(token);
    }
}
