package org.example.hotelcatalogservice.Repository;

import org.example.hotelcatalogservice.Entity.HotelAmenity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelAmenityRepository extends JpaRepository<HotelAmenity, Long> {

    @Query("SELECT ha.amenity.name FROM HotelAmenity ha WHERE ha.hotel.hotelId = :hotelId")
    List<String> findAmenitiesByHotelId(@Param("hotelId") Long hotelId);

}