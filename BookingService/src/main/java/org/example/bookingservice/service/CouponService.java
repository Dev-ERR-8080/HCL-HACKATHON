package org.example.bookingservice.service;

import lombok.RequiredArgsConstructor;
import org.example.bookingservice.entity.Coupon;
import org.example.bookingservice.repository.CouponRepository;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    // ✅ Validate a coupon code and return discount info
    public Map<String, Object> validateCoupon(String code, Double bookingAmount) {
        Coupon coupon = couponRepository.findByCodeIgnoreCaseAndActiveTrue(code)
                .orElseThrow(() -> new RuntimeException("Invalid or expired coupon code"));

        if (coupon.getMinBookingAmount() != null && bookingAmount < coupon.getMinBookingAmount()) {
            throw new RuntimeException(
                    "Minimum booking amount of ₹" + coupon.getMinBookingAmount().intValue() + " required for this coupon"
            );
        }

        double discount = calculateDiscount(coupon, bookingAmount);
        double finalAmount = bookingAmount - discount;

        return Map.of(
                "code",        coupon.getCode(),
                "description", coupon.getDescription(),
                "discount",    discount,
                "finalAmount", finalAmount
        );
    }

    public double calculateDiscount(Coupon coupon, double amount) {
        if ("PERCENT".equalsIgnoreCase(coupon.getDiscountType())) {
            double disc = amount * coupon.getDiscountValue() / 100.0;
            if (coupon.getMaxDiscount() != null) disc = Math.min(disc, coupon.getMaxDiscount());
            return disc;
        } else { // FLAT
            return Math.min(coupon.getDiscountValue(), amount);
        }
    }

    public Coupon getCoupon(String code) {
        return couponRepository.findByCodeIgnoreCaseAndActiveTrue(code).orElse(null);
    }
}
