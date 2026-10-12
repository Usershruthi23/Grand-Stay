package com.example.hotelbooking.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.hotelbooking.dto.HotelResponse;
import com.example.hotelbooking.entity.Hotel;
import com.example.hotelbooking.exception.ResourceNotFoundException;
import com.example.hotelbooking.repository.HotelRepository;

@Service
public class HotelService {

    private final HotelRepository hotelRepository;

    public HotelService(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    public List<HotelResponse> getAllHotels() {

        return hotelRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public HotelResponse getHotelById(Long id) {

        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Hotel not found"));

        return toResponse(hotel);
    }

    private HotelResponse toResponse(Hotel hotel) {

        return new HotelResponse(
                hotel.getId(),
                hotel.getName(),
                hotel.getLocation(),
                hotel.getDescription(),
                hotel.getContact(),
                hotel.getImageUrl()
        );
    }
}