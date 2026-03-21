package org.example.hotelcatalogservice.Repository;

import org.example.hotelcatalogservice.Entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelSearchRepository extends JpaRepository<Hotel, Long> {

    @Query("""
        SELECT DISTINCT h FROM Hotel h
        JOIN RoomType rt ON rt.hotel = h
        JOIN Room r ON r.roomType = rt
        WHERE (:city IS NULL OR LOWER(h.city) = LOWER(:city))
        AND (:minPrice IS NULL OR r.pricePerNight >= :minPrice)
        AND (:maxPrice IS NULL OR r.pricePerNight <= :maxPrice)
        AND (:rating IS NULL OR h.rating >= :rating)
    """)
    List<Hotel> searchHotelsDynamic(
            @Param("city") String city,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("rating") Double rating
    );
}
