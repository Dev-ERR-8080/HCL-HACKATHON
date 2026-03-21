package com.Auth_Service.repository;

import com.Auth_Service.entity.PasswordResetToken;
import com.Auth_Service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    Optional<PasswordResetToken> findByUser(User user); // ✅ needed for OTP lookup by user
}