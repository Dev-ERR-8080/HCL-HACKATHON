package org.example.bookingservice.service;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.bookingservice.entity.Booking;
import org.example.bookingservice.entity.RoomAvailability;
import org.example.bookingservice.repository.BookingRepository;
import org.example.bookingservice.repository.RoomAvailabilityRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomAvailabilityRepository availabilityRepository;

    // 🔍 1. Check Availability
    public boolean isRoomAvailable(Long roomId, LocalDate checkIn, LocalDate checkOut) {

        long count = availabilityRepository.countUnavailableDates(
                roomId, checkIn, checkOut
        );

        return count == 0;
    }


    @Transactional
    public Booking createBooking(Long userId, Long hotelId, Long roomId,
                                 LocalDate checkIn, LocalDate checkOut,
                                 Double baseAmount) {

        // 🔍 Check availability
        if (!isRoomAvailable(roomId, checkIn, checkOut)) {
            throw new RuntimeException("Room not available for selected dates");
        }

        // 💰 Pricing (simple for now)
        double finalAmount = baseAmount;

        // 💾 Save booking
        Booking booking = new Booking();
        booking.setUserId(userId);
        booking.setHotelId(hotelId);
        booking.setRoomId(roomId);
        booking.setCheckIn(checkIn);
        booking.setCheckOut(checkOut);
        booking.setBaseAmount(baseAmount);
        booking.setFinalAmount(finalAmount);
        booking.setStatus("CONFIRMED");

        Booking savedBooking = bookingRepository.save(booking);

        // 🔒 Block dates
        blockDates(roomId, checkIn, checkOut, savedBooking.getBookingId());

        return savedBooking;
    }

    private void blockDates(Long roomId, LocalDate start, LocalDate end, Long bookingId) {

        List<RoomAvailability> list = new ArrayList<>();

        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {

            RoomAvailability ra = new RoomAvailability();
            ra.setRoomId(roomId);
            ra.setDate(date);
            ra.setIsAvailable(false);
            ra.setBookingId(bookingId);

            list.add(ra);
        }

        availabilityRepository.saveAll(list);
    }

    @Transactional
    public void cancelBooking(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);

        // 🔓 Free dates
        List<RoomAvailability> entries = availabilityRepository.findAll()
                .stream()
                .filter(r -> bookingId.equals(r.getBookingId()))
                .toList();

        entries.forEach(e -> e.setIsAvailable(true));

        availabilityRepository.saveAll(entries);
    }
}