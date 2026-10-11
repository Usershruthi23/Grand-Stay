package com.example.hotelbooking.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.hotelbooking.dto.AuthResponse;
import com.example.hotelbooking.dto.RegisterRequest;
import com.example.hotelbooking.entity.Role;
import com.example.hotelbooking.entity.User;
import com.example.hotelbooking.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse(
                    false,
                    "Email already registered",
                    null,
                    null,
                    null,
                    null,
                    null
            );
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );
        user.setRole(Role.CUSTOMER);

        User savedUser = userRepository.save(user);

        return new AuthResponse(
                true,
                "Registration successful",
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole().name(),
                null
        );
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElse(null);
    }
}