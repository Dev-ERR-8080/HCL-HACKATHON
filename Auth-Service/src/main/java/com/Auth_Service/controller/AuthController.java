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

    @PostMapping("/forgot-password")
    public String forgot(@RequestParam String email) {
        return service.forgotPassword(email);
    }

    @PostMapping("/reset-password")
    public String reset(@RequestParam String token,
                        @RequestParam String password) {
        return service.resetPassword(token, password);
    }
}