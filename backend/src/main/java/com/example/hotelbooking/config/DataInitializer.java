package com.example.hotelbooking.config;

import java.math.BigDecimal;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.hotelbooking.entity.Hotel;
import com.example.hotelbooking.entity.Role;
import com.example.hotelbooking.entity.Room;
import com.example.hotelbooking.entity.RoomStatus;
import com.example.hotelbooking.entity.RoomType;
import com.example.hotelbooking.entity.User;
import com.example.hotelbooking.repository.HotelRepository;
import com.example.hotelbooking.repository.RoomRepository;
import com.example.hotelbooking.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            HotelRepository hotelRepository,
            RoomRepository roomRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Create Default Customer if not present
        if (!userRepository.existsByEmail("customer@gmail.com")) {
            User customer = new User("John Customer", "customer@gmail.com", passwordEncoder.encode("password123"), Role.CUSTOMER);
            userRepository.save(customer);
        }

        // 2. Hotel A: Hotel Paradise (Hyderabad)
        if (!hotelRepository.existsByName("Hotel Paradise")) {
            User adminA = userRepository.findByEmail("admina@gmail.com").orElseGet(() -> {
                User u = new User("Admin Alpha", "admina@gmail.com", passwordEncoder.encode("password123"), Role.HOTEL_ADMIN);
                return userRepository.save(u);
            });
            Hotel hotelA = new Hotel(
                    "Hotel Paradise",
                    "Hyderabad",
                    "Luxury stay with ocean view and premium amenities in Hyderabad.",
                    "+91 9876543210",
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
                    adminA
            );
            hotelRepository.save(hotelA);
            createRoom(hotelA, "101", RoomType.SINGLE, new BigDecimal("1500.00"), 1);
            createRoom(hotelA, "102", RoomType.DOUBLE, new BigDecimal("2500.00"), 2);
            createRoom(hotelA, "103", RoomType.DELUXE, new BigDecimal("4000.00"), 3);
        }

        // 3. Hotel B: Hotel Royal Stay (Hyderabad)
        if (!hotelRepository.existsByName("Hotel Royal Stay")) {
            User adminB = userRepository.findByEmail("adminb@gmail.com").orElseGet(() -> {
                User u = new User("Admin Beta", "adminb@gmail.com", passwordEncoder.encode("password123"), Role.HOTEL_ADMIN);
                return userRepository.save(u);
            });
            Hotel hotelB = new Hotel(
                    "Hotel Royal Stay",
                    "Hyderabad",
                    "Grand heritage hotel featuring executive suites, regal courtyards and fine dining.",
                    "+91 9123456789",
                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
                    adminB
            );
            hotelRepository.save(hotelB);
            createRoom(hotelB, "201", RoomType.DOUBLE, new BigDecimal("3000.00"), 2);
            createRoom(hotelB, "202", RoomType.SUITE, new BigDecimal("6000.00"), 4);
        }

        // 4. Hotel C: The Imperial Bay (Mumbai)
        if (!hotelRepository.existsByName("The Imperial Bay")) {
            User adminC = userRepository.findByEmail("adminc@gmail.com").orElseGet(() -> {
                User u = new User("Admin Gamma", "adminc@gmail.com", passwordEncoder.encode("password123"), Role.HOTEL_ADMIN);
                return userRepository.save(u);
            });
            Hotel hotelC = new Hotel(
                    "The Imperial Bay",
                    "Mumbai",
                    "Prestigious skyline resort along Marine Drive with infinity pool and panoramic Arabian sea vistas.",
                    "+91 9822334455",
                    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
                    adminC
            );
            hotelRepository.save(hotelC);
            createRoom(hotelC, "301", RoomType.DOUBLE, new BigDecimal("4500.00"), 2);
            createRoom(hotelC, "302", RoomType.DELUXE, new BigDecimal("6500.00"), 3);
            createRoom(hotelC, "303", RoomType.SUITE, new BigDecimal("9500.00"), 4);
        }

        // 5. Hotel D: Taj Sunset Beach Resort (Goa)
        if (!hotelRepository.existsByName("Taj Sunset Beach Resort")) {
            User adminD = userRepository.findByEmail("admind@gmail.com").orElseGet(() -> {
                User u = new User("Admin Delta", "admind@gmail.com", passwordEncoder.encode("password123"), Role.HOTEL_ADMIN);
                return userRepository.save(u);
            });
            Hotel hotelD = new Hotel(
                    "Taj Sunset Beach Resort",
                    "Goa",
                    "Exquisite beachfront villas surrounded by swaying coconut palms, private beach access and sunset bar.",
                    "+91 9766554433",
                    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
                    adminD
            );
            hotelRepository.save(hotelD);
            createRoom(hotelD, "401", RoomType.DELUXE, new BigDecimal("5500.00"), 2);
            createRoom(hotelD, "402", RoomType.SUITE, new BigDecimal("8500.00"), 4);
        }

        // 6. Hotel E: The Silicon Oasis Suites (Bengaluru)
        if (!hotelRepository.existsByName("The Silicon Oasis Suites")) {
            User adminE = userRepository.findByEmail("admine@gmail.com").orElseGet(() -> {
                User u = new User("Admin Epsilon", "admine@gmail.com", passwordEncoder.encode("password123"), Role.HOTEL_ADMIN);
                return userRepository.save(u);
            });
            Hotel hotelE = new Hotel(
                    "The Silicon Oasis Suites",
                    "Bengaluru",
                    "Contemporary tech-hub retreat featuring ergonomic business suites, botanical gardens and spa.",
                    "+91 9655443322",
                    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
                    adminE
            );
            hotelRepository.save(hotelE);
            createRoom(hotelE, "501", RoomType.SINGLE, new BigDecimal("2200.00"), 1);
            createRoom(hotelE, "502", RoomType.DOUBLE, new BigDecimal("3800.00"), 2);
            createRoom(hotelE, "503", RoomType.SUITE, new BigDecimal("7000.00"), 3);
        }

        // 7. Hotel F: Royal Rajputana Palace (Jaipur)
        if (!hotelRepository.existsByName("Royal Rajputana Palace")) {
            User adminF = userRepository.findByEmail("adminf@gmail.com").orElseGet(() -> {
                User u = new User("Admin Zeta", "adminf@gmail.com", passwordEncoder.encode("password123"), Role.HOTEL_ADMIN);
                return userRepository.save(u);
            });
            Hotel hotelF = new Hotel(
                    "Royal Rajputana Palace",
                    "Jaipur",
                    "Traditional golden marble palace with handcrafted courtyards, regal suites and evening cultural shows.",
                    "+91 9544332211",
                    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",
                    adminF
            );
            hotelRepository.save(hotelF);
            createRoom(hotelF, "601", RoomType.DOUBLE, new BigDecimal("3500.00"), 2);
            createRoom(hotelF, "602", RoomType.DELUXE, new BigDecimal("5500.00"), 3);
            createRoom(hotelF, "603", RoomType.SUITE, new BigDecimal("8900.00"), 4);
        }
    }

    private void createRoom(Hotel hotel, String roomNumber, RoomType roomType, BigDecimal price, int capacity) {
        Room room = new Room();
        room.setHotel(hotel);
        room.setRoomNumber(roomNumber);
        room.setRoomType(roomType);
        room.setPrice(price);
        room.setCapacity(capacity);
        room.setStatus(RoomStatus.AVAILABLE);
        roomRepository.save(room);
    }
}
