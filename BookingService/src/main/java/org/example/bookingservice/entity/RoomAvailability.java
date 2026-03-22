package org.example.bookingservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "room_availability",
        uniqueConstraints = {
                // ✅ FIXED: "date" is a reserved keyword in MySQL — using "availability_date" instead.
                //    Without this fix, Hibernate throws a SQL syntax error on table creation
                //    which causes the booking service to crash on startup with a 500.
                @UniqueConstraint(columnNames = {"room_id", "availability_date"})
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_id")
    private Long roomId;

    // ✅ FIXED: renamed column from "date" (reserved word) to "availability_date"
    @Column(name = "availability_date")
    private LocalDate date;

    @Column(name = "is_available")
    private Boolean isAvailable;

    @Column(name = "booking_id")
    private Long bookingId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}