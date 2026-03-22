package org.example.hotelcatalogservice.Services;

import lombok.RequiredArgsConstructor;
import org.example.hotelcatalogservice.DTO.HotelSearchRequest;
import org.example.hotelcatalogservice.DTO.HotelSearchResponse;
import org.example.hotelcatalogservice.DTO.HotelSearchResult;
import org.example.hotelcatalogservice.Entity.Hotel;
import org.example.hotelcatalogservice.Repository.HotelAmenityRepository;
import org.example.hotelcatalogservice.Repository.HotelSearchRepository;
import org.example.hotelcatalogservice.Repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HotelSearchService {

    private final HotelSearchRepository hotelSearchRepository;
    private final HotelAmenityRepository hotelAmenityRepository;
    private final RoomRepository roomRepository; // ✅ needed for minPrice

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

            // ✅ Cheapest room price for this hotel — shown on HotelCard
            Double minPrice = roomRepository.findRoomsByHotelId(hotel.getHotelId())
                    .stream()
                    .map(r -> r.getPricePerNight())
                    .filter(p -> p != null)
                    .min(Double::compareTo)
                    .orElse(0.0);

            return new HotelSearchResponse(
                    hotel.getHotelId(),
                    hotel.getName(),
                    hotel.getCity(),
                    hotel.getRating(),
                    amenities,
                    minPrice
            );

        }).toList();

        return new HotelSearchResult(responseList, responseList.size());
    }
}