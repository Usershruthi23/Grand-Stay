package com.example.hotelbooking.dto;

public class AuthResponse {

    private boolean success;
    private String message;
    private Long userId;
    private String name;
    private String email;
    private String role;
    private Long hotelId;

    public AuthResponse() {
    }

    public AuthResponse(
            boolean success,
            String message,
            Long userId,
            String name,
            String email,
            String role,
            Long hotelId
    ) {
        this.success = success;
        this.message = message;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.hotelId = hotelId;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public Long getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public Long getHotelId() {
        return hotelId;
    }
}
