package org.example.hotelcatalogservice.Services;

import lombok.RequiredArgsConstructor;
import org.example.hotelcatalogservice.DTO.HotelSearchRequest;
import org.example.hotelcatalogservice.DTO.HotelSearchResponse;
import org.example.hotelcatalogservice.DTO.HotelSearchResult;
import org.example.hotelcatalogservice.Entity.Hotel;
import org.example.hotelcatalogservice.Repository.HotelAmenityRepository;
import org.example.hotelcatalogservice.Repository.HotelSearchRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor // ✅ FIXED: replaced manual constructor (which accepted RoomRepository
//    but never assigned it — silent dead code) with Lombok @RequiredArgsConstructor
public class HotelSearchService {

    private final HotelSearchRepository hotelSearchRepository;
    private final HotelAmenityRepository hotelAmenityRepository;
    // RoomRepository removed — it was injected but never used in this service

    public HotelSearchResult searchHotels(HotelSearchRequest request) {

        List<Hotel> hotels = hotelSearchRepository.searchHotelsDynamic(
                request.getCity(),
                request.getMinPrice(),
                request.getMaxPrice(),
                request.getRating()
        );

        List<HotelSearchResponse> responseList = hotels.stream().map(hotel -> {

            List<String> amenities = hotelAmenityRepository
                    .findAmenitiesByHotelId(hotel.getHotelId());

            return new HotelSearchResponse(
                    hotel.getHotelId(),
                    hotel.getName(),
                    hotel.getCity(),
                    hotel.getRating(),
                    amenities
            );

        }).toList();

        return new HotelSearchResult(responseList, responseList.size());
    }
}