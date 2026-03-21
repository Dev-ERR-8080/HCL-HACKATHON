package org.example.bookingservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.bookingservice.entity.Booking;
import org.example.bookingservice.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // 🔍 Check availability
    @GetMapping("/check")
    public ResponseEntity<Boolean> checkAvailability(
            @RequestParam Long roomId,
            @RequestParam String checkIn,
            @RequestParam String checkOut
    ) {
        boolean available = bookingService.isRoomAvailable(
                roomId,
                LocalDate.parse(checkIn),
                LocalDate.parse(checkOut)
        );
        return ResponseEntity.ok(available);
    }
    @PostMapping("/create")
    public ResponseEntity<Booking> createBooking(
            @RequestParam Long userId,
            @RequestParam Long hotelId,
            @RequestParam Long roomId,
            @RequestParam String checkIn,
            @RequestParam String checkOut,
            @RequestParam Double baseAmount
    ) {
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

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<String> cancelBooking(@PathVariable Long bookingId) {

        bookingService.cancelBooking(bookingId);
        return ResponseEntity.ok("Booking cancelled successfully");
    }
}