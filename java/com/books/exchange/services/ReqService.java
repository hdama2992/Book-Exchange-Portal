package com.books.exchange.services;

import com.books.exchange.entities.Requests.RequestStatus;
import com.books.exchange.payloads.ReqDto;

import java.time.LocalDateTime;
import java.util.List;

public interface ReqService {

    ReqDto createRequest(int requesterId, int bookId, String message, LocalDateTime expectedReturnDate);

    ReqDto approveRequest(int requestId, int ownerId);

    ReqDto rejectRequest(int requestId, int ownerId, String reason);

    ReqDto cancelRequest(int requestId, int requesterId);

    ReqDto markAsReturned(int requestId, int ownerId);

    ReqDto requestExtension(int requestId, LocalDateTime newReturnDate);

    List<ReqDto> getRequestsByRequester(int requesterId);

    List<ReqDto> getRequestsByOwner(int ownerId);

    List<ReqDto> getRequestsByStatus(RequestStatus status);

    ReqDto getRequestById(int requestId);

    void deleteRequest(int requestId);
}
