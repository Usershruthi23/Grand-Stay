package com.example.hotelbooking.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.hotelbooking.dto.RoomResponse;
import com.example.hotelbooking.entity.Room;
import com.example.hotelbooking.repository.RoomRepository;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public List<RoomResponse> getRoomsByHotel(Long hotelId) {

        return roomRepository.findByHotelId(hotelId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public RoomResponse getRoomById(Long id) {

        Room room = roomRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Room not found"));

        return toResponse(room);
    }

    private RoomResponse toResponse(Room room) {

        return new RoomResponse(
                room.getId(),
                room.getHotel().getId(),
                room.getRoomNumber(),
                room.getRoomType().name(),
                room.getPrice(),
                room.getCapacity(),
                room.getStatus().name()
        );
    }
}