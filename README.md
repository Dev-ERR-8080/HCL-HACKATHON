# 🏨 QuickInn — Hotel Booking Platform

> A full-stack hotel booking platform built with a **Spring Boot microservices backend** and a **React frontend**, featuring Google OAuth2, JWT authentication, real-time room availability, coupon discounts, and email notifications.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Microservices](#-microservices)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [Seed Data](#-seed-data)
- [Coupon Codes](#-coupon-codes)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)

---

## 🎯 Project Overview

**QuickInn** is a hotel booking web application that allows users to search hotels across India, view room details and pricing, apply coupon discounts, book rooms with real-time availability checks, and receive email confirmations — all through a clean, responsive UI.

Built for a hackathon, the project demonstrates a production-grade microservices architecture with service discovery, API gateway routing, cookie-based JWT authentication, and cross-service communication.

---

## 🏛 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     React Frontend (3000)                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │  HTTP + JWT Cookie
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              API Gateway — ag-service (8080)                    │
│  • JWT cookie validation          • CORS handling               │
│  • Route: /api/auth/**  → 8081    • X-User-* header injection   │
│  • Route: /api/bookings/** → 8082 • Public path whitelisting    │
│  • Route: /api/hotels/** → 8083                                 │
│  • Route: /api/coupons/** → 8082                                │
└──────┬────────────────────┬──────────────────┬──────────────────┘
       │                    │                  │
       ▼                    ▼                  ▼
┌─────────────┐   ┌──────────────────┐   ┌────────────────────┐
│ Auth Service│   │ Booking Service  │   │Hotel Catalog Svc   │
│   (8081)    │   │    (8082)        │   │     (8083)         │
│             │   │                  │   │                    │
│ • Register  │   │ • Create booking │   │ • Search hotels    │
│ • Login     │   │ • Check avail.   │   │ • Hotel details    │
│ • OAuth2    │   │ • Cancel booking │   │ • Room types       │
│ • OTP reset │   │ • Coupon system  │   │ • Amenities        │
│ • Profile   │   │ • Email notify   │   │                    │
└──────┬──────┘   └────────┬─────────┘   └──────────┬─────────┘
       │                   │                         │
       ▼                   ▼                         ▼
┌─────────────┐   ┌──────────────────┐   ┌────────────────────┐
│  auth_db    │   │   booking_db     │   │    catalog_db      │
│  (MySQL)    │   │   (MySQL)        │   │    (MySQL)         │
└─────────────┘   └──────────────────┘   └────────────────────┘
                            │
                ┌───────────────────────┐
                │  Eureka Server (8761) │
                │  Service Discovery    │
                └───────────────────────┘
```

---

## 🛠 Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Language | Java 17 |
| Framework | Spring Boot 3.5.9 |
| Service Discovery | Spring Cloud Netflix Eureka |
| API Gateway | Spring Cloud Gateway (WebFlux) |
| Security | Spring Security + JWT (JJWT 0.11.5) |
| OAuth2 | Spring Security OAuth2 Client (Google) |
| ORM | Spring Data JPA + Hibernate |
| Database | MySQL 8 |
| Email | Spring Mail (Gmail SMTP) |
| Build Tool | Maven |
| Cloud Version | Spring Cloud 2025.0.1 |

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 18 |
| Routing | React Router v6 |
| Styling | Tailwind CSS |
| HTTP | Fetch API with cookie credentials |
| State | React Context API |
| Build | Create React App / Webpack |

---

## ✨ Features

### Authentication
- **Email/Password Registration & Login** with BCrypt password hashing
- **Google OAuth2** single sign-on — cookie set via gateway for consistent origin
- **HttpOnly JWT Cookie** authentication — XSS-safe, no localStorage token exposure
- **Forgot Password** with 6-digit OTP via email (expires in 10 minutes)
- **3-step password reset** flow: send OTP → verify OTP → set new password
- **Session persistence** — `AuthContext` restores login state on page refresh via `/api/auth/me`

### Hotel Search & Discovery
- **30 real hotels** seeded across 12 Indian cities: Mumbai, Delhi, Bangalore, Goa, Jaipur, Hyderabad, Chennai, Kolkata, Manali, Udaipur, Agra, Kochi
- **Search by city** from the hero section
- **Client-side filters**: star rating, price range (₹0–₹2500, ₹2500–₹6000, ₹6000+), amenities
- **Sort options**: Popularity, Price Low→High, Price High→Low, Top Rated
- **Hotel detail page** with room type selector showing real DB prices

### Booking System
- **Real-time availability check** — uses `room_availability` table with date-blocking
- **Room selector** — users choose specific room type (Standard / Deluxe / Suite)
- **Date validation** — check-in must be a future date; check-out must be after check-in
- **Checkout page** with guest info form and price breakdown
- **Confirmation page** with booking reference ID

### Coupon System
- **Apply coupon codes** at checkout with live validation
- **Two discount types**: `PERCENT` (percentage off with max cap) and `FLAT` (fixed amount off)
- **Minimum booking amount** enforcement per coupon
- **Discount reflected live** in price breakdown before booking
- Coupon codes shown on home page offer cards with one-click copy

### My Bookings
- View **Confirmed**, **Completed**, and **Cancelled** bookings in separate tabs
- **Cancel booking** with date unblocking (room becomes available again)
- **Rebook cancelled bookings** — navigates to checkout with original dates pre-filled
- Shows coupon codes used and savings on each booking

### Email Notifications
- **Booking confirmation email** sent immediately after successful booking with full details
- **Cancellation email** sent when a booking is cancelled
- **OTP email** for password reset with 10-minute expiry

---

## 📦 Microservices

### 1. `ic-service` — Eureka Server (Port 8761)
Spring Cloud Netflix Eureka server. All other services register here. The gateway uses `lb://service-name` URIs to load-balance requests via Eureka.

### 2. `auth-service` — Authentication Service (Port 8081)
Handles all user identity operations. Uses servlet-based Spring Security with OAuth2 and JWT filter.

**Key endpoints:**
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, sets JWT cookie |
| POST | `/api/auth/logout` | Public | Clears JWT cookie |
| GET  | `/api/auth/me` | JWT | Returns logged-in user's email |
| POST | `/api/auth/forgot-password` | Public | Sends OTP to email |
| POST | `/api/auth/verify-otp` | Public | Validates OTP |
| POST | `/api/auth/reset-password` | Public | Resets password after OTP |
| GET  | `/oauth2/authorization/google` | Public | Initiates Google OAuth2 |
| POST | `/api/profile` | JWT | Save/update user profile |
| GET  | `/api/profile` | JWT | Get user profile |

### 3. `booking-service` — Booking & Coupon Service (Port 8082)
Handles room bookings, availability tracking, cancellations, and coupon validation.

**Key endpoints:**
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/bookings/create` | JWT | Create a new booking |
| GET  | `/api/bookings/my` | JWT | Get current user's bookings |
| GET  | `/api/bookings/check` | Public | Check room availability |
| DELETE | `/api/bookings/{id}` | JWT | Cancel a booking |
| GET  | `/api/coupons/validate` | Public | Validate a coupon code |

### 4. `hotel-catalog-service` — Hotel Catalog Service (Port 8083)
Manages hotel data, room types, rooms, and amenities.

**Key endpoints:**
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/hotels/search` | Public | Search hotels with filters |
| GET  | `/api/hotels/{id}` | Public | Get full hotel details |

### 5. `ag-service` — API Gateway (Port 8080)
Spring Cloud Gateway (reactive WebFlux). Validates JWT cookies, injects `X-User-*` headers into downstream requests, and handles CORS.

**Injected headers (after JWT validation):**
- `X-User-Email` — user's email address
- `X-User-Id` — user's database ID
- `X-User-Role` — user's role (`USER` / `ADMIN`)

**Public paths (no JWT required):**
`/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/forgot-password`, `/api/auth/verify-otp`, `/api/auth/reset-password`, `/oauth2/**`, `/login/**`, `/api/hotels/**`, `/api/coupons/**`

---

## 📡 API Reference

### Search Hotels
```http
POST /api/hotels/search
Content-Type: application/json

{
  "city": "Goa",
  "minPrice": 3000,
  "maxPrice": 15000,
  "rating": 4.0,
  "amenities": ["Free WiFi", "Pool"]
}
```

### Create Booking
```http
POST /api/bookings/create?hotelId=10&roomId=82&checkIn=2026-04-15&checkOut=2026-04-18&baseAmount=45000&couponCode=WELCOME20
Cookie: JWT=<token>
```

### Validate Coupon
```http
GET /api/coupons/validate?code=WEEKEND30&amount=12000
```
**Response:**
```json
{
  "code": "WEEKEND30",
  "description": "Weekend special! 30% off up to ₹1500",
  "discount": 1500.0,
  "finalAmount": 10500.0
}
```

---

## 🗄 Database Schema

### `auth_db`
```
users              — id, name, email, password, provider, role
user_profiles      — id, user_id, fullName, phone, gender, address, city, country
password_reset_tokens — id, token, user_id, expiry_date
```

### `hotel_booking_db`
```
bookings           — bookingId, userId, hotelId, roomId, checkIn, checkOut,
                     baseAmount, discountAmount, finalAmount, couponCode,
                     status, createdAt, updatedAt
room_availability  — id, room_id, availability_date, is_available, booking_id
coupons            — id, code, discountType, discountValue, maxDiscount,
                     minBookingAmount, active, description
```

### `hotel_catalog_db`
```
hotels             — hotelId, name, description, address, city, state,
                     country, latitude, longitude, rating, createdAt
room_types         — roomTypeId, hotel_id, typeName, description, maxOccupancy
rooms              — roomId, room_type_id, roomNumber, pricePerNight
amenities          — amenityId, name
hotel_amenities    — id, hotel_id, amenity_id
hotel_search_index — hotelId, city, priceMin, priceMax, rating, amenities
```

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8.0+
- Node.js 18+ and npm
- A Google Cloud Console project with OAuth2 credentials

### Step 1 — Create MySQL Databases

```sql
CREATE DATABASE auth_db;
CREATE DATABASE hotel_booking_db;
CREATE DATABASE hotel_catalog_db;
```

Or run the provided script:
```bash
mysql -u root -p < create_databases.sql
```

### Step 2 — Start Services (in order)

```bash
# 1. Eureka Server — start first, wait ~10 seconds
cd ic-service
mvn spring-boot:run

# 2. Auth Service
cd auth-service
mvn spring-boot:run

# 3. API Gateway
cd ag-service
mvn spring-boot:run

# 4. Booking Service
cd booking-service
mvn spring-boot:run

# 5. Hotel Catalog Service
cd hotel-catalog-service
mvn spring-boot:run
```

### Step 3 — Seed the Database

After all services start and tables are created by `ddl-auto=update`:

```bash
# Hotel data (30 hotels, 90 room types, 270 rooms, amenities)
mysql -u root -p catalog_db < seed_catalog_data.sql

# Coupon codes
mysql -u root -p booking_db < seed_coupons.sql
```

### Step 4 — Start the Frontend

```bash
cd frontend
npm install
npm start
```

The app will be available at **http://localhost:3000**

### Step 5 — Verify Everything

Open **http://localhost:8761** to confirm all 4 services (auth, gateway, booking, catalog) show as **UP** in the Eureka dashboard.

---

## ⚙️ Environment Configuration

### Auth Service — `application.yml`

```yaml
server:
  port: 8081
spring:
  application:
    name: auth-service
  datasource:
    url: jdbc:mysql://localhost:3306/auth_db
    username: root
    password: YOUR_PASSWORD
  mail:
    host: smtp.gmail.com
    port: 587
    username: YOUR_GMAIL
    password: YOUR_APP_PASSWORD   # Gmail App Password (not your account password)
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: YOUR_GOOGLE_CLIENT_ID
            client-secret: YOUR_GOOGLE_CLIENT_SECRET
            redirect-uri: "http://localhost:8080/login/oauth2/code/google"
jwt:
  secret: YOUR_SECRET_32_CHARS_MINIMUM
```

### API Gateway — `application.properties`

```properties
server.port=8080
jwt.secret=YOUR_SECRET_32_CHARS_MINIMUM   # must match auth-service
```

> ⚠️ **Important:** `jwt.secret` must be **identical** in both auth-service and the gateway. The auth service uses it to sign tokens; the gateway uses it to verify them.

### Google OAuth2 Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → APIs & Services → Credentials → Create OAuth 2.0 Client ID
3. Application type: **Web application**
4. Add to **Authorized redirect URIs**:
   ```
   http://localhost:8080/login/oauth2/code/google
   ```
5. Copy the `client-id` and `client-secret` into `auth-service/application.yml`

### Gmail App Password Setup

Gmail blocks direct password auth. You need an App Password:
1. Go to your Google Account → Security → 2-Step Verification → App Passwords
2. Generate a password for "Mail"
3. Use that 16-character password as `spring.mail.password`

---

## 🌱 Seed Data

### Hotels (30 properties across India)

| City | Hotels |
|---|---|
| Mumbai | The Taj Mahal Palace, Trident Nariman Point, Hotel Residency Fort |
| Delhi | The Imperial New Delhi, Radisson Blu Plaza, Hotel Broadway |
| Bangalore | ITC Gardenia, The Oberoi Bangalore, Lemon Tree Premier |
| Goa | Taj Exotica, Alila Diwa, Sea Shell Beach Resort |
| Jaipur | Rambagh Palace, ITC Rajputana, Hotel Pearl Palace |
| Hyderabad | Taj Falaknuma Palace, Novotel Airport, Golkonda Hotel |
| Chennai | ITC Grand Chola, The Park Chennai | 
| Kolkata | The Oberoi Grand, Swissotel Kolkata |
| Manali | Span Resort & Spa, The Himalayan |
| Udaipur | Taj Lake Palace, Raas Devigarh |
| Agra | ITC Mughal, Courtyard Marriott |
| Kochi | Taj Malabar, Le Méridien |

Each hotel has 3 room types (Standard, Deluxe, Suite) × 3 rooms each = **270 bookable rooms** total.

---

## 🎟 Coupon Codes

| Code | Type | Discount | Min Booking | Max Saving |
|---|---|---|---|---|
| `WELCOME20` | 20% off | Percentage | ₹1,000 | ₹500 |
| `FLAT500` | ₹500 off | Flat | ₹2,000 | ₹500 |
| `WEEKEND30` | 30% off | Percentage | ₹5,000 | ₹1,500 |
| `LUXURY15` | 15% off | Percentage | ₹10,000 | ₹2,000 |
| `FLAT1000` | ₹1,000 off | Flat | ₹5,000 | ₹1,000 |
| `SUMMER25` | 25% off | Percentage | ₹3,000 | ₹750 |
| `EARLYBIRD` | 10% off | Percentage | ₹1,500 | ₹300 |

---

## 📁 Project Structure

```
QuickInn/
│
├── ic-service/                     # Eureka Discovery Server
│   └── src/main/java/.../IcServiceApplication.java
│
├── auth-service/                   # Authentication & User Management
│   └── src/main/java/com/Auth_Service/
│       ├── config/
│       │   ├── SecurityConfig.java
│       │   ├── JwtUtil.java
│       │   ├── JwtFilter.java
│       │   └── OAuth2SuccessHandler.java
│       ├── controller/
│       │   ├── AuthController.java
│       │   └── ProfileController.java
│       ├── service/
│       │   ├── AuthService.java
│       │   ├── ProfileService.java
│       │   └── EmailService.java
│       ├── entity/
│       │   ├── User.java
│       │   ├── UserProfile.java
│       │   └── PasswordResetToken.java
│       └── repository/
│           ├── UserRepository.java
│           ├── ProfileRepository.java
│           └── PasswordResetTokenRepository.java
│
├── ag-service/                     # API Gateway
│   └── src/main/java/org/example/ag_service/
│       ├── AgServiceApplication.java
│       ├── GatewayCorsConfig.java
│       └── security/
│           ├── JwtCookieGatewayFilter.java
│           └── JwtUtil.java
│
├── booking-service/                # Booking & Coupon Management
│   └── src/main/java/org/example/bookingservice/
│       ├── controller/
│       │   ├── BookingController.java
│       │   └── CouponController.java
│       ├── service/
│       │   ├── BookingService.java
│       │   ├── CouponService.java
│       │   └── BookingEmailService.java
│       ├── entity/
│       │   ├── Booking.java
│       │   ├── RoomAvailability.java
│       │   └── Coupon.java
│       └── repository/
│           ├── BookingRepository.java
│           ├── RoomAvailabilityRepository.java
│           └── CouponRepository.java
│
├── hotel-catalog-service/          # Hotel & Room Catalog
│   └── src/main/java/org/example/hotelcatalogservice/
│       ├── Controller/HotelController.java
│       ├── Services/
│       │   ├── HotelService.java
│       │   └── HotelSearchService.java
│       ├── Entity/
│       │   ├── Hotel.java
│       │   ├── RoomType.java
│       │   ├── Room.java
│       │   ├── Amenity.java
│       │   └── HotelAmenity.java
│       ├── Repository/
│       │   ├── HotelRepository.java
│       │   ├── HotelSearchRepository.java
│       │   ├── RoomTypeRepository.java
│       │   ├── RoomRepository.java
│       │   └── HotelAmenityRepository.java
│       └── DTO/
│           ├── HotelSearchRequest.java
│           ├── HotelSearchResponse.java
│           ├── HotelSearchResult.java
│           ├── HotelDetailsResponse.java
│           ├── RoomTypeResponse.java
│           └── RoomResponse.java
│
├── frontend/                       # React Application
│   └── src/
│       ├── context/AuthContext.jsx
│       ├── services/api.js
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Hotels.jsx
│       │   ├── HotelDetails.jsx
│       │   ├── Checkout.jsx
│       │   ├── Confirmation.jsx
│       │   └── MyBookings.jsx
│       └── components/
│           ├── layout/ (Navbar, Footer)
│           ├── auth/   (AuthModal, LoginForm, RegisterForm, ForgotPasswordForm)
│           ├── home/   (Hero, Offers)
│           └── hotel/  (HotelCard, HotelInfo, BookingCard, Filters, Gallery, RoomCard, SimilarStays)
│
├── create_databases.sql            # MySQL database creation script
├── seed_catalog_data.sql           # 30 hotels + rooms + amenities seed data
└── seed_coupons.sql                # 7 coupon codes seed data
```

---

## 📸 Screenshots

### Home Page
- Hero search bar with city, check-in/out dates, guest selector
- Offer cards showing live coupon codes (click to copy)
- "View All Hotels" button

### Hotels Page
- Real-time hotel listing from database
- Sidebar filters (rating, price range, amenities)
- Sort by popularity / price / rating

### Hotel Details
- Photo gallery
- Room type cards with prices from DB
- Sticky booking card

### Checkout
- Room selector with radio buttons
- Guest information form
- Coupon code input with live validation
- Price breakdown with discount row

### My Bookings
- Tabs: Confirmed / Completed / Cancelled
- Cancel button with confirmation dialog
- **Rebook** button on cancelled bookings

---

## 🔐 Security Design

- **No tokens in localStorage or URL** — JWT stored as `HttpOnly; SameSite=Lax` cookie, invisible to JavaScript
- **Gateway-level auth** — every protected request is validated once at the gateway before reaching any downstream service
- **Header injection** — downstream services read `X-User-Id`, `X-User-Email`, `X-User-Role` injected by the gateway, never parse tokens themselves
- **User isolation** — `userId` in booking creation comes from the JWT (via gateway header), never from the request body or params — prevents users from creating bookings on behalf of others
- **CORS centralised** — configured only at the gateway, downstream services have `cors.disable()` to prevent double-header issues
- **OTP expiry** — password reset OTPs expire after 10 minutes and are deleted after use

---

## 👥 Team

**QuickInn** — Built for HCL Hackathon 2026

---

## 📄 License

This project was built for a hackathon and is intended for demonstration purposes.
