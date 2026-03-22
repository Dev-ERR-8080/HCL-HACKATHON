package com.Auth_Service.controller;

import com.Auth_Service.dto.LoginRequest;
import com.Auth_Service.dto.RegisterRequest;
import com.Auth_Service.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")  // ✅ FIXED: was "/auth" — must match gateway route AND frontend api.js
public class AuthController {

    @Autowired
    private AuthService service;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest req) {
        return service.register(req);
    }

    // ✅ FIXED: login now sets the JWT as an HttpOnly cookie instead of returning
    //    it as a plain string. The frontend no longer needs to handle the token —
    //    the browser sends it automatically on every subsequent request.
    @PostMapping("/login")
    public String login(@RequestBody LoginRequest req, HttpServletResponse response) {
        String token = service.login(req);

        Cookie jwtCookie = new Cookie("JWT", token);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(86400); // 1 day
        // jwtCookie.setSecure(true); // ← enable in production (HTTPS)
        response.addCookie(jwtCookie);

        return "Login successful";
    }

    // ✅ FIXED: logout endpoint clears the cookie
    @PostMapping("/logout")
    public String logout(HttpServletResponse response) {
        Cookie jwtCookie = new Cookie("JWT", "");
        jwtCookie.setHttpOnly(true);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(0); // immediately expire
        response.addCookie(jwtCookie);
        return "Logged out successfully";
    }

    @PostMapping("/forgot-password")
    public String forgot(@RequestParam String email) {
        return service.forgotPassword(email);
    }

    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestParam String email,
                            @RequestParam String otp) {
        return service.verifyOtp(email, otp);
    }

    @PostMapping("/reset-password")
    public String reset(@RequestParam String email,
                        @RequestParam String otp,
                        @RequestParam String password) {
        return service.resetPassword(email, otp, password);
    }

    // ✅ ADDED: called by AuthContext on mount to restore session.
    //    Gateway validates the JWT cookie and injects X-User-Email — we just return it.
    @GetMapping("/me")
    public ResponseEntity<String> me(
            @RequestHeader(value = "X-User-Email", required = false) String email) {
        if (email == null || email.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }
        return ResponseEntity.ok(email);
    }
}