package org.example.hotelcatalogservice.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "room_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roomTypeId;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

    private String typeName; // Deluxe, Suite

    private String description;

    private Integer maxOccupancy;
}