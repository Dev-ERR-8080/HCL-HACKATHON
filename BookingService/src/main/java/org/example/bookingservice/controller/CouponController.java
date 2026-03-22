package org.example.bookingservice.controller;


import lombok.RequiredArgsConstructor;
import org.example.bookingservice.service.CouponService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    // ✅ Called by Checkout page when user enters a coupon code
    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validate(
            @RequestParam String code,
            @RequestParam Double amount) {
        return ResponseEntity.ok(couponService.validateCoupon(code, amount));
    }
}