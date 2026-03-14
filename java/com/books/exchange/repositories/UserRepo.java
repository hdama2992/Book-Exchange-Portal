package com.books.exchange.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.books.exchange.entities.User;

import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
