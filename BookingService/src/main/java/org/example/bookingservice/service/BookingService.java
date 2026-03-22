package org.example.bookingservice.service;

import lombok.RequiredArgsConstructor;
import org.example.bookingservice.entity.Booking;
import org.example.bookingservice.entity.RoomAvailability;
import org.example.bookingservice.repository.BookingRepository;
import org.example.bookingservice.repository.RoomAvailabilityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.dao.DataIntegrityViolationException; // ✅ FIXED: use Spring's @Transactional

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomAvailabilityRepository availabilityRepository;
    private final BookingEmailService emailService;

    public boolean isRoomAvailable(Long roomId, LocalDate checkIn, LocalDate checkOut) {
        // checkOut is exclusive — only block from checkIn up to (but not including) checkOut
        long count = availabilityRepository.countUnavailableDates(
                roomId, checkIn, checkOut.minusDays(1)
        );
        return count == 0;
    }

    @Transactional
    public Booking createBooking(Long userId, String userEmail,
                                 Long hotelId, Long roomId,
                                 LocalDate checkIn, LocalDate checkOut,
                                 Double baseAmount) {

        // ✅ Validate dates
        if (!checkOut.isAfter(checkIn)) {
            throw new RuntimeException("Check-out date must be after check-in date");
        }

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
        booking.setFinalAmount(baseAmount);
        booking.setStatus("CONFIRMED");
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());

        Booking saved = bookingRepository.save(booking);
        blockDates(roomId, checkIn, checkOut, saved.getBookingId());

        // Email is fire-and-forget — errors caught inside emailService, won't rollback
        emailService.sendBookingConfirmation(
                userEmail, saved.getBookingId(),
                hotelId, roomId, checkIn, checkOut, saved.getFinalAmount()
        );

        return saved;
    }

    private void blockDates(Long roomId, LocalDate start, LocalDate end, Long bookingId) {
        List<RoomAvailability> list = new ArrayList<>();
        // Block from checkIn up to (not including) checkOut
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
        try {
            availabilityRepository.saveAll(list);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Room is already booked for one or more of the selected dates");
        }
    }

    @Transactional
    public void cancelBooking(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus("CANCELLED");
        booking.setUpdatedAt(LocalDateTime.now());
        bookingRepository.save(booking);

        List<RoomAvailability> entries = availabilityRepository.findByBookingId(bookingId);
        entries.forEach(e -> {
            e.setIsAvailable(true);
            e.setUpdatedAt(LocalDateTime.now());
        });
        availabilityRepository.saveAll(entries);

        emailService.sendCancellationEmail(userEmail, bookingId);
    }

    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }
}