package com.books.exchange.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.books.exchange.entities.Books;
import com.books.exchange.entities.Books.BookStatus;
import com.books.exchange.entities.User;

import java.util.List;

public interface BooksRepo extends JpaRepository<Books, Integer> {

    List<Books> findByUsers(User user);
    Page<Books> findByUsers(User user, Pageable pageable);

    List<Books> findByStatus(BookStatus status);
    Page<Books> findByStatus(BookStatus status, Pageable pageable);

    @Query("SELECT b FROM Books b WHERE " +
           "LOWER(b.bookTitle) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.genre) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Books> searchBooks(@Param("query") String query);

    @Query("SELECT b FROM Books b WHERE " +
           "LOWER(b.bookTitle) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.genre) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Books> searchBooks(@Param("query") String query, Pageable pageable);

    @Query("SELECT b FROM Books b WHERE b.status = :status AND " +
           "(LOWER(b.bookTitle) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Books> searchAvailableBooks(@Param("query") String query, @Param("status") BookStatus status);

    @Query("SELECT b FROM Books b WHERE b.status = :status AND " +
           "(LOWER(b.bookTitle) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Books> searchAvailableBooks(@Param("query") String query, @Param("status") BookStatus status, Pageable pageable);

    List<Books> findByGenre(String genre);
    Page<Books> findByGenre(String genre, Pageable pageable);

    List<Books> findByUsersAndStatus(User user, BookStatus status);
}