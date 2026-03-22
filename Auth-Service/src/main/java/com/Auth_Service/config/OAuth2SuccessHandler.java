package com.Auth_Service.config;

import com.Auth_Service.entity.User;
import com.Auth_Service.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private UserRepository repo;

    @Autowired
    private JwtUtil jwt;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest req,
                                        HttpServletResponse res,
                                        Authentication auth) throws IOException {

        OAuth2User user = (OAuth2User) auth.getPrincipal();

        String email = user.getAttribute("email");
        String name  = user.getAttribute("name");

        // 🔍 Find or create user in DB
        User db = repo.findByEmail(email).orElseGet(() -> {
            User u = new User();
            u.setEmail(email);
            u.setName(name);
            u.setProvider("GOOGLE");
            u.setRole("USER"); // ✅ make sure your User entity has a role field
            return repo.save(u);
        });

        // ✅ FIXED: generateToken now takes userId and role
        String token = jwt.generateToken(db.getEmail(), db.getId(), db.getRole());

        // ✅ FIXED: send JWT as HttpOnly cookie instead of exposing it in the URL
        Cookie jwtCookie = new Cookie("JWT", token);
        jwtCookie.setHttpOnly(true);   // not accessible via JS — protects against XSS
        jwtCookie.setPath("/");        // available across all paths
        jwtCookie.setMaxAge(86400);    // 1 day (matches token expiry)
        // jwtCookie.setSecure(true);  // ← uncomment in production (HTTPS only)

        res.addCookie(jwtCookie);

        // ✅ Redirect to frontend without token in URL
        res.sendRedirect("http://localhost:3000");
    }
}