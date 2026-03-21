package org.example.hotelcatalogservice.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HotelSearchResult {

    private List<HotelSearchResponse> hotels;
    private int totalResults;
}