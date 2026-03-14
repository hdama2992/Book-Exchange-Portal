package com.books.exchange.controllers;

import com.books.exchange.entities.Requests.RequestStatus;
import com.books.exchange.payloads.Apiresponse;
import com.books.exchange.payloads.ReqDto;
import com.books.exchange.services.ReqService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class RequestController {

    private final ReqService reqService;

    @PostMapping
    public ResponseEntity<ReqDto> createRequest(@RequestBody Map<String, Object> payload) {
        int requesterId = (Integer) payload.get("requesterId");
        int bookId = (Integer) payload.get("bookId");
        String message = (String) payload.get("message");
        LocalDateTime expectedReturnDate = LocalDateTime.parse((String) payload.get("expectedReturnDate"));
        
        ReqDto request = reqService.createRequest(requesterId, bookId, message, expectedReturnDate);
        return ResponseEntity.status(HttpStatus.CREATED).body(request);
    }

    @PatchMapping("/{requestId}/approve")
    public ResponseEntity<ReqDto> approveRequest(
            @PathVariable int requestId,
            @RequestParam int ownerId) {
        return ResponseEntity.ok(reqService.approveRequest(requestId, ownerId));
    }

    @PatchMapping("/{requestId}/reject")
    public ResponseEntity<ReqDto> rejectRequest(
            @PathVariable int requestId,
            @RequestParam int ownerId,
            @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(reqService.rejectRequest(requestId, ownerId, reason));
    }

    @PatchMapping("/{requestId}/cancel")
    public ResponseEntity<ReqDto> cancelRequest(
            @PathVariable int requestId,
            @RequestParam int requesterId) {
        return ResponseEntity.ok(reqService.cancelRequest(requestId, requesterId));
    }

    @PatchMapping("/{requestId}/return")
    public ResponseEntity<ReqDto> markAsReturned(
            @PathVariable int requestId,
            @RequestParam int ownerId) {
        return ResponseEntity.ok(reqService.markAsReturned(requestId, ownerId));
    }

    @PatchMapping("/{requestId}/extend")
    public ResponseEntity<ReqDto> requestExtension(
            @PathVariable int requestId,
            @RequestParam String newReturnDate) {
        LocalDateTime date = LocalDateTime.parse(newReturnDate);
        return ResponseEntity.ok(reqService.requestExtension(requestId, date));
    }

    @GetMapping("/requester/{requesterId}")
    public ResponseEntity<List<ReqDto>> getRequestsByRequester(@PathVariable int requesterId) {
        return ResponseEntity.ok(reqService.getRequestsByRequester(requesterId));
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<ReqDto>> getRequestsByOwner(@PathVariable int ownerId) {
        return ResponseEntity.ok(reqService.getRequestsByOwner(ownerId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ReqDto>> getRequestsByStatus(@PathVariable RequestStatus status) {
        return ResponseEntity.ok(reqService.getRequestsByStatus(status));
    }

    @GetMapping("/{requestId}")
    public ResponseEntity<ReqDto> getRequestById(@PathVariable int requestId) {
        return ResponseEntity.ok(reqService.getRequestById(requestId));
    }

    @DeleteMapping("/{requestId}")
    public ResponseEntity<Apiresponse> deleteRequest(@PathVariable int requestId) {
        reqService.deleteRequest(requestId);
        return ResponseEntity.ok(new Apiresponse("Request deleted successfully", true));
    }
}

