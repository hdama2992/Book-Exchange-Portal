package com.books.exchange.entities;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="books")
@NoArgsConstructor
@Getter
@Setter
public class Books {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int book_id;

	@Column(name="title", length = 100, nullable = false)
	private String bookTitle;

	@Column(name="author", length = 100, nullable = false)
	private String author;

	@Column(name="edition")
	private int edition;

	@Column(name="year", nullable = false)
	private int year;

	@Column(name="description", length = 500)
	private String description;

	@Column(length = 255)
	private String photos;

	@Column(name="isbn", length = 20)
	private String isbn;

	@Column(name="genre", length = 50)
	private String genre;

	@Column(name="condition", length = 50)
	private String bookCondition;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private BookStatus status = BookStatus.AVAILABLE;

	@Column(name="created_at")
	private LocalDateTime createdAt;

	@Column(name="updated_at")
	private LocalDateTime updatedAt;

	@ManyToOne
	@JoinColumn(name="user_id")
	private User users;

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
		updatedAt = LocalDateTime.now();
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();
	}

	public enum BookStatus {
		AVAILABLE,
		BORROWED,
		RESERVED,
		UNAVAILABLE
	}
}
