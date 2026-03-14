package com.books.exchange.services.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.books.exchange.entities.Books;
import com.books.exchange.entities.Books.BookStatus;
import com.books.exchange.entities.User;
import com.books.exchange.exceptions.ResourceNotFoundException;
import com.books.exchange.payloads.BooksDto;
import com.books.exchange.repositories.BooksRepo;
import com.books.exchange.repositories.UserRepo;
import com.books.exchange.services.BooksService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BooksService {

    private final BooksRepo booksRepo;
    private final UserRepo userRepo;

    @Override
    @Transactional
    public BooksDto publishBook(BooksDto booksDto, int userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Books book = new Books();
        book.setBookTitle(booksDto.getBookTitle());
        book.setAuthor(booksDto.getAuthor());
        book.setEdition(booksDto.getEdition());
        book.setYear(booksDto.getYear());
        book.setDescription(booksDto.getDescription());
        book.setPhotos(booksDto.getPhotos());
        book.setIsbn(booksDto.getIsbn());
        book.setGenre(booksDto.getGenre());
        book.setBookCondition(booksDto.getBookCondition());
        book.setStatus(BookStatus.AVAILABLE);
        book.setUsers(user);

        Books savedBook = booksRepo.save(book);
        return mapToDto(savedBook);
    }

    @Override
    @Transactional
    public BooksDto updateBookInfo(BooksDto booksDto, int bookId) {
        Books book = booksRepo.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book", "id", bookId));

        if (booksDto.getBookTitle() != null) book.setBookTitle(booksDto.getBookTitle());
        if (booksDto.getAuthor() != null) book.setAuthor(booksDto.getAuthor());
        if (booksDto.getEdition() > 0) book.setEdition(booksDto.getEdition());
        if (booksDto.getYear() > 0) book.setYear(booksDto.getYear());
        if (booksDto.getDescription() != null) book.setDescription(booksDto.getDescription());
        if (booksDto.getPhotos() != null) book.setPhotos(booksDto.getPhotos());
        if (booksDto.getIsbn() != null) book.setIsbn(booksDto.getIsbn());
        if (booksDto.getGenre() != null) book.setGenre(booksDto.getGenre());
        if (booksDto.getBookCondition() != null) book.setBookCondition(booksDto.getBookCondition());

        Books updatedBook = booksRepo.save(book);
        return mapToDto(updatedBook);
    }

    @Override
    @Transactional
    public void deletePublishedItem(int bookId) {
        Books book = booksRepo.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book", "id", bookId));
        booksRepo.delete(book);
    }

    @Override
    public BooksDto getBookById(int bookId) {
        Books book = booksRepo.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book", "id", bookId));
        return mapToDto(book);
    }

    @Override
    public List<BooksDto> getAllBooks() {
        return booksRepo.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<BooksDto> getAvailableBooks() {
        return booksRepo.findByStatus(BookStatus.AVAILABLE).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<BooksDto> getBooksByUser(int userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return booksRepo.findByUsers(user).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<BooksDto> searchBooks(String query) {
        return booksRepo.searchBooks(query).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<BooksDto> searchAvailableBooks(String query) {
        return booksRepo.searchAvailableBooks(query, BookStatus.AVAILABLE).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<BooksDto> getBooksByGenre(String genre) {
        return booksRepo.findByGenre(genre).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BooksDto updateBookStatus(int bookId, BookStatus status) {
        Books book = booksRepo.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book", "id", bookId));
        book.setStatus(status);
        return mapToDto(booksRepo.save(book));
    }

    private BooksDto mapToDto(Books book) {
        return BooksDto.builder()
                .bookId(book.getBook_id())
                .bookTitle(book.getBookTitle())
                .author(book.getAuthor())
                .edition(book.getEdition())
                .year(book.getYear())
                .description(book.getDescription())
                .photos(book.getPhotos())
                .isbn(book.getIsbn())
                .genre(book.getGenre())
                .bookCondition(book.getBookCondition())
                .status(book.getStatus())
                .createdAt(book.getCreatedAt())
                .updatedAt(book.getUpdatedAt())
                .ownerId(book.getUsers() != null ? book.getUsers().getId() : 0)
                .ownerName(book.getUsers() != null ? book.getUsers().getName() : null)
                .build();
    }
}
