package org.example.hotelcatalogservice.Services;

import lombok.RequiredArgsConstructor;
import org.example.hotelcatalogservice.DTO.HotelDetailsResponse;
import org.example.hotelcatalogservice.DTO.RoomResponse;
import org.example.hotelcatalogservice.DTO.RoomTypeResponse;
import org.example.hotelcatalogservice.Entity.Hotel;
import org.example.hotelcatalogservice.Entity.Room;
import org.example.hotelcatalogservice.Entity.RoomType;
import org.example.hotelcatalogservice.Repository.HotelAmenityRepository;
import org.example.hotelcatalogservice.Repository.HotelRepository;
import org.example.hotelcatalogservice.Repository.RoomRepository;
import org.example.hotelcatalogservice.Repository.RoomTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final RoomRepository roomRepository;
    private final HotelAmenityRepository hotelAmenityRepository;

    public HotelDetailsResponse getHotelDetails(Long hotelId) {

        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        List<String> amenities = hotelAmenityRepository
                .findAmenitiesByHotelId(hotelId);

        List<RoomType> roomTypes = roomTypeRepository
                .findByHotel_HotelId(hotelId);

        List<RoomTypeResponse> roomTypeResponses = roomTypes.stream().map(rt -> {

            List<Room> rooms = roomRepository.findByRoomTypeId(rt.getRoomTypeId());

            List<RoomResponse> roomResponses = rooms.stream().map(r ->
                    new RoomResponse(
                            r.getRoomId(),
                            r.getRoomNumber(),
                            r.getPricePerNight(),
                            true // availability will come later
                    )
            ).toList();

            return new RoomTypeResponse(
                    rt.getRoomTypeId(),
                    rt.getTypeName(),
                    rt.getMaxOccupancy(),
                    roomResponses
            );

        }).toList();

        return new HotelDetailsResponse(
                hotel.getHotelId(),
                hotel.getName(),
                hotel.getCity(),
                hotel.getRating(),
                amenities,
                roomTypeResponses
        );
    }
}