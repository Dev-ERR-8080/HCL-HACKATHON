package org.example.hotelcatalogservice.Repository;

import org.example.hotelcatalogservice.Entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {

    // Search by city
    List<Hotel> findByCityIgnoreCase(String city);

    // Search by rating
    List<Hotel> findByRatingGreaterThanEqual(Double rating);

}
