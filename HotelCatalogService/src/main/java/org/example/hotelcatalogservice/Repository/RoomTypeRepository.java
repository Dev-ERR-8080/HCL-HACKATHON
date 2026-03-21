package org.example.hotelcatalogservice.Repository;

import org.example.hotelcatalogservice.Entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, Long> {

    List<RoomType> findByHotel_HotelId(Long hotelId);

}
