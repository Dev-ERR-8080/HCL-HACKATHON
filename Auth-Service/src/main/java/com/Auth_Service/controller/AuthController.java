package com.Auth_Service.controller;

import com.Auth_Service.dto.LoginRequest;
import com.Auth_Service.dto.RegisterRequest;
import com.Auth_Service.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService service;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest req) {
        return service.register(req);
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest req, HttpServletResponse response) {
        String token = service.login(req);

        // ✅ SameSite=Lax — required for cookie to work across ports (3000 → 8080)
        String cookieHeader = String.format(
                "JWT=%s; Path=/; Max-Age=86400; HttpOnly; SameSite=Lax",
                token
        );
        response.addHeader("Set-Cookie", cookieHeader);

        return "Login successful";
    }

    @PostMapping("/logout")
    public String logout(HttpServletResponse response) {
        // Expire the cookie immediately
        response.addHeader("Set-Cookie",
                "JWT=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax");
        return "Logged out successfully";
    }

    @PostMapping("/forgot-password")
    public String forgot(@RequestParam String email) {
        return service.forgotPassword(email);
    }

    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestParam String email, @RequestParam String otp) {
        return service.verifyOtp(email, otp);
    }

    @PostMapping("/reset-password")
    public String reset(@RequestParam String email,
                        @RequestParam String otp,
                        @RequestParam String password) {
        return service.resetPassword(email, otp, password);
    }

    // Called by AuthContext on mount to restore session
    @GetMapping("/me")
    public ResponseEntity<String> me(
            @RequestHeader(value = "X-User-Email", required = false) String email) {
        if (email == null || email.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }
        return ResponseEntity.ok(email);
    }
}