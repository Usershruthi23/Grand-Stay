# 🏨 GrandStay - Hotel Booking & Management System

A full-stack, enterprise-grade **Hotel Booking & Management System** combining a modern **React (Vite)** frontend with a **Java 23 / Spring Boot** backend, **Spring Security**, and **MySQL**.

---

## 🏗️ Architecture Overview

```
Customer & Hotel Admin (Browser)
             │
             ▼
React Frontend (Vite) ───► http://localhost:5173
             │
             │ (Proxy: /api/*)
             ▼
Spring Boot Backend   ───► http://localhost:4000
             │
             ▼
MySQL Database        ───► hotel_booking_db (Port 3306)
```

---

## 🌟 Key Features

### 👤 Customer Features
* 🗺️ **Location-Wise Hotel Browsing**: Explore hotels across top cities (Goa, Mumbai, Hyderabad, Bengaluru, Jaipur) with destination cards, city filters, and search.
* 🏨 **Hotel Details & Room Showcase**: Room categories (`SINGLE`, `DOUBLE`, `DELUXE`, `SUITE`) with high-resolution imagery, guest capacities, and luxury amenity pills.
* ⚡ **Smart Booking Engine**: Live date selection, nights duration calculator, and real-time backend overlap validation (`checkIn < existingCheckOut AND checkOut > existingCheckIn`).
* 🧳 **My Bookings & Cancellation**: View current and past reservations with status badges (`BOOKED`, `CHECKED_IN`, `CHECKED_OUT`, `CANCELLED`) and 1-click self-serve cancellation for upcoming stays.
* 🔐 **Secure Sign Up & Login**: BCrypt password hashing and HTTP session state persistence.

### 🛡️ Hotel Admin Features
* 🏢 **Strict Hotel Ownership**: Each administrator manages *only* their assigned hotel.
* 📊 **Live KPI Dashboard**: Real-time counters for:
  * Total Room Inventory
  * Available Rooms (ready for booking)
  * Occupied Rooms (currently checked in)
  * Today's Expected Check-ins
  * Today's Expected Check-outs
  * In-House Guests
* 🛏️ **Room Inventory Management (Full CRUD)**:
  * Register new rooms with duplicate room number protection.
  * Edit room types, nightly rates, and capacity.
  * Delete rooms (safeguarded against rooms with active or upcoming bookings).
* 🛎️ **Guest Stay & Workflow**:
  * **Check-In Guest**: Transitions booking `BOOKED` → `CHECKED_IN`, room status `AVAILABLE` → `OCCUPIED`.
  * **Check-Out Guest**: Transitions booking `CHECKED_IN` → `CHECKED_OUT`, room status `OCCUPIED` → `AVAILABLE`.
  * **Reservation History**: Complete historical log of completed and cancelled stays.

---

## 🔑 Pre-Configured Test Accounts (Password: `password123`)

| Role | Email | Password | Location / Assigned Property |
|---|---|---|---|
| **Customer** | `customer@gmail.com` | `password123` | N/A (Traveler Account) |
| **Admin Alpha** | `admina@gmail.com` | `password123` | Hotel Paradise (🏛️ Hyderabad) |
| **Admin Beta** | `adminb@gmail.com` | `password123` | Hotel Royal Stay (🏛️ Hyderabad) |
| **Admin Gamma** | `adminc@gmail.com` | `password123` | The Imperial Bay (🏙️ Mumbai) |
| **Admin Delta** | `admind@gmail.com` | `password123` | Taj Sunset Beach Resort (🏖️ Goa) |
| **Admin Epsilon** | `admine@gmail.com` | `password123` | The Silicon Oasis Suites (💼 Bengaluru) |
| **Admin Zeta** | `adminf@gmail.com` | `password123` | Royal Rajputana Palace (🏰 Jaipur) |

---

## 🚀 How to Run the Application

### 1. Database Setup
Ensure MySQL is running on port `3306`.
The database `hotel_booking_db` will be auto-created and populated with sample hotels, rooms, and accounts upon running Spring Boot.

### 2. Start Spring Boot Backend (Port 4000)
Open a terminal in the `backend` folder:
```bash
cd c:\cmd\hotelbooking\backend
mvn clean spring-boot:run
```
*(Or on Windows: `mvnw.cmd spring-boot:run`)*

### 3. Start React Frontend (Port 5173)
Open a second terminal in the `frontend` folder:
```bash
cd c:\cmd\hotelbooking\frontend
npm install
npm run dev
```

Open your browser at:
👉 **`http://localhost:5173`**
