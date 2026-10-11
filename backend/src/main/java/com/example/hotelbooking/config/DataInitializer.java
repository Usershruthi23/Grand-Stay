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

        // ── Default Customer ──────────────────────────────────────────────
        if (!userRepository.existsByEmail("customer@gmail.com")) {
            userRepository.save(new User(
                "John Customer", "customer@gmail.com",
                passwordEncoder.encode("password123"), Role.CUSTOMER));
        }

        // ══════════════════════════════════════════════════════════════════
        //  HYDERABAD
        // ══════════════════════════════════════════════════════════════════

        seedHotel(
            "admina@gmail.com", "Admin Alpha",
            "Hotel Paradise", "Hyderabad",
            "Luxury stay with panoramic city views and premium amenities in the heart of Hyderabad.",
            "+91 9876543210",
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
            new RoomSeed[]{
                new RoomSeed("101", RoomType.SINGLE,  new BigDecimal("1500.00"), 1),
                new RoomSeed("102", RoomType.DOUBLE,  new BigDecimal("2500.00"), 2),
                new RoomSeed("103", RoomType.DELUXE,  new BigDecimal("4000.00"), 3),
            }
        );

        seedHotel(
            "adminb@gmail.com", "Admin Beta",
            "Hotel Royal Stay", "Hyderabad",
            "Grand heritage hotel featuring executive suites, regal courtyards and fine Hyderabadi cuisine.",
            "+91 9123456789",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
            new RoomSeed[]{
                new RoomSeed("201", RoomType.DOUBLE, new BigDecimal("3000.00"), 2),
                new RoomSeed("202", RoomType.SUITE,  new BigDecimal("6000.00"), 4),
            }
        );

        // ══════════════════════════════════════════════════════════════════
        //  MUMBAI
        // ══════════════════════════════════════════════════════════════════

        seedHotel(
            "adminc@gmail.com", "Admin Gamma",
            "The Imperial Bay", "Mumbai",
            "Prestigious skyline resort along Marine Drive with infinity pool and panoramic Arabian Sea vistas.",
            "+91 9822334455",
            "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
            new RoomSeed[]{
                new RoomSeed("301", RoomType.DOUBLE, new BigDecimal("4500.00"), 2),
                new RoomSeed("302", RoomType.DELUXE, new BigDecimal("6500.00"), 3),
                new RoomSeed("303", RoomType.SUITE,  new BigDecimal("9500.00"), 4),
            }
        );

        seedHotel(
            "adminm2@gmail.com", "Admin Mumbai2",
            "Sea Breeze Residency", "Mumbai",
            "Boutique hotel steps from Juhu Beach with sea-view balconies, Bollywood brunch and rooftop bar.",
            "+91 9811223344",
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
            new RoomSeed[]{
                new RoomSeed("M201", RoomType.SINGLE, new BigDecimal("3200.00"), 1),
                new RoomSeed("M202", RoomType.DOUBLE, new BigDecimal("5500.00"), 2),
                new RoomSeed("M203", RoomType.SUITE,  new BigDecimal("9000.00"), 4),
            }
        );

        // ══════════════════════════════════════════════════════════════════
        //  GOA
        // ══════════════════════════════════════════════════════════════════

        seedHotel(
            "admind@gmail.com", "Admin Delta",
            "Taj Sunset Beach Resort", "Goa",
            "Exquisite beachfront villas surrounded by coconut palms, private beach access and a world-class sunset bar.",
            "+91 9766554433",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
            new RoomSeed[]{
                new RoomSeed("401", RoomType.DELUXE, new BigDecimal("5500.00"), 2),
                new RoomSeed("402", RoomType.SUITE,  new BigDecimal("8500.00"), 4),
            }
        );

        seedHotel(
            "adming2@gmail.com", "Admin Goa2",
            "Coconut Grove Beach Resort", "Goa",
            "Eco-chic resort nestled between lush palm groves and the Arabian Sea — infinity pool, yoga decks and seafood shacks.",
            "+91 9755443322",
            "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
            new RoomSeed[]{
                new RoomSeed("G101", RoomType.SINGLE, new BigDecimal("2800.00"), 1),
                new RoomSeed("G102", RoomType.DOUBLE, new BigDecimal("4500.00"), 2),
                new RoomSeed("G103", RoomType.DELUXE, new BigDecimal("6800.00"), 3),
            }
        );

        // ══════════════════════════════════════════════════════════════════
        //  BENGALURU
        // ══════════════════════════════════════════════════════════════════

        seedHotel(
            "admine@gmail.com", "Admin Epsilon",
            "The Silicon Oasis Suites", "Bengaluru",
            "Contemporary tech-hub retreat featuring ergonomic business suites, botanical gardens and an award-winning spa.",
            "+91 9655443322",
            "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80",
            new RoomSeed[]{
                new RoomSeed("501", RoomType.SINGLE, new BigDecimal("2200.00"), 1),
                new RoomSeed("502", RoomType.DOUBLE, new BigDecimal("3800.00"), 2),
                new RoomSeed("503", RoomType.SUITE,  new BigDecimal("7000.00"), 3),
            }
        );

        seedHotel(
            "adminb2@gmail.com", "Admin Bengaluru2",
            "Garden City Grand", "Bengaluru",
            "A verdant urban sanctuary blending Bangalore's garden legacy with modern luxury — terrace farms, craft cocktails and co-working studios.",
            "+91 9644332211",
            "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",
            new RoomSeed[]{
                new RoomSeed("B201", RoomType.DOUBLE, new BigDecimal("3500.00"), 2),
                new RoomSeed("B202", RoomType.DELUXE, new BigDecimal("5200.00"), 3),
            }
        );

        // ══════════════════════════════════════════════════════════════════
        //  JAIPUR
        // ══════════════════════════════════════════════════════════════════

        seedHotel(
            "adminf@gmail.com", "Admin Zeta",
            "Royal Rajputana Palace", "Jaipur",
            "Traditional golden-marble palace with handcrafted courtyards, regal suites and captivating evening cultural shows.",
            "+91 9544332211",
            "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
            new RoomSeed[]{
                new RoomSeed("601", RoomType.DOUBLE, new BigDecimal("3500.00"), 2),
                new RoomSeed("602", RoomType.DELUXE, new BigDecimal("5500.00"), 3),
                new RoomSeed("603", RoomType.SUITE,  new BigDecimal("8900.00"), 4),
            }
        );

        seedHotel(
            "adminj2@gmail.com", "Admin Jaipur2",
            "Pink City Heritage Inn", "Jaipur",
            "Boutique haveli hotel in the walled city offering frescoed suites, rooftop dinners and desert safari packages.",
            "+91 9533221100",
            "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
            new RoomSeed[]{
                new RoomSeed("J101", RoomType.SINGLE, new BigDecimal("2000.00"), 1),
                new RoomSeed("J102", RoomType.DOUBLE, new BigDecimal("3800.00"), 2),
                new RoomSeed("J103", RoomType.SUITE,  new BigDecimal("7500.00"), 4),
            }
        );

        // ══════════════════════════════════════════════════════════════════
        //  KERALA
        // ══════════════════════════════════════════════════════════════════

        seedHotel(
            "admink1@gmail.com", "Admin Kerala1",
            "Backwater Bliss Resort", "Kerala",
            "Floating cottage resort on the serene Alleppey backwaters — ayurvedic spa, canoe breakfast and sunset cruises.",
            "+91 9400112233",
            "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
            new RoomSeed[]{
                new RoomSeed("K101", RoomType.DOUBLE, new BigDecimal("4200.00"), 2),
                new RoomSeed("K102", RoomType.DELUXE, new BigDecimal("6500.00"), 3),
                new RoomSeed("K103", RoomType.SUITE,  new BigDecimal("9800.00"), 4),
            }
        );

        seedHotel(
            "admink2@gmail.com", "Admin Kerala2",
            "Spice Garden Retreat", "Kerala",
            "Hillside plantation resort in Munnar surrounded by cardamom and tea estates — misty mornings, bonfire evenings.",
            "+91 9400998877",
            "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80",
            new RoomSeed[]{
                new RoomSeed("K201", RoomType.SINGLE, new BigDecimal("2600.00"), 1),
                new RoomSeed("K202", RoomType.DOUBLE, new BigDecimal("4000.00"), 2),
                new RoomSeed("K203", RoomType.SUITE,  new BigDecimal("7200.00"), 3),
            }
        );

        // ══════════════════════════════════════════════════════════════════
        //  UDAIPUR
        // ══════════════════════════════════════════════════════════════════

        seedHotel(
            "adminu1@gmail.com", "Admin Udaipur1",
            "Lake Palace Udaipur", "Udaipur",
            "Iconic white-marble palace floating on Lake Pichola — boat check-in, baroque rooms and candlelit lakeside dinners.",
            "+91 9414223300",
            "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=1200&q=80",
            new RoomSeed[]{
                new RoomSeed("U101", RoomType.DOUBLE, new BigDecimal("8500.00"), 2),
                new RoomSeed("U102", RoomType.DELUXE, new BigDecimal("12000.00"), 3),
                new RoomSeed("U103", RoomType.SUITE,  new BigDecimal("18000.00"), 4),
            }
        );

        // ══════════════════════════════════════════════════════════════════
        //  DELHI
        // ══════════════════════════════════════════════════════════════════

        seedHotel(
            "admindl1@gmail.com", "Admin Delhi1",
            "The Capital Grand", "Delhi",
            "Five-star landmark hotel near Connaught Place with a rooftop terrace overlooking India Gate and Michelin-grade restaurants.",
            "+91 9811009900",
            "https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=1200&q=80",
            new RoomSeed[]{
                new RoomSeed("D101", RoomType.SINGLE, new BigDecimal("4000.00"), 1),
                new RoomSeed("D102", RoomType.DOUBLE, new BigDecimal("6500.00"), 2),
                new RoomSeed("D103", RoomType.SUITE,  new BigDecimal("11000.00"), 4),
            }
        );
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    private record RoomSeed(String number, RoomType type, BigDecimal price, int capacity) {}

    private void seedHotel(
            String adminEmail, String adminName,
            String hotelName, String location,
            String description, String contact, String imageUrl,
            RoomSeed[] rooms
    ) {
        if (hotelRepository.existsByName(hotelName)) return;

        User admin = userRepository.findByEmail(adminEmail).orElseGet(() -> {
            User u = new User(adminName, adminEmail,
                    passwordEncoder.encode("password123"), Role.HOTEL_ADMIN);
            return userRepository.save(u);
        });

        Hotel hotel = new Hotel(hotelName, location, description, contact, imageUrl, admin);
        hotelRepository.save(hotel);

        for (RoomSeed rs : rooms) {
            Room room = new Room();
            room.setHotel(hotel);
            room.setRoomNumber(rs.number());
            room.setRoomType(rs.type());
            room.setPrice(rs.price());
            room.setCapacity(rs.capacity());
            room.setStatus(RoomStatus.AVAILABLE);
            roomRepository.save(room);
        }
    }
}
