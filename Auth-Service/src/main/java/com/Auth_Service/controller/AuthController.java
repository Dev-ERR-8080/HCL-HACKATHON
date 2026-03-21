package com.Auth_Service.controller;

import com.Auth_Service.dto.LoginRequest;
import com.Auth_Service.dto.RegisterRequest;
import com.Auth_Service.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService service;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest req) {
        return service.register(req);
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest req) {
        return service.login(req);
    }

    // Step 1: Send OTP to email
    @PostMapping("/forgot-password")
    public String forgot(@RequestParam String email) {
        return service.forgotPassword(email);
    }

    // Step 2: Verify OTP only (frontend uses this to unlock the password fields)
    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestParam String email,
                            @RequestParam String otp) {
        return service.verifyOtp(email, otp);
    }

    // Step 3: Reset password (re-validates OTP + sets new password)
    @PostMapping("/reset-password")
    public String reset(@RequestParam String email,
                        @RequestParam String otp,
                        @RequestParam String password) {
        return service.resetPassword(email, otp, password);
    }
}