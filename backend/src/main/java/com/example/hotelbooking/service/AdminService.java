package com.example.hotelbooking.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.hotelbooking.dto.AdminDashboardResponse;
import com.example.hotelbooking.dto.AdminRoomRequest;
import com.example.hotelbooking.dto.BookingResponse;
import com.example.hotelbooking.dto.HotelResponse;
import com.example.hotelbooking.dto.RoomResponse;
import com.example.hotelbooking.entity.Booking;
import com.example.hotelbooking.entity.BookingStatus;
import com.example.hotelbooking.entity.Hotel;
import com.example.hotelbooking.entity.Room;
import com.example.hotelbooking.entity.RoomStatus;
import com.example.hotelbooking.exception.BadRequestException;
import com.example.hotelbooking.exception.ResourceNotFoundException;
import com.example.hotelbooking.repository.BookingRepository;
import com.example.hotelbooking.repository.HotelRepository;
import com.example.hotelbooking.repository.RoomRepository;

@Service
public class AdminService {

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final BookingService bookingService;

    public AdminService(
            HotelRepository hotelRepository,
            RoomRepository roomRepository,
            BookingRepository bookingRepository,
            BookingService bookingService
    ) {
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
        this.bookingService = bookingService;
    }

    public HotelResponse getAdminHotel(String adminEmail) {
        Hotel hotel = hotelRepository.findByAdminEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found for admin: " + adminEmail));

        return new HotelResponse(
                hotel.getId(),
                hotel.getName(),
                hotel.getLocation(),
                hotel.getDescription(),
                hotel.getContact(),
                hotel.getImageUrl()
        );
    }

    public List<RoomResponse> getAdminRooms(String adminEmail) {
        Hotel hotel = hotelRepository.findByAdminEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found for admin: " + adminEmail));

        return roomRepository.findByHotelId(hotel.getId())
                .stream()
                .map(this::toRoomResponse)
                .toList();
    }

    public RoomResponse addRoom(AdminRoomRequest request, String adminEmail) {
        Hotel hotel = hotelRepository.findByAdminEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found for admin: " + adminEmail));

        if (roomRepository.existsByHotelIdAndRoomNumber(hotel.getId(), request.getRoomNumber())) {
            throw new BadRequestException("Room number " + request.getRoomNumber() + " already exists in your hotel");
        }

        Room room = new Room();
        room.setHotel(hotel);
        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(request.getRoomType());
        room.setPrice(request.getPrice());
        room.setCapacity(request.getCapacity());
        room.setStatus(RoomStatus.AVAILABLE);

        Room saved = roomRepository.save(room);
        return toRoomResponse(saved);
    }

    public RoomResponse updateRoom(Long roomId, AdminRoomRequest request, String adminEmail) {
        Hotel hotel = hotelRepository.findByAdminEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found for admin: " + adminEmail));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        if (!room.getHotel().getId().equals(hotel.getId())) {
            throw new BadRequestException("Access denied: Room does not belong to your hotel");
        }

        if (!room.getRoomNumber().equals(request.getRoomNumber()) &&
                roomRepository.existsByHotelIdAndRoomNumber(hotel.getId(), request.getRoomNumber())) {
            throw new BadRequestException("Room number " + request.getRoomNumber() + " already exists in your hotel");
        }

        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(request.getRoomType());
        room.setPrice(request.getPrice());
        room.setCapacity(request.getCapacity());

        Room saved = roomRepository.save(room);
        return toRoomResponse(saved);
    }

    public void deleteRoom(Long roomId, String adminEmail) {
        Hotel hotel = hotelRepository.findByAdminEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found for admin: " + adminEmail));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        if (!room.getHotel().getId().equals(hotel.getId())) {
            throw new BadRequestException("Access denied: Room does not belong to your hotel");
        }

        boolean hasActiveBookings = room.getBookings().stream()
                .anyMatch(b -> b.getStatus() == BookingStatus.BOOKED || b.getStatus() == BookingStatus.CHECKED_IN);

        if (hasActiveBookings) {
            throw new BadRequestException("Cannot delete room with active or upcoming bookings");
        }

        roomRepository.delete(room);
    }

    public AdminDashboardResponse getDashboardStats(String adminEmail) {
        Hotel hotel = hotelRepository.findByAdminEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found for admin: " + adminEmail));

        List<Room> rooms = roomRepository.findByHotelId(hotel.getId());
        long totalRooms = rooms.size();
        long availableRooms = rooms.stream().filter(r -> r.getStatus() == RoomStatus.AVAILABLE).count();
        long occupiedRooms = rooms.stream().filter(r -> r.getStatus() == RoomStatus.OCCUPIED).count();

        LocalDate today = LocalDate.now();
        List<Booking> allBookings = bookingRepository.findByRoomHotelIdOrderByCheckInAsc(hotel.getId());

        long todayCheckIns = allBookings.stream()
                .filter(b -> b.getCheckIn().equals(today) && b.getStatus() != BookingStatus.CANCELLED)
                .count();

        long todayCheckOuts = allBookings.stream()
                .filter(b -> b.getCheckOut().equals(today) && b.getStatus() != BookingStatus.CANCELLED)
                .count();

        long currentGuests = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.CHECKED_IN)
                .count();

        return new AdminDashboardResponse(
                totalRooms,
                availableRooms,
                occupiedRooms,
                todayCheckIns,
                todayCheckOuts,
                currentGuests
        );
    }

    public List<BookingResponse> getAdminBookings(String adminEmail) {
        Hotel hotel = hotelRepository.findByAdminEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found for admin: " + adminEmail));

        return bookingRepository.findByRoomHotelIdOrderByCheckInAsc(hotel.getId())
                .stream()
                .filter(b -> b.getStatus() == BookingStatus.BOOKED || b.getStatus() == BookingStatus.CHECKED_IN)
                .map(bookingService::toResponse)
                .toList();
    }

    public List<BookingResponse> getAdminBookingHistory(String adminEmail) {
        Hotel hotel = hotelRepository.findByAdminEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found for admin: " + adminEmail));

        return bookingRepository.findByRoomHotelIdOrderByCheckInAsc(hotel.getId())
                .stream()
                .map(bookingService::toResponse)
                .toList();
    }

    public BookingResponse checkInGuest(Long bookingId, String adminEmail) {
        Hotel hotel = hotelRepository.findByAdminEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found for admin: " + adminEmail));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getRoom().getHotel().getId().equals(hotel.getId())) {
            throw new BadRequestException("Access denied: Booking does not belong to your hotel");
        }

        if (booking.getStatus() != BookingStatus.BOOKED) {
            throw new BadRequestException("Only BOOKED reservations can be checked in");
        }

        booking.setStatus(BookingStatus.CHECKED_IN);
        booking.setActualCheckIn(LocalDateTime.now());

        Room room = booking.getRoom();
        room.setStatus(RoomStatus.OCCUPIED);
        roomRepository.save(room);

        Booking saved = bookingRepository.save(booking);
        return bookingService.toResponse(saved);
    }

    public BookingResponse checkOutGuest(Long bookingId, String adminEmail) {
        Hotel hotel = hotelRepository.findByAdminEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found for admin: " + adminEmail));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getRoom().getHotel().getId().equals(hotel.getId())) {
            throw new BadRequestException("Access denied: Booking does not belong to your hotel");
        }

        if (booking.getStatus() != BookingStatus.CHECKED_IN) {
            throw new BadRequestException("Only CHECKED_IN reservations can be checked out");
        }

        booking.setStatus(BookingStatus.CHECKED_OUT);
        booking.setActualCheckOut(LocalDateTime.now());

        Room room = booking.getRoom();
        room.setStatus(RoomStatus.AVAILABLE);
        roomRepository.save(room);

        Booking saved = bookingRepository.save(booking);
        return bookingService.toResponse(saved);
    }

    private RoomResponse toRoomResponse(Room room) {
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
