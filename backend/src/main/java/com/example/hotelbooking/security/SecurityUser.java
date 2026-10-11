package com.example.hotelbooking.security;

import com.example.hotelbooking.entity.User;

public class SecurityUser {

    private final User user;

    public SecurityUser(User user) {
        this.user = user;
    }

    public User getUser() {
        return user;
    }
}