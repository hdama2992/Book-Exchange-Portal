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
import javax.persistence.Table;
import javax.persistence.PrePersist;

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
