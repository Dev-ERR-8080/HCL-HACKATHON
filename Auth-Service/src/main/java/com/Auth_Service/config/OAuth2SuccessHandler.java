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
        String name = user.getAttribute("name");

        User db = repo.findByEmail(email).orElseGet(() -> {
            User u = new User();
            u.setEmail(email);
            u.setName(name);
            u.setProvider("GOOGLE");
            return repo.save(u);
        });

        String token = jwt.generateToken(db.getEmail());

        res.sendRedirect("http://localhost:3000?token=" + token);
    }
}
