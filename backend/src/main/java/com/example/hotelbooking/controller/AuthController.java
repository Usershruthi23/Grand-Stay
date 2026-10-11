package com.example.hotelbooking.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hotelbooking.dto.AuthResponse;
import com.example.hotelbooking.dto.LoginRequest;
import com.example.hotelbooking.dto.MessageResponse;
import com.example.hotelbooking.dto.RegisterRequest;
import com.example.hotelbooking.entity.User;
import com.example.hotelbooking.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import com.example.hotelbooking.repository.HotelRepository;
import com.example.hotelbooking.entity.Hotel;
import com.example.hotelbooking.entity.Role;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final PasswordEncoder passwordEncoder;
    private final HotelRepository hotelRepository;

    public AuthController(
            AuthService authService,
            PasswordEncoder passwordEncoder,
            HotelRepository hotelRepository
    ) {
        this.authService = authService;
        this.passwordEncoder = passwordEncoder;
        this.hotelRepository = hotelRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        AuthResponse response = authService.register(request);

        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse
    ) {

        User user = authService.findByEmail(request.getEmail());

        if (user == null ||
                !passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                )) {

            return ResponseEntity.status(401).body(
                    new AuthResponse(
                            false,
                            "Invalid email or password",
                            null,
                            null,
                            null,
                            null,
                            null
                    )
            );
        }

        Authentication authentication =
                new UsernamePasswordAuthenticationToken(
                        user.getEmail(),
                        null,
                        java.util.List.of(
                                new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                        "ROLE_" + user.getRole().name()
                                )
                        )
                );

        SecurityContext context =
                SecurityContextHolder.createEmptyContext();

        context.setAuthentication(authentication);

        SecurityContextHolder.setContext(context);

        HttpSession session = httpRequest.getSession(true);

        session.setAttribute("userId", user.getId());
        session.setAttribute("userRole", user.getRole().name());

        HttpSessionSecurityContextRepository securityContextRepository =
                new HttpSessionSecurityContextRepository();

        securityContextRepository.saveContext(
                context,
                httpRequest,
                httpResponse
        );

        Long hotelId = null;
        if (user.getRole() == Role.HOTEL_ADMIN) {
            hotelId = hotelRepository.findByAdminId(user.getId())
                    .map(Hotel::getId)
                    .orElse(null);
        }

        return ResponseEntity.ok(
                new AuthResponse(
                        true,
                        "Login successful",
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole().name(),
                        hotelId
                )
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(
            HttpSession session
    ) {

        SecurityContextHolder.clearContext();

        session.invalidate();

        return ResponseEntity.ok(
                new MessageResponse(
                        true,
                        "Logout successful"
                )
        );
    }
}