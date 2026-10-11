package com.example.hotelbooking.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hotelbooking.dto.RoomResponse;
import com.example.hotelbooking.service.RoomService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("/hotels/{hotelId}/rooms")
    public List<RoomResponse> getRoomsByHotel(
            @PathVariable Long hotelId
    ) {
        return roomService.getRoomsByHotel(hotelId);
    }

    @GetMapping("/rooms/{id}")
    public RoomResponse getRoomById(
            @PathVariable Long id
    ) {
        return roomService.getRoomById(id);
    }
}