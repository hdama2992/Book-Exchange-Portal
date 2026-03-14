package com.books.exchange.services.impl;

import com.books.exchange.entities.Books;
import com.books.exchange.entities.Books.BookStatus;
import com.books.exchange.entities.Requests;
import com.books.exchange.entities.Requests.RequestStatus;
import com.books.exchange.entities.User;
import com.books.exchange.exceptions.ResourceNotFoundException;
import com.books.exchange.payloads.ReqDto;
import com.books.exchange.repositories.BooksRepo;
import com.books.exchange.repositories.ReqRepo;
import com.books.exchange.repositories.UserRepo;
import com.books.exchange.services.ReqService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReqServiceImp implements ReqService {

    private final ReqRepo reqRepo;
    private final UserRepo userRepo;
    private final BooksRepo booksRepo;

    @Override
    @Transactional
    public ReqDto createRequest(int requesterId, int bookId, String message, LocalDateTime expectedReturnDate) {
        User requester = userRepo.findById(requesterId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", requesterId));

        Books book = booksRepo.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book", "id", bookId));

        if (book.getStatus() != BookStatus.AVAILABLE) {
            throw new RuntimeException("Book is not available for borrowing");
        }

        if (book.getUsers().getId() == requesterId) {
            throw new RuntimeException("You cannot request your own book");
        }

        // Check if there's already an active request
        boolean hasActiveRequest = reqRepo.existsByRequesterAndBookAndStatusIn(
                requester, book,
                Arrays.asList(RequestStatus.PENDING, RequestStatus.APPROVED, RequestStatus.BORROWED)
        );

        if (hasActiveRequest) {
            throw new RuntimeException("You already have an active request for this book");
        }

        Requests request = new Requests();
        request.setRequester(requester);
        request.setOwner(book.getUsers());
        request.setBook(book);
        request.setMessage(message);
        request.setExpectedReturnDate(expectedReturnDate);
        request.setStatus(RequestStatus.PENDING);

        Requests savedRequest = reqRepo.save(request);
        return mapToDto(savedRequest);
    }

    @Override
    @Transactional
    public ReqDto approveRequest(int requestId, int ownerId) {
        Requests request = reqRepo.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request", "id", requestId));

        if (request.getOwner().getId() != ownerId) {
            throw new RuntimeException("Only the book owner can approve this request");
        }

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Only pending requests can be approved");
        }

        request.setStatus(RequestStatus.APPROVED);
        request.setIssueDate(LocalDateTime.now());

        // Update book status
        Books book = request.getBook();
        book.setStatus(BookStatus.BORROWED);
        booksRepo.save(book);

        request.setStatus(RequestStatus.BORROWED);
        return mapToDto(reqRepo.save(request));
    }

    @Override
    @Transactional
    public ReqDto rejectRequest(int requestId, int ownerId, String reason) {
        Requests request = reqRepo.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request", "id", requestId));

        if (request.getOwner().getId() != ownerId) {
            throw new RuntimeException("Only the book owner can reject this request");
        }

        request.setStatus(RequestStatus.REJECTED);
        request.setMessage(reason);
        return mapToDto(reqRepo.save(request));
    }

    @Override
    @Transactional
    public ReqDto cancelRequest(int requestId, int requesterId) {
        Requests request = reqRepo.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request", "id", requestId));

        if (request.getRequester().getId() != requesterId) {
            throw new RuntimeException("Only the requester can cancel this request");
        }

        if (request.getStatus() == RequestStatus.BORROWED) {
            throw new RuntimeException("Cannot cancel a borrowed request. Please return the book first.");
        }

        request.setStatus(RequestStatus.CANCELLED);
        return mapToDto(reqRepo.save(request));
    }

    @Override
    @Transactional
    public ReqDto markAsReturned(int requestId, int ownerId) {
        Requests request = reqRepo.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request", "id", requestId));

        if (request.getOwner().getId() != ownerId) {
            throw new RuntimeException("Only the book owner can mark as returned");
        }

        request.setStatus(RequestStatus.RETURNED);
        request.setActualReturnDate(LocalDateTime.now());

        // Update book status
        Books book = request.getBook();
        book.setStatus(BookStatus.AVAILABLE);
        booksRepo.save(book);

        return mapToDto(reqRepo.save(request));
    }

    @Override
    public ReqDto requestExtension(int requestId, LocalDateTime newReturnDate) {
        Requests request = reqRepo.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request", "id", requestId));

        request.setExpectedReturnDate(newReturnDate);
        return mapToDto(reqRepo.save(request));
    }

    @Override
    public List<ReqDto> getRequestsByRequester(int requesterId) {
        User requester = userRepo.findById(requesterId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", requesterId));
        return reqRepo.findByRequester(requester).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReqDto> getRequestsByOwner(int ownerId) {
        User owner = userRepo.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", ownerId));
        return reqRepo.findByOwner(owner).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReqDto> getRequestsByStatus(RequestStatus status) {
        return reqRepo.findByStatus(status).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ReqDto getRequestById(int requestId) {
        Requests request = reqRepo.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request", "id", requestId));
        return mapToDto(request);
    }

    @Override
    public void deleteRequest(int requestId) {
        if (!reqRepo.existsById(requestId)) {
            throw new ResourceNotFoundException("Request", "id", requestId);
        }
        reqRepo.deleteById(requestId);
    }

    private ReqDto mapToDto(Requests request) {
        return ReqDto.builder()
                .reqId(request.getReqId())
                .requesterId(request.getRequester().getId())
                .requesterName(request.getRequester().getName())
                .ownerId(request.getOwner().getId())
                .ownerName(request.getOwner().getName())
                .bookId(request.getBook().getBook_id())
                .bookTitle(request.getBook().getBookTitle())
                .bookAuthor(request.getBook().getAuthor())
                .status(request.getStatus())
                .requestDate(request.getRequestDate())
                .issueDate(request.getIssueDate())
                .expectedReturnDate(request.getExpectedReturnDate())
                .actualReturnDate(request.getActualReturnDate())
                .message(request.getMessage())
                .build();
    }
}
