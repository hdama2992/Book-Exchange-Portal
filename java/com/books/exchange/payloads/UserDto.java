package com.books.exchange.payloads;

import com.books.exchange.entities.User.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

    private int id;

    @Size(min = 2, message = "Name must be at least 2 characters")
    private String name;

    @Email(message = "Email address is not valid")
    private String email;

    private String contactNo;

    private String address;

    private String profilePicture;

    private Role role;

    private boolean enabled;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private int booksCount;
}
