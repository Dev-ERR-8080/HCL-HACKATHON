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

        // ─── Public paths — no JWT required ──────────────────────────────────────
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
                || path.startsWith("/actuator")
                // ✅ FIXED: hotel search and details are PUBLIC — guests can browse
                //    without logging in. The 401 on /api/hotels/search was because
                //    this path was not whitelisted, so the gateway rejected it.
                || path.startsWith("/api/hotels/") || path.startsWith("/api/coupons/")) {
            return chain.filter(exchange);
        }

        // ─── Protected paths — JWT cookie required ────────────────────────────────
        HttpCookie jwtCookie = exchange.getRequest()
                .getCookies()
                .getFirst("JWT");

        if (jwtCookie == null) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        try {
            Claims claims = jwtUtil.extractClaims(jwtCookie.getValue());

            String email    = claims.getSubject();
            Object roleObj  = claims.get("role");
            Object userIdObj= claims.get("userId");

            if (email == null || roleObj == null || userIdObj == null) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            ServerHttpRequest mutatedRequest = exchange.getRequest()
                    .mutate()
                    .header("X-User-Email", email)
                    .header("X-User-Role",  roleObj.toString())
                    .header("X-User-Id",    userIdObj.toString())
                    .build();

            return chain.filter(exchange.mutate().request(mutatedRequest).build());

        } catch (Exception e) {
            System.err.println("JWT validation failed: " + e.getMessage());
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
    }

    @Override
    public int getOrder() { return -1; }
}