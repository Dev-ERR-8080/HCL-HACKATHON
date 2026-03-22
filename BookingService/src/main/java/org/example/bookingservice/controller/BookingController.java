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

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkAvailability(
            @RequestParam Long roomId, @RequestParam String checkIn, @RequestParam String checkOut) {
        return ResponseEntity.ok(bookingService.isRoomAvailable(
                roomId, LocalDate.parse(checkIn.trim()), LocalDate.parse(checkOut.trim())));
    }

    @PostMapping("/create")
    public ResponseEntity<Booking> createBooking(
            @RequestHeader("X-User-Id")    String userIdHeader,
            @RequestHeader("X-User-Email") String userEmail,
            @RequestParam Long hotelId,
            @RequestParam Long roomId,
            @RequestParam String checkIn,
            @RequestParam String checkOut,
            @RequestParam Double baseAmount,
            @RequestParam(required = false) String couponCode) {   // ✅ optional coupon

        return ResponseEntity.ok(bookingService.createBooking(
                Long.parseLong(userIdHeader), userEmail,
                hotelId, roomId,
                LocalDate.parse(checkIn), LocalDate.parse(checkOut),
                baseAmount, couponCode));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings(@RequestHeader("X-User-Id") String userIdHeader) {
        return ResponseEntity.ok(bookingService.getBookingsByUser(Long.parseLong(userIdHeader)));
    }

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<String> cancelBooking(
            @PathVariable Long bookingId,
            @RequestHeader("X-User-Email") String userEmail) {
        bookingService.cancelBooking(bookingId, userEmail);
        return ResponseEntity.ok("Booking cancelled successfully");
    }
}