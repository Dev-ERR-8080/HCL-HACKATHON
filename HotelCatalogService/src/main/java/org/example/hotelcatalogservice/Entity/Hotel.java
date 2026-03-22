package org.example.hotelcatalogservice.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "hotels")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long hotelId;

    private String name;

    @Column(length = 1000)
    private String description;

    private String address;
    private String city;
    private String state;
    private String country;

    private Double latitude;
    private Double longitude;

    private Double rating;

    private LocalDateTime createdAt;

    // ✅ ADDED: required for the JPQL "JOIN h.roomTypes rt" in HotelSearchRepository.
    //    Without this relationship, the JPQL query throws a "could not resolve property" error.
    @OneToMany(mappedBy = "hotel", fetch = FetchType.LAZY)
    private List<RoomType> roomTypes;
}