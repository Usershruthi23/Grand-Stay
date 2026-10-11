package com.example.hotelbooking.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hotelbooking.dto.AdminDashboardResponse;
import com.example.hotelbooking.dto.AdminRoomRequest;
import com.example.hotelbooking.dto.BookingResponse;
import com.example.hotelbooking.dto.HotelResponse;
import com.example.hotelbooking.dto.MessageResponse;
import com.example.hotelbooking.dto.RoomResponse;
import com.example.hotelbooking.service.AdminService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/hotel")
    public ResponseEntity<HotelResponse> getAdminHotel(Principal principal) {
        return ResponseEntity.ok(adminService.getAdminHotel(principal.getName()));
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<RoomResponse>> getAdminRooms(Principal principal) {
        return ResponseEntity.ok(adminService.getAdminRooms(principal.getName()));
    }

    @PostMapping("/rooms")
    public ResponseEntity<RoomResponse> addRoom(
            @Valid @RequestBody AdminRoomRequest request,
            Principal principal
    ) {
        return ResponseEntity.ok(adminService.addRoom(request, principal.getName()));
    }

    @PutMapping("/rooms/{id}")
    public ResponseEntity<RoomResponse> updateRoom(
            @PathVariable Long id,
            @Valid @RequestBody AdminRoomRequest request,
            Principal principal
    ) {
        return ResponseEntity.ok(adminService.updateRoom(id, request, principal.getName()));
    }

    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<MessageResponse> deleteRoom(
            @PathVariable Long id,
            Principal principal
    ) {
        adminService.deleteRoom(id, principal.getName());
        return ResponseEntity.ok(new MessageResponse(true, "Room deleted successfully"));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboardStats(Principal principal) {
        return ResponseEntity.ok(adminService.getDashboardStats(principal.getName()));
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> getAdminBookings(Principal principal) {
        return ResponseEntity.ok(adminService.getAdminBookings(principal.getName()));
    }

    @GetMapping("/bookings/history")
    public ResponseEntity<List<BookingResponse>> getAdminBookingHistory(Principal principal) {
        return ResponseEntity.ok(adminService.getAdminBookingHistory(principal.getName()));
    }

    @PutMapping("/bookings/{id}/check-in")
    public ResponseEntity<BookingResponse> checkInGuest(
            @PathVariable Long id,
            Principal principal
    ) {
        return ResponseEntity.ok(adminService.checkInGuest(id, principal.getName()));
    }

    @PutMapping("/bookings/{id}/check-out")
    public ResponseEntity<BookingResponse> checkOutGuest(
            @PathVariable Long id,
            Principal principal
    ) {
        return ResponseEntity.ok(adminService.checkOutGuest(id, principal.getName()));
    }
}
