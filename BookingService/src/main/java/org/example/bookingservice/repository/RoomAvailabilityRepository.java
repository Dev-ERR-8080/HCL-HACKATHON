package org.example.bookingservice.repository;

import org.example.bookingservice.entity.RoomAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RoomAvailabilityRepository extends JpaRepository<RoomAvailability, Long> {

    // ✅ JPQL uses the Java field name "r.date" — not the column name "availability_date"
    @Query("""
        SELECT COUNT(r) FROM RoomAvailability r
        WHERE r.roomId = :roomId
        AND r.date BETWEEN :startDate AND :endDate
        AND r.isAvailable = false
    """)
    long countUnavailableDates(
            @Param("roomId") Long roomId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    List<RoomAvailability> findByBookingId(Long bookingId);
}