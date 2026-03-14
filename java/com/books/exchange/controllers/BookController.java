package com.books.exchange.controllers;

import java.util.List;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.books.exchange.entities.Books.BookStatus;
import com.books.exchange.payloads.Apiresponse;
import com.books.exchange.payloads.BooksDto;
import com.books.exchange.services.BooksService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class BookController {

    private final BooksService bookService;

    @PostMapping
    public ResponseEntity<BooksDto> publishBook(
            @Valid @RequestBody BooksDto bookDto,
            @RequestParam int userId) {
        BooksDto publishedBook = bookService.publishBook(bookDto, userId);
        return new ResponseEntity<>(publishedBook, HttpStatus.CREATED);
    }

    @PutMapping("/{bookId}")
    public ResponseEntity<BooksDto> updateBookInfo(
            @Valid @RequestBody BooksDto bookDto,
            @PathVariable int bookId) {
        BooksDto updatedBook = bookService.updateBookInfo(bookDto, bookId);
        return ResponseEntity.ok(updatedBook);
    }

    @DeleteMapping("/{bookId}")
    public ResponseEntity<Apiresponse> deletePublishedItem(@PathVariable int bookId) {
        bookService.deletePublishedItem(bookId);
        return ResponseEntity.ok(new Apiresponse("Book deleted successfully", true));
    }

    @GetMapping
    public ResponseEntity<List<BooksDto>> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    @GetMapping("/available")
    public ResponseEntity<List<BooksDto>> getAvailableBooks() {
        return ResponseEntity.ok(bookService.getAvailableBooks());
    }

    @GetMapping("/{bookId}")
    public ResponseEntity<BooksDto> getBookById(@PathVariable int bookId) {
        return ResponseEntity.ok(bookService.getBookById(bookId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BooksDto>> getBooksByUser(@PathVariable int userId) {
        return ResponseEntity.ok(bookService.getBooksByUser(userId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<BooksDto>> searchBooks(@RequestParam String query) {
        return ResponseEntity.ok(bookService.searchBooks(query));
    }

    @GetMapping("/search/available")
    public ResponseEntity<List<BooksDto>> searchAvailableBooks(@RequestParam String query) {
        return ResponseEntity.ok(bookService.searchAvailableBooks(query));
    }

    @GetMapping("/genre/{genre}")
    public ResponseEntity<List<BooksDto>> getBooksByGenre(@PathVariable String genre) {
        return ResponseEntity.ok(bookService.getBooksByGenre(genre));
    }

    @PatchMapping("/{bookId}/status")
    public ResponseEntity<BooksDto> updateBookStatus(
            @PathVariable int bookId,
            @RequestParam BookStatus status) {
        return ResponseEntity.ok(bookService.updateBookStatus(bookId, status));
    }
}
