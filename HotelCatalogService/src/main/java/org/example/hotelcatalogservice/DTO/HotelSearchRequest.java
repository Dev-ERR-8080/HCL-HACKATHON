package org.example.hotelcatalogservice.DTO;

import lombok.Data;

import java.util.List;

@Data
public class HotelSearchRequest {

    private String city;
    private Double minPrice;
    private Double maxPrice;
    private Double rating;
    private List<String> amenities;
}