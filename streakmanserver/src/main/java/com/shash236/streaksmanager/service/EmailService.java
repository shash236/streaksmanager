package com.shash236.streaksmanager.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender javaMailSender;

    public void sendOtpEmail(String to, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@streakmanager.com");
            message.setTo(to);
            message.setSubject("Your OTP for Streaks Manager");
            message.setText("Your OTP is: " + otp);
            javaMailSender.send(message);
            log.info("OTP email sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}", to, e);
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }
}
