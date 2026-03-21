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
import java.util.Random;

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
            throw new RuntimeException("An account with this email already exists");

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(encoder.encode(req.getPassword()));
        userRepo.save(user);
        return "Registered successfully";
    }

    public String login(LoginRequest req) {
        // Check if email exists first
        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("No account found with this email"));

        // Then check password
        if (!encoder.matches(req.getPassword(), user.getPassword()))
            throw new RuntimeException("Incorrect password. Please try again.");

        return jwt.generateToken(user.getEmail());
    }

    public String forgotPassword(String email) {
        // Validate email format simply
        if (email == null || !email.contains("@"))
            throw new RuntimeException("Please enter a valid email address");

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account found with this email address"));

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        // Delete any existing OTP for this user
        tokenRepo.findByUser(user).ifPresent(tokenRepo::delete);

        PasswordResetToken t = new PasswordResetToken();
        t.setToken(otp);
        t.setUser(user);
        t.setExpiryDate(LocalDateTime.now().plusMinutes(10));
        tokenRepo.save(t);

        emailService.sendOtpEmail(email, otp);
        return "OTP sent to your email";
    }

    public String verifyOtp(String email, String otp) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account found with this email address"));

        PasswordResetToken t = tokenRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("No OTP found. Please request a new one."));

        if (t.getExpiryDate().isBefore(LocalDateTime.now()))
            throw new RuntimeException("OTP has expired. Please request a new one.");

        if (!t.getToken().equals(otp))
            throw new RuntimeException("Incorrect OTP. Please check your email and try again.");

        return "OTP verified";
    }

    public String resetPassword(String email, String otp, String newPass) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account found with this email address"));

        PasswordResetToken t = tokenRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("No OTP found. Please request a new one."));

        if (t.getExpiryDate().isBefore(LocalDateTime.now()))
            throw new RuntimeException("OTP has expired. Please request a new one.");

        if (!t.getToken().equals(otp))
            throw new RuntimeException("Incorrect OTP. Please try again.");

        user.setPassword(encoder.encode(newPass));
        userRepo.save(user);
        tokenRepo.delete(t);

        return "Password updated successfully";
    }
}