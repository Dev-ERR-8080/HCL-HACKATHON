package org.example.hotelcatalogservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient  // ✅ THIS was missing — required for Eureka registration
public class HotelCatalogServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(HotelCatalogServiceApplication.class, args);
    }
}