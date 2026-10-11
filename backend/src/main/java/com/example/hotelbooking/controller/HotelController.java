package com.example.hotelbooking.controller;

import com.example.hotelbooking.dto.HotelResponse;
import com.example.hotelbooking.service.HotelService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = "*")
public class HotelController {

    private final HotelService hotelService;

    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    @GetMapping
    public List<HotelResponse> getAllHotels() {
        return hotelService.getAllHotels();
    }

    @GetMapping("/{id}")
    public HotelResponse getHotelById(@PathVariable Long id) {
        return hotelService.getHotelById(id);
    }
}