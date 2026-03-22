package org.example.bookingservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class BookingEmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendBookingConfirmation(String toEmail, Long bookingId,
                                        Long hotelId, Long roomId,
                                        LocalDate checkIn, LocalDate checkOut,
                                        Double finalAmount) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(toEmail);
            msg.setSubject("QuickInn - Booking Confirmed! #" + bookingId);
            msg.setText(
                    "Hello,\n\n" +
                            "Your booking has been confirmed!\n\n" +
                            "─────────────────────────────\n" +
                            "  Booking ID   : #" + bookingId + "\n" +
                            "  Hotel ID     : " + hotelId + "\n" +
                            "  Room ID      : " + roomId + "\n" +
                            "  Check-in     : " + checkIn + "\n" +
                            "  Check-out    : " + checkOut + "\n" +
                            "  Total Amount : ₹" + finalAmount + "\n" +
                            "─────────────────────────────\n\n" +
                            "Thank you for choosing QuickInn. We hope you enjoy your stay!\n\n" +
                            "If you need to cancel or modify your booking, please visit your bookings page.\n\n" +
                            "- QuickInn Team"
            );
            mailSender.send(msg);
        } catch (Exception e) {
            // ✅ Log but never crash the booking flow if email fails
            System.err.println("Failed to send booking confirmation email: " + e.getMessage());
        }
    }

    public void sendCancellationEmail(String toEmail, Long bookingId) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(toEmail);
            msg.setSubject("QuickInn - Booking Cancelled #" + bookingId);
            msg.setText(
                    "Hello,\n\n" +
                            "Your booking #" + bookingId + " has been successfully cancelled.\n\n" +
                            "If this was a mistake or you'd like to rebook, visit our website.\n\n" +
                            "- QuickInn Team"
            );
            mailSender.send(msg);
        } catch (Exception e) {
            System.err.println("Failed to send cancellation email: " + e.getMessage());
        }
    }
}