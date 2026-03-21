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
                @UniqueConstraint(columnNames = {"room_id", "date"})
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔹 Room Reference (from Catalog Service)
    private Long roomId;

    // 🔹 Date for which availability is tracked
    private LocalDate date;

    // 🔹 Availability Status
    private Boolean isAvailable;

    // 🔹 Booking Reference (optional but powerful)
    private Long bookingId;

    // 🔹 Audit Fields
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
