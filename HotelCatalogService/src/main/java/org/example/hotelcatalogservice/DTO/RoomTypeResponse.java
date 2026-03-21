package org.example.hotelcatalogservice.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomTypeResponse {

    private Long roomTypeId;
    private String typeName;
    private Integer maxOccupancy;
    private List<RoomResponse> rooms;
}
