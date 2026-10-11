package com.example.hotelbooking.dto;

import java.math.BigDecimal;

public class RoomResponse {

    private Long id;
    private Long hotelId;
    private String roomNumber;
    private String roomType;
    private BigDecimal price;
    private Integer capacity;
    private String status;

    public RoomResponse() {
    }

    public RoomResponse(
            Long id,
            Long hotelId,
            String roomNumber,
            String roomType,
            BigDecimal price,
            Integer capacity,
            String status
    ) {
        this.id = id;
        this.hotelId = hotelId;
        this.roomNumber = roomNumber;
        this.roomType = roomType;
        this.price = price;
        this.capacity = capacity;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public Long getHotelId() {
        return hotelId;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public String getRoomType() {
        return roomType;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public String getStatus() {
        return status;
    }
}