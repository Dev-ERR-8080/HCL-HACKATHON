package org.example.ag_service.security;

import io.jsonwebtoken.Claims;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class JwtCookieGatewayFilter implements GlobalFilter, Ordered {

    private final JwtUtil jwtUtil;

    public JwtCookieGatewayFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        String path = exchange.getRequest().getURI().getPath();
        System.out.println("JWT Filter hit for path: " + path);

        // ✅ FIXED: updated public paths to match the new /api/auth/ controller prefix.
        //    /api/auth/me is intentionally NOT listed here — it requires a valid cookie
        //    so the gateway validates it and injects X-User-Email before forwarding.
        if (path.startsWith("/api/auth/register")
                || path.startsWith("/api/auth/login")
                || path.startsWith("/api/auth/forgot-password")
                || path.startsWith("/api/auth/verify-otp")
                || path.startsWith("/api/auth/reset-password")
                || path.startsWith("/api/auth/logout")
                || path.startsWith("/oauth2/")
                || path.startsWith("/login")
                || path.startsWith("/ws")
                || path.startsWith("/eureka")
                || path.startsWith("/actuator")) {
            return chain.filter(exchange);
        }

        // 🍪 Extract JWT cookie
        HttpCookie jwtCookie = exchange.getRequest()
                .getCookies()
                .getFirst("JWT");

        if (jwtCookie == null) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        try {
            Claims claims = jwtUtil.extractClaims(jwtCookie.getValue());

            String email  = claims.getSubject();
            Object roleObj   = claims.get("role");
            Object userIdObj = claims.get("userId");

            // ✅ Null-safe — reject tokens missing required claims
            if (email == null || roleObj == null || userIdObj == null) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            ServerHttpRequest mutatedRequest = exchange.getRequest()
                    .mutate()
                    .header("X-User-Email",  email)
                    .header("X-User-Role",   roleObj.toString())
                    .header("X-User-Id",     userIdObj.toString())
                    .build();

            System.out.println("Email:  " + email);
            System.out.println("Role:   " + roleObj);
            System.out.println("UserId: " + userIdObj);

            return chain.filter(exchange.mutate().request(mutatedRequest).build());

        } catch (Exception e) {
            System.err.println("JWT validation failed: " + e.getMessage());
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
    }

    @Override
    public int getOrder() {
        return -1;
    }
}