package org.example.hotelcatalogservice.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomResponse {

    private Long roomId;
    private String roomNumber;
    private Double pricePerNight;
    private Boolean available;
}