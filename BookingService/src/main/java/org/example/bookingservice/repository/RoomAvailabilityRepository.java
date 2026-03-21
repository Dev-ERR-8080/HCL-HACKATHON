package org.example.bookingservice.repository;

import org.example.bookingservice.entity.RoomAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface RoomAvailabilityRepository extends JpaRepository<RoomAvailability, Long> {

    @Query("""
        SELECT COUNT(r) FROM RoomAvailability r
        WHERE r.roomId = :roomId
        AND r.date BETWEEN :startDate AND :endDate
        AND r.isAvailable = false
    """)
    long countUnavailableDates(
            Long roomId,
            LocalDate startDate,
            LocalDate endDate
    );

}