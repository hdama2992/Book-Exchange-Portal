package com.books.exchange.controllers;

import com.books.exchange.entities.User;
import com.books.exchange.exceptions.UserAlreadyExistsException;
import com.books.exchange.payloads.AuthRequest;
import com.books.exchange.payloads.AuthResponse;
import com.books.exchange.payloads.NewPasswordRequest;
import com.books.exchange.payloads.PasswordResetRequest;
import com.books.exchange.payloads.RegisterRequest;
import com.books.exchange.repositories.UserRepo;
import com.books.exchange.security.JwtService;
import com.books.exchange.services.EmailService;
import com.books.exchange.services.PasswordResetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
@Tag(name = "Authentication", description = "Auth and password reset APIs")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final PasswordResetService passwordResetService;
    private final EmailService emailService;

    @Value("${spring.security.oauth2.client.registration.google.client-id:}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.github.client-id:}")
    private String githubClientId;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(AuthResponse.error("An account already exists with this email"));
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .contactNo(request.getContactNo())
                .address(request.getAddress())
                .role(User.Role.USER)
                .enabled(true)
                .build();

        userRepo.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(AuthResponse.success(token, user));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponse.error("Invalid email or password"));
        }

        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        return ResponseEntity.ok(AuthResponse.success(token, user));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String email = jwtService.extractUsername(token);
            User user = userRepo.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            return ResponseEntity.ok(AuthResponse.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .role(user.getRole().name())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponse.error("Invalid token"));
        }
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset email")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody PasswordResetRequest request) {
        try {
            passwordResetService.requestPasswordReset(request.getEmail());
            return ResponseEntity.ok(Map.of(
                "message", "If an account exists with this email, you will receive a password reset link"
            ));
        } catch (Exception e) {
            // Don't reveal whether email exists
            return ResponseEntity.ok(Map.of(
                "message", "If an account exists with this email, you will receive a password reset link"
            ));
        }
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password with token")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody NewPasswordRequest request) {
        try {
            passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Password reset successful"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/validate-reset-token")
    @Operation(summary = "Validate password reset token")
    public ResponseEntity<Map<String, Boolean>> validateResetToken(@RequestParam String token) {
        boolean isValid = passwordResetService.validateToken(token);
        return ResponseEntity.ok(Map.of("valid", isValid));
    }

    @GetMapping("/oauth-providers")
    @Operation(summary = "Get available OAuth providers")
    public ResponseEntity<Map<String, Object>> getOAuthProviders() {
        Map<String, Object> providers = new HashMap<>();
        providers.put("google", googleClientId != null && !googleClientId.isEmpty());
        providers.put("github", githubClientId != null && !githubClientId.isEmpty());
        return ResponseEntity.ok(providers);
    }
}

