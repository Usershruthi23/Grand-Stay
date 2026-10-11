package com.example.hotelbooking.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.hotelbooking.dto.BookingResponse;
import com.example.hotelbooking.dto.CreateBookingRequest;
import com.example.hotelbooking.entity.Booking;
import com.example.hotelbooking.entity.BookingStatus;
import com.example.hotelbooking.entity.Room;
import com.example.hotelbooking.entity.RoomStatus;
import com.example.hotelbooking.entity.User;
import com.example.hotelbooking.exception.BadRequestException;
import com.example.hotelbooking.exception.ResourceNotFoundException;
import com.example.hotelbooking.repository.BookingRepository;
import com.example.hotelbooking.repository.RoomRepository;
import com.example.hotelbooking.repository.UserRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public BookingService(
            BookingRepository bookingRepository,
            RoomRepository roomRepository,
            UserRepository userRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    public BookingResponse createBooking(CreateBookingRequest request, String userEmail) {
        if (!request.getCheckIn().isBefore(request.getCheckOut())) {
            throw new BadRequestException("Check-in date must be before check-out date");
        }

        if (request.getCheckIn().isBefore(LocalDate.now())) {
            throw new BadRequestException("Check-in date cannot be in the past");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        if (room.getStatus() == RoomStatus.MAINTENANCE) {
            throw new BadRequestException("Room is under maintenance");
        }

        boolean hasOverlap = bookingRepository.existsOverlappingBooking(
                room.getId(),
                request.getCheckIn(),
                request.getCheckOut(),
                BookingStatus.CANCELLED
        );

        if (hasOverlap) {
            throw new BadRequestException("Room is not available for the selected dates");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRoom(room);
        booking.setCheckIn(request.getCheckIn());
        booking.setCheckOut(request.getCheckOut());
        booking.setStatus(BookingStatus.BOOKED);

        Booking saved = bookingRepository.save(booking);
        return toResponse(saved);
    }

    public List<BookingResponse> getMyBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public BookingResponse getBookingById(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Access denied");
        }

        return toResponse(booking);
    }

    public BookingResponse cancelBooking(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Access denied");
        }

        if (booking.getStatus() == BookingStatus.CHECKED_OUT || booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking cannot be cancelled");
        }

        if (booking.getStatus() == BookingStatus.CHECKED_IN) {
            Room room = booking.getRoom();
            room.setStatus(RoomStatus.AVAILABLE);
            roomRepository.save(room);
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking saved = bookingRepository.save(booking);

        return toResponse(saved);
    }

    public BookingResponse toResponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getUser().getId(),
                booking.getUser().getName(),
                booking.getUser().getEmail(),
                booking.getRoom().getId(),
                booking.getRoom().getRoomNumber(),
                booking.getRoom().getRoomType().name(),
                booking.getRoom().getPrice(),
                booking.getRoom().getHotel().getId(),
                booking.getRoom().getHotel().getName(),
                booking.getCheckIn(),
                booking.getCheckOut(),
                booking.getStatus().name(),
                booking.getCreatedAt(),
                booking.getActualCheckIn(),
                booking.getActualCheckOut()
        );
    }
}
