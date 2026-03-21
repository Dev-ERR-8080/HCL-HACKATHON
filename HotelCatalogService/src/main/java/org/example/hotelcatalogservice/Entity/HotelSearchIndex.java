package org.example.hotelcatalogservice.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "hotel_search_index")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelSearchIndex {

    @Id
    private Long hotelId;

    private String city;

    private Double priceMin;
    private Double priceMax;

    private Double rating;

    @Column(columnDefinition = "TEXT")
    private String amenities; // JSON string

    private Double latitude;
    private Double longitude;
}