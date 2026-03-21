package com.Auth_Service.service;

import com.Auth_Service.config.JwtUtil;
import com.Auth_Service.dto.LoginRequest;
import com.Auth_Service.dto.RegisterRequest;
import com.Auth_Service.entity.PasswordResetToken;
import com.Auth_Service.entity.User;
import com.Auth_Service.repository.PasswordResetTokenRepository;
import com.Auth_Service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtil jwt;

    @Autowired
    private PasswordResetTokenRepository tokenRepo;

    @Autowired
    private EmailService emailService;

    public String register(RegisterRequest req) {

        if (userRepo.findByEmail(req.getEmail()).isPresent())
            throw new RuntimeException("Email already exists");

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(encoder.encode(req.getPassword()));

        userRepo.save(user);
        return "Registered successfully";
    }

    public String login(LoginRequest req) {

        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("No account found with this email"));

        if (!encoder.matches(req.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid password");

        return jwt.generateToken(user.getEmail());
    }

    public String forgotPassword(String email) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account found with email: " + email));

        String token = UUID.randomUUID().toString();

        PasswordResetToken t = new PasswordResetToken();
        t.setToken(token);
        t.setUser(user);
        t.setExpiryDate(LocalDateTime.now().plusMinutes(15));

        tokenRepo.save(t);

        emailService.sendResetEmail(email, token);

        return "Password reset email sent";
    }

    public String resetPassword(String token, String newPass) {

        PasswordResetToken t = tokenRepo.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));

        if (t.getExpiryDate().isBefore(LocalDateTime.now()))
            throw new RuntimeException("Reset token has expired");

        User user = t.getUser();
        user.setPassword(encoder.encode(newPass));
        userRepo.save(user);

        tokenRepo.delete(t); // ✅ clean up used token

        return "Password updated successfully";
    }
}