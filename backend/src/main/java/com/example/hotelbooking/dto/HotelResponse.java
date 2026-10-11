package com.example.hotelbooking.dto;

public class HotelResponse {

    private Long id;
    private String name;
    private String location;
    private String description;
    private String contact;
    private String imageUrl;

    public HotelResponse() {
    }

    public HotelResponse(
            Long id,
            String name,
            String location,
            String description,
            String contact,
            String imageUrl
    ) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.description = description;
        this.contact = contact;
        this.imageUrl = imageUrl;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getLocation() {
        return location;
    }

    public String getDescription() {
        return description;
    }

    public String getContact() {
        return contact;
    }

    public String getImageUrl() {
        return imageUrl;
    }
}