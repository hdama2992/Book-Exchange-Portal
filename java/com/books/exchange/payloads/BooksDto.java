package com.books.exchange.payloads;

import com.books.exchange.entities.Books.BookStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BooksDto {

    private int bookId;
    private String bookTitle;
    private String author;
    private int edition;
    private int year;
    private String description;
    private String photos;
    private String isbn;
    private String genre;
    private String bookCondition;
    private BookStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int ownerId;
    private String ownerName;
}
