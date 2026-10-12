# Hotel Booking & Management System

A beginner-friendly, production-ready full-stack **Hotel Booking & Management System** built with **Java 23**, **Spring Boot 4.1.1**, **Spring Data JPA**, **Spring Security**, **MySQL**, and a responsive **Vanilla HTML/CSS/JavaScript** frontend.

---

## 🚀 Key Features

### 👤 Customer Features
- **Registration & Authentication**: Secure sign-up/login using BCrypt password hashing and HTTP Session authentication.
- **Browse Hotels & Rooms**: Real-time view of available hotels, locations, descriptions, and room details.
- **Smart Booking Engine**: Prevents double-booking and date overlaps using database-level validation (`checkIn < existingCheckOut AND checkOut > existingCheckIn`).
- **My Bookings & Cancellation**: View personal booking history and cancel upcoming reservations with automated status updates.

### 🏨 Hotel Admin Features
- **Strict Hotel Ownership**: Admins can manage *only* their assigned hotel's rooms, stats, and reservations.
- **Admin Dashboard**: Live metrics for Total Rooms, Available Rooms, Occupied Rooms, Today's Check-ins, Today's Check-outs, and In-House Guests.
- **Room Management**: Add, update, and delete rooms with capacity/price validations and duplicate room number protection.
- **Check-In & Check-Out Workflow**:
  - `Check-In`: Booking transitions from `BOOKED` → `CHECKED_IN`, Room status transitions from `AVAILABLE` → `OCCUPIED`.
  - `Check-Out`: Booking transitions from `CHECKED_IN` → `CHECKED_OUT`, Room status transitions from `OCCUPIED` → `AVAILABLE`.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Backend** | Java 23.0.2, Spring Boot 4.1.1, Spring Data JPA, Spring Security |
| **Database** | MySQL (`hotel_booking_db`) |
| **Frontend** | REACT |
| **Security** | BCrypt Password Hashing, Session-based Security Context |
| **Build Tool** | Apache Maven |

---

## 🔑 Pre-Configured Sample Accounts

The system automatically seeds initial database records on launch:

| Account Type | Email | Password | Assigned Hotel |
|---|---|---|---|
| **Customer** | `customer@gmail.com` | `password123` | N/A |
| **Hotel Admin A** | `admina@gmail.com` | `password123` | Hotel Paradise (Hyderabad) |
| **Hotel Admin B** | `adminb@gmail.com` | `password123` | Hotel Royal Stay (Hyderabad) |

---

## ⚡ How to Run the Project

1. **Ensure MySQL Service is Running**:
   Create database `hotel_booking_db` or let Spring Boot auto-create it.

2. **Open Command Prompt / Terminal**:
   ```cmd
   cd C:\cmd\hotelbooking\b
   ```

3. **Compile & Run Spring Boot**:
   ```cmd
   mvn clean spring-boot:run
   ```

4. **Access the Web Interface**:
   Open your browser and navigate to:
   [http://localhost:4000](http://localhost:4000)

---

## 📡 Core API Endpoints

### Authentication
- `POST /api/auth/register` - Register new Customer account
- `POST /api/auth/login` - Login user & return role/session
- `POST /api/auth/logout` - Logout & invalidate session

### Public Browsing
- `GET /api/hotels` - List all hotels
- `GET /api/hotels/{id}` - Get hotel details
- `GET /api/hotels/{hotelId}/rooms` - Get hotel rooms
- `GET /api/rooms/{id}` - Get single room details

### Customer APIs (Requires CUSTOMER role)
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/my` - Get current user's bookings
- `GET /api/bookings/{id}` - Get booking details
- `PUT /api/bookings/{id}/cancel` - Cancel a booking

### Hotel Admin APIs (Requires HOTEL_ADMIN role)
- `GET /api/admin/dashboard` - Get dashboard KPI statistics
- `GET /api/admin/hotel` - Get admin's assigned hotel
- `GET /api/admin/rooms` - Get admin's hotel rooms
- `POST /api/admin/rooms` - Add room to admin's hotel
- `PUT /api/admin/rooms/{id}` - Update room
- `DELETE /api/admin/rooms/{id}` - Delete room
- `GET /api/admin/bookings` - Get active hotel bookings
- `GET /api/admin/bookings/history` - Get booking history
- `PUT /api/admin/bookings/{id}/check-in` - Process Guest Check-In
- `PUT /api/admin/bookings/{id}/check-out` - Process Guest Check-Out
