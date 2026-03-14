package com.books.exchange.services;

import com.books.exchange.entities.Books;
import com.books.exchange.entities.Books.BookStatus;
import com.books.exchange.entities.User;
import com.books.exchange.exceptions.ResourceNotFoundException;
import com.books.exchange.payloads.BooksDto;
import com.books.exchange.repositories.BooksRepo;
import com.books.exchange.repositories.UserRepo;
import com.books.exchange.services.impl.BookServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookServiceTest {

    @Mock
    private BooksRepo booksRepo;

    @Mock
    private UserRepo userRepo;

    @InjectMocks
    private BookServiceImpl bookService;

    private User testUser;
    private Books testBook;
    private BooksDto testBookDto;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1);
        testUser.setName("Test User");
        testUser.setEmail("test@example.com");

        testBook = new Books();
        testBook.setBook_id(1);
        testBook.setBookTitle("Test Book");
        testBook.setAuthor("Test Author");
        testBook.setEdition(1);
        testBook.setYear(2024);
        testBook.setGenre("Fiction");
        testBook.setBookCondition("Good");
        testBook.setStatus(BookStatus.AVAILABLE);
        testBook.setUsers(testUser);
        testBook.setCreatedAt(LocalDateTime.now());
        testBook.setUpdatedAt(LocalDateTime.now());

        testBookDto = BooksDto.builder()
                .bookTitle("Test Book")
                .author("Test Author")
                .edition(1)
                .year(2024)
                .genre("Fiction")
                .bookCondition("Good")
                .build();
    }

    @Test
    @DisplayName("Should publish a new book successfully")
    void publishBook_Success() {
        // Given
        when(userRepo.findById(1)).thenReturn(Optional.of(testUser));
        when(booksRepo.save(any(Books.class))).thenReturn(testBook);

        // When
        BooksDto result = bookService.publishBook(testBookDto, 1);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getBookTitle()).isEqualTo("Test Book");
        assertThat(result.getAuthor()).isEqualTo("Test Author");
        verify(booksRepo, times(1)).save(any(Books.class));
    }

    @Test
    @DisplayName("Should throw exception when publishing book with invalid user")
    void publishBook_UserNotFound() {
        // Given
        when(userRepo.findById(anyInt())).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> bookService.publishBook(testBookDto, 999))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("Should get book by ID successfully")
    void getBookById_Success() {
        // Given
        when(booksRepo.findById(1)).thenReturn(Optional.of(testBook));

        // When
        BooksDto result = bookService.getBookById(1);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getBookTitle()).isEqualTo("Test Book");
    }

    @Test
    @DisplayName("Should throw exception when book not found")
    void getBookById_NotFound() {
        // Given
        when(booksRepo.findById(anyInt())).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> bookService.getBookById(999))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("Should get all available books")
    void getAvailableBooks_Success() {
        // Given
        List<Books> books = Arrays.asList(testBook);
        when(booksRepo.findByStatus(BookStatus.AVAILABLE)).thenReturn(books);

        // When
        List<BooksDto> result = bookService.getAvailableBooks();

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getBookTitle()).isEqualTo("Test Book");
    }

    @Test
    @DisplayName("Should update book information")
    void updateBookInfo_Success() {
        // Given
        BooksDto updateDto = BooksDto.builder()
                .bookTitle("Updated Title")
                .author("Updated Author")
                .build();
        when(booksRepo.findById(1)).thenReturn(Optional.of(testBook));
        when(booksRepo.save(any(Books.class))).thenReturn(testBook);

        // When
        BooksDto result = bookService.updateBookInfo(updateDto, 1);

        // Then
        assertThat(result).isNotNull();
        verify(booksRepo, times(1)).save(any(Books.class));
    }

    @Test
    @DisplayName("Should delete book successfully")
    void deletePublishedItem_Success() {
        // Given
        when(booksRepo.findById(1)).thenReturn(Optional.of(testBook));
        doNothing().when(booksRepo).delete(any(Books.class));

        // When
        bookService.deletePublishedItem(1);

        // Then
        verify(booksRepo, times(1)).delete(testBook);
    }

    @Test
    @DisplayName("Should throw exception when deleting non-existent book")
    void deletePublishedItem_NotFound() {
        // Given
        when(booksRepo.findById(anyInt())).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> bookService.deletePublishedItem(999))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("Should update book status")
    void updateBookStatus_Success() {
        // Given
        when(booksRepo.findById(1)).thenReturn(Optional.of(testBook));
        when(booksRepo.save(any(Books.class))).thenReturn(testBook);

        // When
        BooksDto result = bookService.updateBookStatus(1, BookStatus.BORROWED);

        // Then
        assertThat(result).isNotNull();
        verify(booksRepo, times(1)).save(any(Books.class));
    }

    @Test
    @DisplayName("Should get books by user")
    void getBooksByUser_Success() {
        // Given
        List<Books> books = Arrays.asList(testBook);
        when(userRepo.findById(1)).thenReturn(Optional.of(testUser));
        when(booksRepo.findByUsers(testUser)).thenReturn(books);

        // When
        List<BooksDto> result = bookService.getBooksByUser(1);

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getOwnerName()).isEqualTo("Test User");
    }

    @Test
    @DisplayName("Should get all books")
    void getAllBooks_Success() {
        // Given
        Books anotherBook = new Books();
        anotherBook.setBook_id(2);
        anotherBook.setBookTitle("Another Book");
        anotherBook.setAuthor("Another Author");
        anotherBook.setStatus(BookStatus.AVAILABLE);
        anotherBook.setUsers(testUser);

        List<Books> books = Arrays.asList(testBook, anotherBook);
        when(booksRepo.findAll()).thenReturn(books);

        // When
        List<BooksDto> result = bookService.getAllBooks();

        // Then
        assertThat(result).hasSize(2);
    }
}

