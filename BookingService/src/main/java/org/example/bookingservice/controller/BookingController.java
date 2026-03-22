package org.example.bookingservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.bookingservice.entity.Booking;
import org.example.bookingservice.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // ✅ Check availability — public-style, no user identity needed
    @GetMapping("/check")
    public ResponseEntity<Boolean> checkAvailability(
            @RequestParam Long roomId,
            @RequestParam String checkIn,
            @RequestParam String checkOut
    ) {
        boolean available = bookingService.isRoomAvailable(
                roomId,
                LocalDate.parse(checkIn.trim()),
                LocalDate.parse(checkOut.trim())
        );
        return ResponseEntity.ok(available);
    }

    // ✅ FIXED: userId now comes from X-User-Id header (injected by gateway from JWT)
    //    instead of a request param — prevents any user from booking as another user
    @PostMapping("/create")
    public ResponseEntity<Booking> createBooking(
            @RequestHeader("X-User-Id") String userIdHeader,   // from gateway
            @RequestParam Long hotelId,
            @RequestParam Long roomId,
            @RequestParam String checkIn,
            @RequestParam String checkOut,
            @RequestParam Double baseAmount
    ) {
        Long userId = Long.parseLong(userIdHeader);

        Booking booking = bookingService.createBooking(
                userId,
                hotelId,
                roomId,
                LocalDate.parse(checkIn),
                LocalDate.parse(checkOut),
                baseAmount
        );
        return ResponseEntity.ok(booking);
    }

    // ✅ ADDED: get bookings for the logged-in user
    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings(
            @RequestHeader("X-User-Id") String userIdHeader
    ) {
        Long userId = Long.parseLong(userIdHeader);
        return ResponseEntity.ok(bookingService.getBookingsByUser(userId));
    }

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<String> cancelBooking(@PathVariable Long bookingId) {
        bookingService.cancelBooking(bookingId);
        return ResponseEntity.ok("Booking cancelled successfully");
    }
}