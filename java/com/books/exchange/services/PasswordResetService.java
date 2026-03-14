package com.books.exchange.services;

import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.books.exchange.entities.PasswordResetToken;
import com.books.exchange.entities.User;
import com.books.exchange.exceptions.ResourceNotFoundException;
import com.books.exchange.repositories.PasswordResetTokenRepo;
import com.books.exchange.repositories.UserRepo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final PasswordResetTokenRepo tokenRepo;
    private final UserRepo userRepo;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void requestPasswordReset(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        // Delete any existing tokens for this user
        tokenRepo.deleteByUser(user);

        // Generate new token
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .used(false)
                .build();

        tokenRepo.save(resetToken);
        log.info("Password reset token created for user: {}", email);

        // Send email
        emailService.sendPasswordResetEmail(email, token);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepo.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid password reset token"));

        if (!resetToken.isValid()) {
            throw new IllegalArgumentException("Password reset token has expired or already been used");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);

        // Mark token as used
        resetToken.setUsed(true);
        tokenRepo.save(resetToken);

        log.info("Password reset successful for user: {}", user.getEmail());
    }

    public boolean validateToken(String token) {
        return tokenRepo.findByToken(token)
                .map(PasswordResetToken::isValid)
                .orElse(false);
    }

    @Transactional
    public void cleanupExpiredTokens() {
        tokenRepo.deleteExpiredTokens();
        log.info("Cleaned up expired password reset tokens");
    }
}

