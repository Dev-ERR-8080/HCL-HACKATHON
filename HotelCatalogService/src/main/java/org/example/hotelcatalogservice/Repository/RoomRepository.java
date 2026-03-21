package org.example.hotelcatalogservice.Repository;

import org.example.hotelcatalogservice.Entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    // Get rooms of a specific hotel
    @Query("SELECT r FROM Room r WHERE r.roomType.hotel.hotelId = :hotelId")
    List<Room> findRoomsByHotelId(@Param("hotelId") Long hotelId);

    @Query("SELECT r FROM Room r WHERE r.roomType.roomTypeId = :roomTypeId")
    List<Room> findByRoomTypeId(Long roomTypeId);
}