package com.example.hotelbooking.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hotelbooking.entity.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByHotelId(Long hotelId);

    Optional<Room> findByHotelIdAndRoomNumber(
            Long hotelId,
            String roomNumber
    );

    boolean existsByHotelIdAndRoomNumber(
            Long hotelId,
            String roomNumber
    );
}