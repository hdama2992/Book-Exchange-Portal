package com.books.exchange.services;

import com.books.exchange.entities.Books.BookStatus;
import com.books.exchange.payloads.BooksDto;

import java.util.List;

public interface BooksService {

    BooksDto publishBook(BooksDto booksDto, int userId);

    BooksDto updateBookInfo(BooksDto booksDto, int bookId);

    void deletePublishedItem(int bookId);

    BooksDto getBookById(int bookId);

    List<BooksDto> getAllBooks();

    List<BooksDto> getAvailableBooks();

    List<BooksDto> getBooksByUser(int userId);

    List<BooksDto> searchBooks(String query);

    List<BooksDto> searchAvailableBooks(String query);

    List<BooksDto> getBooksByGenre(String genre);

    BooksDto updateBookStatus(int bookId, BookStatus status);
}
