package com.books.exchange.entities;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="users")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
public class User {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

	@Column(name="user_name", nullable = false, length = 50)
    @Size(min = 2, message = "Name must be at least 2 characters")
	private String name;

	@Email(message = "Please enter a valid email address")
	@Column(name="email", unique = true, nullable = false, length = 100)
	private String email;

	@Column(name="contact_no", length = 15)
	private String contactNo;

	@Column(nullable = false, length = 255)
	private String password;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Role role = Role.USER;

	private String address;

	@Column(length = 255)
	private String profilePicture;

	@Column(nullable = false)
	private boolean enabled = true;

	@Column(name="oauth_provider", length = 20)
	private String oauthProvider;

	@Column(name="created_at")
	private LocalDateTime createdAt;

	@Column(name="updated_at")
	private LocalDateTime updatedAt;

	@OneToMany(mappedBy = "users")
	private Set<Books> books = new HashSet<>();

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
		updatedAt = LocalDateTime.now();
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();
	}

	public enum Role {
		USER,
		ADMIN
	}
}
