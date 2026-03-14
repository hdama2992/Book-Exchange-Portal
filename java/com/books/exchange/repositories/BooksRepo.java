package com.books.exchange.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.books.exchange.entities.Books;
import com.books.exchange.entities.Books.BookStatus;
import com.books.exchange.entities.User;

import java.util.List;

public interface BooksRepo extends JpaRepository<Books, Integer> {

    List<Books> findByUsers(User user);

    List<Books> findByStatus(BookStatus status);

    @Query("SELECT b FROM Books b WHERE " +
           "LOWER(b.bookTitle) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.genre) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Books> searchBooks(@Param("query") String query);

    @Query("SELECT b FROM Books b WHERE b.status = :status AND " +
           "(LOWER(b.bookTitle) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Books> searchAvailableBooks(@Param("query") String query, @Param("status") BookStatus status);

    List<Books> findByGenre(String genre);

    List<Books> findByUsersAndStatus(User user, BookStatus status);
}