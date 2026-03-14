package com.books.exchange.payloads;

import com.books.exchange.entities.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private int id;
    private String name;
    private String email;
    private String role;
    private String message;
    
    public static AuthResponse success(String token, User user) {
        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .message("Authentication successful")
                .build();
    }
    
    public static AuthResponse error(String message) {
        return AuthResponse.builder()
                .message(message)
                .build();
    }
}

