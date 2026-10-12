# 🏨 GrandStay — Hotel Booking & Management System

GrandStay is a full-stack **Hotel Booking & Management System** built with a **React (Vite)** frontend and a **Java / Spring Boot** backend, using **Spring Security** and **MySQL**. The application has been deployed online.

## 🌐 Live Deployment

- **Frontend (Vercel):** https://grand-stay-coral.vercel.app/
- **Backend (Render):** https://stay-6aso.onrender.com

> **Note:** The deployed backend needs a reachable cloud database configured in Render. A local MySQL database on your computer is not accessible to the deployed backend. If the database or service is waking up, the first request may take a little time.

## 🏗️ Architecture Overview

```text
Customer / Hotel Admin (Browser)
              |
              v
React Frontend (Vite)
https://grand-stay-coral.vercel.app/
              |
              | HTTPS API requests
              v
Spring Boot Backend
https://stay-6aso.onrender.com
              |
              v
MySQL Database
hotel_booking_db (configured for the deployed service)
```

For local development, the frontend and backend run on separate local ports, with MySQL running locally.

## 🌟 Key Features

### 👤 Customer Features

- **Location-wise hotel browsing:** Explore hotels across cities such as Goa, Mumbai, Hyderabad, Bengaluru, and Jaipur.
- **Hotel details and room showcase:** View room categories (`SINGLE`, `DOUBLE`, `DELUXE`, `SUITE`), guest capacities, rates, and amenities.
- **Booking flow:** Select check-in/check-out dates, calculate the stay duration, and validate overlapping reservations through the backend.
- **My Bookings and cancellation:** View reservations and cancel eligible upcoming stays.
- **Sign up and login:** Account authentication with BCrypt password hashing and HTTP session persistence.

### 🛡️ Hotel Admin Features

- **Hotel-specific access:** Administrators manage only their assigned hotel.
- **Dashboard KPIs:** Room inventory, available and occupied rooms, expected check-ins/check-outs, and in-house guests.
- **Room inventory management:** Add, edit, and delete rooms, with duplicate room-number protection and safeguards for rooms with active or upcoming bookings.
- **Guest check-in:** Moves a booking from `BOOKED` to `CHECKED_IN` and the room from `AVAILABLE` to `OCCUPIED`.
- **Guest check-out:** Moves a booking from `CHECKED_IN` to `CHECKED_OUT` and makes the room available again.
- **Reservation history:** Review completed and cancelled stays.

## 🔑 Demo Accounts

The following are the test accounts documented for the project. They work only if these accounts have been seeded into the database used by the deployed backend.

**Password for the listed accounts:** `password123`

| Role | Email | Assigned property / access |
|---|---|---|
| Customer | `customer@gmail.com` | Traveler account |
| Admin Alpha | `admina@gmail.com` | Hotel Paradise — Hyderabad |
| Admin Beta | `adminb@gmail.com` | Hotel Royal Stay — Hyderabad |
| Admin Gamma | `adminc@gmail.com` | The Imperial Bay — Mumbai |
| Admin Delta | `admind@gmail.com` | Taj Sunset Beach Resort — Goa |
| Admin Epsilon | `admine@gmail.com` | The Silicon Oasis Suites — Bengaluru |
| Admin Zeta | `adminf@gmail.com` | Royal Rajputana Palace — Jaipur |

> **Security note:** These are shared demo credentials, not secure production accounts. Do not use them for real personal information or payments. Change or remove them before production use.

## 🚀 Open the Live Application

1. Open the **[GrandStay frontend](https://grand-stay-coral.vercel.app/)**.
2. Browse the available hotels and try the customer or hotel-admin flows using a demo account, if the deployed database contains the seed data.
3. The backend service is hosted at **[https://stay-6aso.onrender.com](https://stay-6aso.onrender.com)**. A root URL may not display a webpage if the application exposes API endpoints only.

## 💻 Run Locally

### Prerequisites

- Java version compatible with the project (the project was developed with Java 23)
- Maven
- Node.js and npm
- MySQL Server

### 1. Create the database

Start MySQL and create the database:

```sql
CREATE DATABASE hotel_booking_db;
```

Ensure the database username and password match your local configuration. If your application seeds sample data on startup, the sample hotels, rooms, and accounts will be created by that seed logic; creating the database alone does not guarantee that seed data exists.

### 2. Start the Spring Boot backend

Open a terminal in the backend folder:

```bat
cd C:\cmd\hotelbooking\backend
mvn clean spring-boot:run
```

If the Maven wrapper is included, you can alternatively run:

```bat
mvnw.cmd spring-boot:run
```

The backend is configured to use port `4000` locally unless your environment overrides it:

```text
http://localhost:4000
```

### 3. Start the React frontend

Open a second terminal:

```bat
cd C:\cmd\hotelbooking\frontend
npm install
npm run dev
```

Open the local frontend URL printed by Vite, commonly:

```text
http://localhost:5173
```

### 4. Configure local database credentials

The local Spring Boot configuration should point to your local MySQL instance. For example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/hotel_booking_db
spring.datasource.username=root
spring.datasource.password=YOUR_LOCAL_MYSQL_PASSWORD
```

Use your actual local MySQL password. Do not commit real passwords or other secrets to GitHub.

## ⚙️ Deployment Configuration

- **Frontend hosting:** Vercel
- **Backend hosting:** Render
- **Database:** MySQL; the deployed backend must use a cloud-accessible database configured through Render environment variables.
- **Backend port:** Uses Render's assigned `PORT` when configured, with `4000` as the local fallback.
- **API routing:** If the frontend uses a Vercel rewrite, ensure it targets `https://stay-6aso.onrender.com` and that the frontend makes requests using the matching API paths. If the frontend uses an absolute API base URL, configure that URL in Vercel instead.

Never place database passwords in frontend environment variables or public source code.

## 🧰 Technology Stack

- **Frontend:** React, Vite, JavaScript, CSS
- **Backend:** Java, Spring Boot, Spring Security
- **Database:** MySQL
- **Persistence:** Spring Data JPA / Hibernate
- **Authentication:** BCrypt password hashing and HTTP sessions
- **Deployment:** Vercel (frontend), Render (backend)

## 📝 Important Notes

- The online frontend and backend are separate deployed services.
- A successful deployment does not by itself confirm that database connectivity, demo-account login, booking creation, or every API route is working. Test those flows in the live application.
- Local MySQL data is not automatically copied to a cloud database.
- This README describes the project's intended features; availability of each feature depends on the deployed code and database configuration.

## 👩‍💻 Project

**GrandStay — Hotel Booking & Management System**
