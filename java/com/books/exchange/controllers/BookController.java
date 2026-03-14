package com.books.exchange.controllers;

import java.util.List;
import java.util.Map;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.books.exchange.entities.Books.BookStatus;
import com.books.exchange.payloads.Apiresponse;
import com.books.exchange.payloads.BooksDto;
import com.books.exchange.payloads.PageResponse;
import com.books.exchange.services.BooksService;
import com.books.exchange.services.BookRecognitionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000"})
@Tag(name = "Books", description = "Book management APIs")
public class BookController {

    private final BooksService bookService;
    private final BookRecognitionService bookRecognitionService;

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
    @Operation(summary = "Get all books (non-paginated)")
    public ResponseEntity<List<BooksDto>> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    @GetMapping("/page")
    @Operation(summary = "Get all books with pagination")
    public ResponseEntity<PageResponse<BooksDto>> getAllBooksPaginated(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(bookService.getAllBooks(pageNumber, pageSize, sortBy, sortDir));
    }

    @GetMapping("/available")
    @Operation(summary = "Get all available books (non-paginated)")
    public ResponseEntity<List<BooksDto>> getAvailableBooks() {
        return ResponseEntity.ok(bookService.getAvailableBooks());
    }

    @GetMapping("/available/page")
    @Operation(summary = "Get available books with pagination")
    public ResponseEntity<PageResponse<BooksDto>> getAvailableBooksPaginated(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(bookService.getAvailableBooks(pageNumber, pageSize, sortBy, sortDir));
    }

    @GetMapping("/{bookId}")
    @Operation(summary = "Get book by ID")
    public ResponseEntity<BooksDto> getBookById(@PathVariable int bookId) {
        return ResponseEntity.ok(bookService.getBookById(bookId));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get books by user (non-paginated)")
    public ResponseEntity<List<BooksDto>> getBooksByUser(@PathVariable int userId) {
        return ResponseEntity.ok(bookService.getBooksByUser(userId));
    }

    @GetMapping("/user/{userId}/page")
    @Operation(summary = "Get books by user with pagination")
    public ResponseEntity<PageResponse<BooksDto>> getBooksByUserPaginated(
            @PathVariable int userId,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ResponseEntity.ok(bookService.getBooksByUser(userId, pageNumber, pageSize));
    }

    @GetMapping("/search")
    @Operation(summary = "Search books (non-paginated)")
    public ResponseEntity<List<BooksDto>> searchBooks(@RequestParam String query) {
        return ResponseEntity.ok(bookService.searchBooks(query));
    }

    @GetMapping("/search/page")
    @Operation(summary = "Search books with pagination")
    public ResponseEntity<PageResponse<BooksDto>> searchBooksPaginated(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ResponseEntity.ok(bookService.searchBooks(query, pageNumber, pageSize));
    }

    @GetMapping("/search/available")
    @Operation(summary = "Search available books (non-paginated)")
    public ResponseEntity<List<BooksDto>> searchAvailableBooks(@RequestParam String query) {
        return ResponseEntity.ok(bookService.searchAvailableBooks(query));
    }

    @GetMapping("/search/available/page")
    @Operation(summary = "Search available books with pagination")
    public ResponseEntity<PageResponse<BooksDto>> searchAvailableBooksPaginated(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ResponseEntity.ok(bookService.searchAvailableBooks(query, pageNumber, pageSize));
    }

    @GetMapping("/genre/{genre}")
    @Operation(summary = "Get books by genre (non-paginated)")
    public ResponseEntity<List<BooksDto>> getBooksByGenre(@PathVariable String genre) {
        return ResponseEntity.ok(bookService.getBooksByGenre(genre));
    }

    @GetMapping("/genre/{genre}/page")
    @Operation(summary = "Get books by genre with pagination")
    public ResponseEntity<PageResponse<BooksDto>> getBooksByGenrePaginated(
            @PathVariable String genre,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ResponseEntity.ok(bookService.getBooksByGenre(genre, pageNumber, pageSize));
    }

    @PatchMapping("/{bookId}/status")
    @Operation(summary = "Update book status")
    public ResponseEntity<BooksDto> updateBookStatus(
            @PathVariable int bookId,
            @RequestParam BookStatus status) {
        return ResponseEntity.ok(bookService.updateBookStatus(bookId, status));
    }

    @PostMapping("/recognize")
    @Operation(summary = "Recognize book details from cover image using AI")
    public ResponseEntity<Map<String, String>> recognizeBook(@RequestBody Map<String, String> request) {
        String imageUrl = request.get("imageUrl");
        if (imageUrl == null || imageUrl.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Image URL is required"));
        }
        Map<String, String> bookInfo = bookRecognitionService.recognizeBook(imageUrl);
        return ResponseEntity.ok(bookInfo);
    }
}
