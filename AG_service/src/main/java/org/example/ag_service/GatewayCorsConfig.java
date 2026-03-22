package org.example.ag_service;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class GatewayCorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // ✅ Allow both the React frontend AND the auth service itself
        //    (auth service redirects back to 3000 after OAuth2, browser needs
        //    the cookie to be accepted by the gateway on subsequent requests)
        config.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "http://localhost:8081"   // auth-service (OAuth2 redirect origin)
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Content-Type", "Authorization", "X-User-Email", "X-User-Id", "X-User-Role"));
        config.setAllowCredentials(true); // ✅ required for cookies to be sent cross-origin
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsWebFilter(source);
    }
}