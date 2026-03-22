package org.example.bookingservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "coupons")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;           // e.g. "WELCOME20"

    private String discountType;   // "PERCENT" or "FLAT"

    private Double discountValue;  // 20 means 20% or ₹20 flat

    private Double maxDiscount;    // cap for percent discounts (e.g. max ₹500 off)

    private Double minBookingAmount; // minimum booking amount to apply

    private Boolean active = true;

    private String description;    // shown to user
}