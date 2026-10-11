package com.example.hotelbooking.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        // Static frontend files
                        .requestMatchers(
                                "/",
                                "/*.html",
                                "/admin/*.html",
                                "/css/**",
                                "/js/**",
                                "/favicon.ico"
                        ).permitAll()

                        // Authentication
                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()

                        // Public hotel browsing
                        .requestMatchers(
                                "/api/hotels/**",
                                "/api/rooms/**"
                        ).permitAll()

                        // Customer APIs
                        .requestMatchers(
                                "/api/bookings/**"
                        ).hasRole("CUSTOMER")

                        // Hotel Admin APIs
                        .requestMatchers(
                                "/api/admin/**"
                        ).hasRole("HOTEL_ADMIN")

                        // Everything else requires login
                        .anyRequest().authenticated()
                )

                // We are using our own JSON login endpoint.
                .formLogin(form -> form.disable())

                // Do not use HTTP Basic.
                .httpBasic(basic -> basic.disable());

        return http.build();
    }
}