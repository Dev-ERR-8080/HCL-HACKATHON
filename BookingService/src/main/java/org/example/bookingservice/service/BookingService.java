package org.example.bookingservice.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.bookingservice.entity.Booking;
import org.example.bookingservice.entity.RoomAvailability;
import org.example.bookingservice.repository.BookingRepository;
import org.example.bookingservice.repository.RoomAvailabilityRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomAvailabilityRepository availabilityRepository;

    public boolean isRoomAvailable(Long roomId, LocalDate checkIn, LocalDate checkOut) {
        // ✅ checkOut is exclusive — a guest checking out on day X frees the room for day X
        //    so we count unavailable dates from checkIn to checkOut MINUS ONE DAY
        long count = availabilityRepository.countUnavailableDates(
                roomId, checkIn, checkOut.minusDays(1)
        );
        return count == 0;
    }

    @Transactional
    public Booking createBooking(Long userId, Long hotelId, Long roomId,
                                 LocalDate checkIn, LocalDate checkOut,
                                 Double baseAmount) {

        if (!isRoomAvailable(roomId, checkIn, checkOut)) {
            throw new RuntimeException("Room not available for selected dates");
        }

        Booking booking = new Booking();
        booking.setUserId(userId);
        booking.setHotelId(hotelId);
        booking.setRoomId(roomId);
        booking.setCheckIn(checkIn);
        booking.setCheckOut(checkOut);
        booking.setBaseAmount(baseAmount);
        booking.setFinalAmount(baseAmount); // extend with discounts later
        booking.setStatus("CONFIRMED");
        // ✅ FIXED: set audit timestamps on creation
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);
        blockDates(roomId, checkIn, checkOut, savedBooking.getBookingId());
        return savedBooking;
    }

    private void blockDates(Long roomId, LocalDate start, LocalDate end, Long bookingId) {
        List<RoomAvailability> list = new ArrayList<>();

        // ✅ block from checkIn up to but NOT including checkOut (checkout day is free)
        for (LocalDate date = start; date.isBefore(end); date = date.plusDays(1)) {
            RoomAvailability ra = new RoomAvailability();
            ra.setRoomId(roomId);
            ra.setDate(date);
            ra.setIsAvailable(false);
            ra.setBookingId(bookingId);
            ra.setCreatedAt(LocalDateTime.now());
            ra.setUpdatedAt(LocalDateTime.now());
            list.add(ra);
        }

        availabilityRepository.saveAll(list);
    }

    @Transactional
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus("CANCELLED");
        booking.setUpdatedAt(LocalDateTime.now());
        bookingRepository.save(booking);

        // ✅ FIXED: was calling findAll() and filtering in Java — very inefficient.
        //    Now uses a proper repository query to find only relevant rows.
        List<RoomAvailability> entries = availabilityRepository.findByBookingId(bookingId);
        entries.forEach(e -> {
            e.setIsAvailable(true);
            e.setUpdatedAt(LocalDateTime.now());
        });
        availabilityRepository.saveAll(entries);
    }

    // ✅ ADDED: used by GET /api/bookings/my
    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }
}