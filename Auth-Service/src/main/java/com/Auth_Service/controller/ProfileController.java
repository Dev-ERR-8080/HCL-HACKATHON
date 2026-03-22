package com.Auth_Service.controller;

import com.Auth_Service.dto.ProfileRequest;
import com.Auth_Service.entity.UserProfile;
import com.Auth_Service.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")  // ✅ FIXED: was "/profile" — must match gateway route
public class ProfileController {

    @Autowired
    private ProfileService service;

    // ✅ FIXED: removed JwtUtil dependency entirely.
    //    The gateway already validated the JWT and injected X-User-Email header.
    //    Reading email directly from the header is simpler and correct.
    @PostMapping
    public UserProfile save(
            @RequestHeader("X-User-Email") String email,
            @RequestBody ProfileRequest req) {
        return service.save(email, req);
    }

    // ✅ ADDED: GET profile endpoint that ProfileService.get() now supports
    @GetMapping
    public UserProfile get(
            @RequestHeader("X-User-Email") String email) {
        return service.get(email);
    }
}