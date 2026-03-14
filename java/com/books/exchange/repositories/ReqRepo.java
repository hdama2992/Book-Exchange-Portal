package com.books.exchange.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.books.exchange.entities.Books;
import com.books.exchange.entities.Requests;
import com.books.exchange.entities.Requests.RequestStatus;
import com.books.exchange.entities.User;

import java.util.List;

public interface ReqRepo extends JpaRepository<Requests, Integer> {

    List<Requests> findByRequester(User requester);

    List<Requests> findByOwner(User owner);

    List<Requests> findByBook(Books book);

    List<Requests> findByStatus(RequestStatus status);

    List<Requests> findByRequesterAndStatus(User requester, RequestStatus status);

    List<Requests> findByOwnerAndStatus(User owner, RequestStatus status);

    List<Requests> findByBookAndStatus(Books book, RequestStatus status);

    boolean existsByRequesterAndBookAndStatusIn(User requester, Books book, List<RequestStatus> statuses);
}