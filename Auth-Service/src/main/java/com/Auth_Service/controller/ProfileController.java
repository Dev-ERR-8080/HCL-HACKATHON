package com.Auth_Service.controller;

import com.Auth_Service.config.JwtUtil;
import com.Auth_Service.dto.ProfileRequest;
import com.Auth_Service.entity.UserProfile;
import com.Auth_Service.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService service;

    @Autowired
    private JwtUtil jwt;

    @PostMapping
    public UserProfile save(
            @RequestHeader("Authorization") String token,
            @RequestBody ProfileRequest req) {

        String email = jwt.extractEmail(token.replace("Bearer ", ""));
        return service.save(email, req);
    }
}
