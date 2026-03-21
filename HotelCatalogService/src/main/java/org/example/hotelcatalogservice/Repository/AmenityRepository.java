package org.example.hotelcatalogservice.Repository;

import org.example.hotelcatalogservice.Entity.Amenity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AmenityRepository extends JpaRepository<Amenity, Integer> {

    Optional<Amenity> findByNameIgnoreCase(String name);

}