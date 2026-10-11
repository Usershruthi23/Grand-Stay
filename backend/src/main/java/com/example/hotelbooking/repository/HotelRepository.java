package com.example.hotelbooking.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hotelbooking.entity.Hotel;
import com.example.hotelbooking.entity.User;

public interface HotelRepository extends JpaRepository<Hotel, Long> {

    Optional<Hotel> findByAdmin(User admin);

    Optional<Hotel> findByAdminId(Long adminId);

    Optional<Hotel> findByAdminEmail(String email);

    boolean existsByName(String name);
}