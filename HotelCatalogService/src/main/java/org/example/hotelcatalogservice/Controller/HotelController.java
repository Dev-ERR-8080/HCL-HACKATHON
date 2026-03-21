package org.example.hotelcatalogservice.Controller;

import lombok.RequiredArgsConstructor;
import org.example.hotelcatalogservice.DTO.HotelDetailsResponse;
import org.example.hotelcatalogservice.DTO.HotelSearchRequest;
import org.example.hotelcatalogservice.DTO.HotelSearchResult;
import org.example.hotelcatalogservice.Services.HotelSearchService;
import org.example.hotelcatalogservice.Services.HotelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelSearchService hotelSearchService;
    private final HotelService hotelService;

    // 🔍 1. SEARCH HOTELS
    @PostMapping("/search")
    public ResponseEntity<HotelSearchResult> searchHotels(
            @RequestBody HotelSearchRequest request
    ) {
        HotelSearchResult result = hotelSearchService.searchHotels(request);
        return ResponseEntity.ok(result);
    }

    // 🏨 2. GET HOTEL DETAILS
    @GetMapping("/{hotelId}")
    public ResponseEntity<HotelDetailsResponse> getHotelDetails(
            @PathVariable Long hotelId
    ) {
        HotelDetailsResponse response = hotelService.getHotelDetails(hotelId);
        return ResponseEntity.ok(response);
    }

}