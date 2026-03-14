package com.books.exchange.payloads;

import java.time.LocalDateTime;

import com.books.exchange.entities.Requests.RequestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReqDto {

    private int reqId;
    private int requesterId;
    private String requesterName;
    private int ownerId;
    private String ownerName;
    private int bookId;
    private String bookTitle;
    private String bookAuthor;
    private RequestStatus status;
    private LocalDateTime requestDate;
    private LocalDateTime issueDate;
    private LocalDateTime expectedReturnDate;
    private LocalDateTime actualReturnDate;
    private String message;
}

