package com.books.exchange.services;

import com.books.exchange.entities.Books.BookStatus;
import com.books.exchange.payloads.BooksDto;
import com.books.exchange.payloads.PageResponse;

import java.util.List;

public interface BooksService {

    BooksDto publishBook(BooksDto booksDto, int userId);

    BooksDto updateBookInfo(BooksDto booksDto, int bookId);

    void deletePublishedItem(int bookId);

    BooksDto getBookById(int bookId);

    List<BooksDto> getAllBooks();

    PageResponse<BooksDto> getAllBooks(int pageNumber, int pageSize, String sortBy, String sortDir);

    List<BooksDto> getAvailableBooks();

    PageResponse<BooksDto> getAvailableBooks(int pageNumber, int pageSize, String sortBy, String sortDir);

    List<BooksDto> getBooksByUser(int userId);

    PageResponse<BooksDto> getBooksByUser(int userId, int pageNumber, int pageSize);

    List<BooksDto> searchBooks(String query);

    PageResponse<BooksDto> searchBooks(String query, int pageNumber, int pageSize);

    List<BooksDto> searchAvailableBooks(String query);

    PageResponse<BooksDto> searchAvailableBooks(String query, int pageNumber, int pageSize);

    List<BooksDto> getBooksByGenre(String genre);

    PageResponse<BooksDto> getBooksByGenre(String genre, int pageNumber, int pageSize);

    BooksDto updateBookStatus(int bookId, BookStatus status);
}
