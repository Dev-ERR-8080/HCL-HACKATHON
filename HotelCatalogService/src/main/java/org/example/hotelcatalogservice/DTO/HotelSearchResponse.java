package org.example.hotelcatalogservice.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HotelSearchResponse {

    private Long hotelId;
    private String name;
    private String city;
    private Double rating;
    private List<String> amenities;
    // ✅ ADDED: frontend needs a price to display on HotelCard.
    //    This is the cheapest room price in the hotel.
    private Double minPrice;
}