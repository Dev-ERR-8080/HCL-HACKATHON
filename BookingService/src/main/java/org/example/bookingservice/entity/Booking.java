package org.example.bookingservice.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    // 🔹 User Info
    private Long userId;

    // 🔹 Hotel & Room Info
    private Long hotelId;
    private Long roomId;
    private Long roomTypeId;

    // 🔹 Booking Dates
    private LocalDate checkIn;
    private LocalDate checkOut;

    // 🔹 Pricing
    private Double baseAmount;     // original price
    private Double discountAmount; // discount applied
    private Double finalAmount;    // final payable

    // 🔹 Coupon
    private String couponCode;

    // 🔹 Loyalty Points
    private Integer loyaltyPointsUsed;
    private Integer loyaltyPointsEarned;

    // 🔹 Booking Status
    private String status; // CONFIRMED / CANCELLED

    // 🔹 Quick Rebooking Reference
    private Long parentBookingId; // for rebooking

    // 🔹 Offer Type (Optional)
    private String offerType; // SEASONAL / FESTIVE / NONE

    // 🔹 Audit Fields
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}