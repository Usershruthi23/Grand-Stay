package com.example.hotelbooking.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.hotelbooking.entity.Booking;
import com.example.hotelbooking.entity.BookingStatus;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Booking> findByRoomIdOrderByCheckInAsc(Long roomId);

    List<Booking> findByRoomHotelIdOrderByCheckInAsc(Long hotelId);

    List<Booking> findByRoomHotelIdAndStatusOrderByCheckInAsc(
            Long hotelId,
            BookingStatus status
    );

    @Query("SELECT b FROM Booking b WHERE b.room.hotel.id = :hotelId AND b.checkIn = :checkIn")
    List<Booking> findByRoomHotelIdAndCheckIn(
            @Param("hotelId") Long hotelId,
            @Param("checkIn") LocalDate checkIn
    );

    @Query("SELECT b FROM Booking b WHERE b.room.hotel.id = :hotelId AND b.checkOut = :checkOut")
    List<Booking> findByRoomHotelIdAndCheckOut(
            @Param("hotelId") Long hotelId,
            @Param("checkOut") LocalDate checkOut
    );

    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.room.id = :roomId AND b.status != :cancelledStatus AND :checkIn < b.checkOut AND :checkOut > b.checkIn")
    boolean existsOverlappingBooking(
            @Param("roomId") Long roomId,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut,
            @Param("cancelledStatus") BookingStatus cancelledStatus
    );
}
