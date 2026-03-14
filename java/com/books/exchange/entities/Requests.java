package com.books.exchange.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.PrePersist;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="requests")
@NoArgsConstructor
@Getter
@Setter
public class Requests {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int reqId;

	@ManyToOne
	@JoinColumn(name = "requester_id", nullable = false)
	private User requester;

	@ManyToOne
	@JoinColumn(name = "owner_id", nullable = false)
	private User owner;

	@ManyToOne
	@JoinColumn(name = "book_id", nullable = false)
	private Books book;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private RequestStatus status = RequestStatus.PENDING;

	@Column(nullable = false)
	private LocalDateTime requestDate;

	private LocalDateTime issueDate;

	private LocalDateTime expectedReturnDate;

	private LocalDateTime actualReturnDate;

	private String message;

	@PrePersist
	protected void onCreate() {
		requestDate = LocalDateTime.now();
	}

	public enum RequestStatus {
		PENDING,
		APPROVED,
		REJECTED,
		BORROWED,
		RETURNED,
		OVERDUE,
		CANCELLED
	}
}
