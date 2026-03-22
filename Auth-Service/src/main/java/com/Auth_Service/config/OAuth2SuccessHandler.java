package com.Auth_Service.config;

import com.Auth_Service.entity.User;
import com.Auth_Service.repository.UserRepository;
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

        User db = repo.findByEmail(email).orElseGet(() -> {
            User u = new User();
            u.setEmail(email);
            u.setName(name);
            u.setProvider("GOOGLE");
            u.setRole("USER");
            return repo.save(u);
        });

        String token = jwt.generateToken(db.getEmail(), db.getId(), db.getRole());

        // ✅ FIXED: Set-Cookie header with SameSite=Lax manually because
        //    Jakarta's Cookie API has no SameSite support.
        //    SameSite=Lax is required so the browser keeps the cookie when
        //    Spring redirects from auth-service (8081) → frontend (3000).
        String cookieHeader = String.format(
                "JWT=%s; Path=/; Max-Age=86400; HttpOnly; SameSite=Lax",
                token
        );
        res.addHeader("Set-Cookie", cookieHeader);

        res.sendRedirect("http://localhost:3000");
    }
}