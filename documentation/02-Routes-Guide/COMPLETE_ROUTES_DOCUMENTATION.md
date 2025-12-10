# 🎯 Complete Flowcharts & Routes Documentation

## 📊 Overview

This document provides comprehensive flowchart diagrams and detailed documentation for all API routes in the Saloon Booking System. The system is built with Node.js, Express, and Sequelize ORM.

---

## 📑 Complete List of Routes

### Authentication Routes (`/auth`)
```
POST   /send-otp                    → Send OTP to mobile
POST   /verify-otp                  → Verify OTP and create session
POST   /logout                       → Logout user (Auth Required)
POST   /new-access-token            → Generate new access token
```

### Customer Routes (`/customer`)
```
GET    /near-by-shops               → Fetch nearby shops with distance
POST   /book-appointment            → Create new appointment
POST   /assign-appointments         → Assign barber to appointment
GET    /appointments                → Get all appointments with filters
POST   /change-appointment-status   → Update appointment status
```

### Barber Routes (`/barber`)
```
POST   /login                       → Barber login
GET    /barber-profile              → Get barber's profile (Barber Auth)
GET    /barbers-appointments        → Get barber's appointments (Barber Auth)
POST   /create-barber               → Create new barber
POST   /update-barber               → Update barber details
GET    /barbers/:id                 → Get all barbers of shop
POST   /availability                → Toggle barber availability
```

### Shop Routes (`/shop`)
```
POST   /save-shop-details           → Register/update shop info
POST   /save-shop-location          → Save shop location
POST   /save-shop-kyc               → Upload KYC documents
POST   /save-shop-bank              → Save bank account details
GET    /get-shop-profile            → Get complete shop profile
POST   /create-service              → Add new service
GET    /services                    → List all shop services
```

### User Routes (`/user`)
```
POST   /save-profile                → Create user profile
POST   /update-profile              → Update profile details
POST   /update-location             → Update user location
GET    /user-profile                → Get user's profile
POST   /update-status               → Update user status
GET    /get-status                  → Get available statuses
GET    /get-genders                 → Get available genders
GET    /roles                       → Get available roles
GET    /check-profile               → Check profile completion
```

### Common Routes (`/common`)
```
POST   /update-device-info          → Save device information
GET    /device-info                 → Get device info
POST   /save-token                  → Save FCM token
GET    /fcm-token                   → Get FCM token
```

---

## 🔐 Authentication Details

### Token Structure
```
Access Token:
- Validity: 1 hour (configurable)
- Type: JWT
- Payload: user_id, role, permissions

Refresh Token:
- Validity: 7 days (configurable)
- Type: JWT
- Used to: Generate new access token
```

### Authentication Flow
```
1. POST /auth/send-otp
   └─ Input: { mobile: "9876543210" }
   └─ Output: OTP expires in 5 minutes

2. POST /auth/verify-otp
   └─ Input: { code: "123456", mobile: "9876543210" }
   └─ Output: { access_token, refresh_token, user_info }

3. All Protected Routes
   └─ Header: Authorization: Bearer <access_token>

4. POST /auth/new-access-token
   └─ Input: { refresh_token: "..." }
   └─ Output: { access_token (new), expires_in }

5. POST /auth/logout
   └─ Input: Authorization header with token
   └─ Output: Token invalidated
```

---

## 📋 Route Details by Folder

### 1️⃣ AUTH ROUTES (`routes/common/auth.route.ts`)

#### POST /send-otp
**Purpose:** Initiate authentication by sending OTP

**Request:**
```typescript
{
  mobile: string  // Required, 10-digit phone number
}
```

**Response:**
```typescript
{
  success: true,
  message: "OTP send successfully",
  data: {
    otp: string,        // OTP code
    expires_in: number  // Expiration in seconds
  }
}
```

**Service:** `AuthService.sendOtp()`

---

#### POST /verify-otp
**Purpose:** Verify OTP and authenticate user

**Request:**
```typescript
{
  code: string,        // Required, OTP code
  mobile: string,      // Required, phone number
  user_id?: string     // Optional, UUID
}
```

**Response:**
```typescript
{
  success: true,
  message: "OTP verified successfully",
  data: {
    access_token: string,
    refresh_token: string,
    user: {
      id: string,
      mobile: string,
      role: string
    }
  }
}
```

**Service:** `AuthService.verifyOTP()`

---

#### POST /logout
**Purpose:** Invalidate user session

**Requirements:** ✅ Auth Required

**Request:**
```
Header: Authorization: Bearer <token>
```

**Response:**
```typescript
{
  success: true,
  message: "Logged out successfully"
}
```

**Service:** `AuthService.logoutUser()`

---

#### POST /new-access-token
**Purpose:** Generate new access token using refresh token

**Request:**
```typescript
{
  refresh_token: string  // Required
}
```

**Response:**
```typescript
{
  success: true,
  message: "New Access Token Generated",
  data: {
    access_token: string,
    expires_in: number
  }
}
```

**Service:** `AuthService.generateNewAccessToken()`

---

### 2️⃣ CUSTOMER ROUTES (`routes/user/cutomer.route.ts`)

#### GET /near-by-shops
**Purpose:** Find salons near customer's location

**Requirements:** ✅ Auth Required

**Request Body:**
```typescript
{
  latitude: number,      // Required, -90 to 90
  longitude: number,     // Required, -180 to 180
  radius?: number        // Optional, default 5 km
}
```

**Response:**
```typescript
{
  success: true,
  message: "All available near by shops fetched..",
  data: [
    {
      id: string,
      shop_name: string,
      distance: string,  // "2.5 km" or "500 m"
      location: {
        latitude: number,
        longitude: number,
        address: string
      },
      email: string,
      mobile: string,
      shop_open_time: string,
      shop_close_time: string
    }
  ]
}
```

**Service:** `CustomerService.fetchNearByShops()`
**Logic:** Uses Haversine formula for distance calculation

---

#### POST /book-appointment
**Purpose:** Create new appointment with smart shop/barber selection

**Requirements:** ✅ Auth Required

**Request Body:**
```typescript
{
  customer_id: string,        // Required, UUID
  shop_id?: string,           // Optional, UUID
  appointment_date: string,   // Required, ISO date string
  gender: enum,               // Required, male|female|unisex|others
  notes?: string,             // Optional
  payment_mode: enum,         // Required, cash|card|upi|wallet
  services: [                 // Required, min 1
    {
      service_id: string,     // UUID
      duration: number,       // Minutes
      price: number,          // Amount
      discounted_price?: number
    }
  ],
  location?: {
    latitude: string,
    longitude: string,
    radius?: number
  }
}
```

**Response:**
```typescript
{
  success: true,
  message: "Appointment submitted",
  data: {
    id: string,
    customer_id: string,
    shop_id: string,
    appointment_date: string,
    status: "Pending",
    service_duration: number,
    distance: string,
    services: [
      {
        id: string,
        name: string,
        duration: number,
        price: number
      }
    ]
  }
}
```

**Service:** `CustomerService.createAppointment()`
**Transaction:** Uses database transaction for data consistency
**Logic:**
1. Validate all services provided
2. Calculate total duration and price
3. If shop_id not provided:
   - Fetch nearby shops
   - Prefer shop with available barber
   - Fallback to shop with earliest free barber
4. Create appointment record
5. Create appointment_service records

---

#### POST /assign-appointments
**Purpose:** Assign barber to pending appointment

**Requirements:** ✅ Auth Required

**Request Body:**
```typescript
{
  id: string,             // Required, appointment UUID
  barberId?: string,      // Optional, barber UUID
  extra_duration?: number // Optional, additional minutes
}
```

**Response:**
```typescript
{
  success: true,
  message: "Appointments accepted",
  data: {
    id: string,
    barber_id: string,
    expected_start_time: string,  // ISO date
    expected_end_time: string,    // ISO date
    status: "Accepted",
    total_service_duration: number
  }
}
```

**Service:** `CustomerService.assignBarber()`
**Logic:**
1. Find appointment
2. If barberId provided: use it (validate availability)
3. Else: auto-assign:
   - Find any available barber
   - If none available: find barber free earliest
4. Calculate expected times
5. Mark barber unavailable
6. Update appointment status

---

#### GET /appointments
**Purpose:** Retrieve appointments with filters

**Requirements:** ✅ Auth Required

**Query Parameters:**
```
?user_id=<uuid>
&shop_id=<uuid>
&barber_id=<uuid>
&status=<enum>
```

**Response:**
```typescript
{
  success: true,
  message: "Appointments fetched successfully",
  data: [
    {
      id: string,
      booking_time: string,
      appointment_date: string,
      expected_start_time: string,
      expected_end_time: string,
      service_duration: number,
      extra_duration: number,
      total_service_duration: number,
      gender: string,
      status: string,
      notes: string,
      payment_status: string,
      payment_mode: string,
      service_count: number,
      services: [
        {
          id: string,
          appointment_service_id: string,
          name: string,
          duration: number,
          price: number,
          description: string,
          image_url: string
        }
      ],
      barber: {
        id: string,
        name: string,
        email: string,
        mobile: string,
        specialist_in: string[],
        available: boolean
      },
      shop: {
        id: string,
        shop_name: string,
        shop_logo_url: string,
        email: string,
        mobile: string,
        shop_open_time: string,
        shop_close_time: string
      },
      customer: {
        id: string,
        first_name: string,
        last_name: string,
        email: string,
        mobile: string
      }
    }
  ]
}
```

**Service:** `CustomerService.getAllAppointments()`

---

#### POST /change-appointment-status
**Purpose:** Update appointment status with validation

**Requirements:** ✅ Auth Required

**Request Body:**
```typescript
{
  id: string,           // Required, UUID
  status: enum,         // Required, Pending|Accepted|InProgress|Completed|Rejected|Cancelled
  remark?: string       // Required if status is Rejected/Cancelled
}
```

**Validation Rules:**
- Rejected appointments: cannot be changed
- Cancelled appointments: cannot be changed
- Accepted → Rejected: NOT ALLOWED
- InProgress → Cancelled: NOT ALLOWED
- Completed: final state

**Response:**
```typescript
{
  success: true,
  message: "Appointment status changed to Completed",
  data: {
    id: string,
    status: string,
    total_price: number,
    discount: number,
    chargeable_amount: number,
    appointment_id: string,
    shop_id: string,
    customer_id: string,
    barber_id: string,
    service_count: number,
    services: [
      {
        id: string,
        name: string,
        description: string,
        image_url: string,
        price: number,
        discount_price: number
      }
    ]
  }
}
```

**Service:** `CustomerService.changeAppointmentStatus()`
**Logic on Completion:**
- Calculate service totals
- Calculate discounts
- Mark payment as successful
- Release barber (available = true)
- Record completion timestamp

---

### 3️⃣ BARBER ROUTES (`routes/vendor/barbar.route.ts`)

#### POST /login
**Purpose:** Barber login with credentials

**Requirements:** ❌ No Auth Required

**Request Body:**
```typescript
{
  username: string,  // Required
  login_pin: string  // Required
}
```

**Response:**
```typescript
{
  success: true,
  message: "Login successfully",
  data: {
    barber_id: string,
    name: string,
    email: string,
    access_token: string,
    refresh_token: string,
    shop_id: string
  }
}
```

**Service:** `BarberService.loginBarber()`

---

#### GET /barber-profile
**Purpose:** Get logged-in barber's profile

**Requirements:** ✅ Barber Auth Required

**Response:**
```typescript
{
  success: true,
  message: "Barber profile fetched",
  data: {
    id: string,
    name: string,
    email: string,
    mobile: string,
    shop_id: string,
    gender: string,
    specialist_in: string[],
    available: boolean,
    status: string,
    age: number
  }
}
```

**Service:** `BarberService.getBarbersProfile()`

---

#### GET /barbers-appointments
**Purpose:** Get all appointments assigned to barber

**Requirements:** ✅ Barber Auth Required

**Response:**
```typescript
{
  success: true,
  message: "Appointments fetched",
  data: [
    {
      id: string,
      customer_id: string,
      appointment_date: string,
      expected_start_time: string,
      expected_end_time: string,
      status: string,
      services: [
        {
          id: string,
          name: string,
          duration: number
        }
      ],
      customer: {
        id: string,
        first_name: string,
        last_name: string,
        mobile: string,
        email: string
      }
    }
  ]
}
```

**Service:** `BarberService.getAllApointment()`

---

#### POST /create-barber
**Purpose:** Register new barber in shop

**Requirements:** ✅ Shop Owner Auth Required

**Request Body:**
```typescript
{
  user_id: string,             // Required
  shop_id: string,             // Required
  name: string,                // Required
  email?: string,              // Optional, email format
  mobile: string,              // Required, 10 digits
  role?: string,               // Optional
  age?: number,                // Optional
  gender: string,              // Required, enum
  specialist_in?: string[],    // Optional
  status?: string              // Optional, enum
}
```

**Response:**
```typescript
{
  success: true,
  message: "Barber added successfully",
  data: {
    id: string,
    name: string,
    email: string,
    mobile: string,
    shop_id: string,
    status: string,
    gender: string
  }
}
```

**Service:** `BarberService.createBarber()`

---

#### POST /update-barber
**Purpose:** Update barber details

**Requirements:** ✅ Shop Owner Auth Required

**Request Body:**
```typescript
{
  id: string,                 // Required, UUID
  name?: string,
  email?: string,
  mobile?: string,
  gender?: string,
  specialist_in?: string[],
  status?: string,
  age?: number
}
```

**Response:**
```typescript
{
  success: true,
  message: "Barber details updated successfully",
  data: {
    id: string,
    name: string,
    email: string,
    mobile: string,
    updated_fields: string[]
  }
}
```

**Service:** `BarberService.updateBarber()`

---

#### GET /barbers/:id
**Purpose:** Get all barbers of a shop with optional filter

**Requirements:** ✅ Shop Owner Auth Required

**Path Parameter:**
```
:id = shop_id (UUID)
```

**Query Parameter:**
```
?available=true|false
```

**Response:**
```typescript
{
  success: true,
  message: "Barbers fetched successfully",
  data: [
    {
      id: string,
      name: string,
      email: string,
      mobile: string,
      specialist_in: string[],
      available: boolean,
      status: string,
      shop_id: string
    }
  ]
}
```

**Service:** `BarberService.getAllBarbers()`

---

#### POST /availability
**Purpose:** Toggle barber's availability status

**Requirements:** ✅ Shop Owner Auth Required

**Request Body:**
```typescript
{
  id: string,       // Required, UUID
  available: boolean // Required
}
```

**Response:**
```typescript
{
  success: true,
  message: "Barber availability changed successfully",
  data: {
    id: string,
    available: boolean,
    updated_at: string
  }
}
```

**Service:** `BarberService.toggleAvailability()`

---

### 4️⃣ SHOP ROUTES (`routes/vendor/shop.route.ts`)

#### POST /save-shop-details
**Purpose:** Register or update shop information

**Requirements:** ✅ Auth Required

**Request Body:**
```typescript
{
  shop_name: string,          // Required
  shop_logo_url?: string,     // Optional
  email: string,              // Required, valid email
  mobile: string,             // Required
  shop_open_time?: string,    // Optional, HH:MM format
  shop_close_time?: string,   // Optional, HH:MM format
  vendor_id?: string          // Optional
}
```

**Response:**
```typescript
{
  success: true,
  message: "Shop details saved",
  data: {
    id: string,
    shop_name: string,
    email: string,
    mobile: string,
    shop_open_time: string,
    shop_close_time: string
  }
}
```

**Service:** `ShopService.saveSaloonShop()`

---

#### POST /save-shop-location
**Purpose:** Store shop's geographical location

**Requirements:** ✅ Auth Required

**Request Body:**
```typescript
{
  shop_id: string,      // Required, UUID
  latitude: number,     // Required
  longitude: number,    // Required
  address?: string,     // Optional
  city?: string,        // Optional
  state?: string,       // Optional
  zip_code?: string     // Optional
}
```

**Response:**
```typescript
{
  success: true,
  message: "Location saved",
  data: {
    id: string,
    shop_id: string,
    latitude: number,
    longitude: number,
    address: string,
    city: string
  }
}
```

**Service:** `ShopService.saveSaloonShopLocation()`

---

#### POST /save-shop-kyc
**Purpose:** Upload shop's KYC (Know Your Customer) documents

**Requirements:** ✅ Auth Required

**Request Body:**
```typescript
{
  shop_id: string,         // Required
  business_type?: string,
  gst_number?: string,
  pan_number?: string,
  aadhar_number?: string,
  kyc_document?: string,   // URL
  kyc_status?: string      // enum
}
```

**Response:**
```typescript
{
  success: true,
  message: "KYC details saved",
  data: {
    id: string,
    shop_id: string,
    gst_number: string,
    kyc_status: string
  }
}
```

**Service:** `ShopService.saveSaloonShopKyc()`

---

#### POST /save-shop-bank
**Purpose:** Store shop's bank account details for payments

**Requirements:** ✅ Auth Required

**Request Body:**
```typescript
{
  shop_id: string,          // Required
  account_holder?: string,
  account_number: string,   // Required
  bank_name: string,        // Required
  ifsc_code: string,        // Required
  account_type?: string,
  branch?: string
}
```

**Response:**
```typescript
{
  success: true,
  message: "Bank details saved",
  data: {
    id: string,
    shop_id: string,
    account_number: string,
    bank_name: string,
    ifsc_code: string
  }
}
```

**Service:** `ShopService.saveSaloonShopBankDetails()`

---

#### GET /get-shop-profile
**Purpose:** Retrieve complete shop profile with all details

**Requirements:** ✅ Auth Required

**Query Parameter:**
```
?shop_id=<uuid>
```

**Response:**
```typescript
{
  success: true,
  data: {
    id: string,
    shop_name: string,
    email: string,
    mobile: string,
    location: {
      latitude: number,
      longitude: number,
      address: string,
      city: string
    },
    kyc: {
      gst_number: string,
      kyc_status: string
    },
    bank_details: {
      account_holder: string,
      bank_name: string
    },
    services_count: number,
    barbers_count: number
  }
}
```

**Service:** `ShopService.getShopProfile()`

---

#### POST /create-service
**Purpose:** Add new service to shop's offerings

**Requirements:** ✅ Auth Required

**Request Body:**
```typescript
{
  shop_id: string,           // Required, UUID
  name: string,              // Required
  description?: string,
  duration: number,          // Required, minutes
  price: number,             // Required
  discounted_price?: number,
  image_url?: string,
  category?: string
}
```

**Response:**
```typescript
{
  success: true,
  message: "Service created",
  data: {
    id: string,
    name: string,
    duration: number,
    price: number,
    shop_id: string,
    discounted_price: number
  }
}
```

**Service:** `ShopService.createService()`

---

#### GET /services
**Purpose:** List all services offered by a shop

**Requirements:** ✅ Auth Required

**Query Parameters:**
```
?shop_id=<uuid>
&category=<string>
```

**Response:**
```typescript
{
  success: true,
  data: [
    {
      id: string,
      name: string,
      description: string,
      duration: number,
      price: number,
      discounted_price: number,
      image_url: string,
      shop_id: string
    }
  ]
}
```

**Service:** `ShopService.getAllServices()`

---

### 5️⃣ USER ROUTES (`routes/user/user.route.ts`)

#### POST /save-profile
**Purpose:** Create user profile for first time

**Requirements:** ✅ Auth Required

**Request Body:**
```typescript
{
  user_id: string,         // Required, UUID
  first_name: string,      // Required
  last_name?: string,
  email: string,           // Required, valid email
  mobile: string,          // Required
  gender: string,          // Required, enum
  date_of_birth?: string,  // Optional, ISO date
  profile_pic?: string     // Optional, URL
}
```

**Response:**
```typescript
{
  success: true,
  message: "Profile saved",
  data: {
    user_id: string,
    first_name: string,
    last_name: string,
    email: string,
    mobile: string,
    gender: string
  }
}
```

**Service:** `UserService.saveUserProfile()`

---

#### POST /update-profile
**Purpose:** Update existing user profile

**Requirements:** ✅ Auth Required

**Request Body:**
```typescript
{
  user_id: string,
  first_name?: string,
  last_name?: string,
  email?: string,
  mobile?: string,
  gender?: string,
  profile_pic?: string,
  date_of_birth?: string
}
```

**Response:**
```typescript
{
  success: true,
  message: "Profile updated",
  data: {
    user_id: string,
    updated_fields: string[]
  }
}
```

**Service:** `UserService.updateUserProfile()`

---

#### POST /update-location
**Purpose:** Update user's current location

**Requirements:** ✅ Auth Required

**Request Body:**
```typescript
{
  user_id: string,     // Required
  latitude: number,    // Required
  longitude: number,   // Required
  address?: string,
  city?: string,
  state?: string
}
```

**Response:**
```typescript
{
  success: true,
  message: "Location updated",
  data: {
    user_id: string,
    latitude: number,
    longitude: number,
    address: string
  }
}
```

**Service:** `UserService.updateUserLocation()`

---

#### GET /user-profile
**Purpose:** Retrieve user's complete profile

**Requirements:** ✅ Auth Required

**Query Parameter:**
```
?user_id=<uuid>
```

**Response:**
```typescript
{
  success: true,
  data: {
    user_id: string,
    first_name: string,
    last_name: string,
    email: string,
    mobile: string,
    gender: string,
    profile_pic: string,
    created_at: string
  }
}
```

**Service:** `UserService.getUserProfile()`

---

#### POST /update-status
**Purpose:** Update user account status

**Requirements:** ✅ Auth Required

**Request Body:**
```typescript
{
  user_id: string,  // Required
  status: string    // Required, enum
}
```

**Response:**
```typescript
{
  success: true,
  message: "Status updated",
  data: {
    user_id: string,
    status: string
  }
}
```

**Service:** `UserService.updateUserStatus()`

---

#### GET /get-status
**Purpose:** Get all available user status options

**Requirements:** ✅ Auth Required

**Response:**
```typescript
{
  success: true,
  data: [
    {
      id: string,
      status_name: string,
      description: string
    }
  ]
}
```

**Service:** `UserService.getAllUserStatus()`

---

#### GET /get-genders
**Purpose:** Get all available gender options

**Requirements:** ✅ Auth Required

**Response:**
```typescript
{
  success: true,
  data: [
    {
      id: string,
      gender_name: string
    }
  ]
}
```

**Service:** `UserService.getAllGenders()`

---

#### GET /roles
**Purpose:** Get all available user roles

**Requirements:** ✅ Auth Required

**Response:**
```typescript
{
  success: true,
  data: [
    {
      id: string,
      role_name: string,
      description: string
    }
  ]
}
```

**Service:** `UserService.getAllRoles()`

---

#### GET /check-profile
**Purpose:** Check if user profile is complete

**Requirements:** ✅ Auth Required

**Query Parameter:**
```
?user_id=<uuid>
```

**Response:**
```typescript
{
  success: true,
  data: {
    is_complete: boolean,
    completion_percentage: number,
    missing_fields: string[]
  }
}
```

**Service:** `UserService.checkProfileCompletion()`

---

### 6️⃣ COMMON ROUTES (`routes/common/common.route.ts`)

#### POST /update-device-info
**Purpose:** Register or update device information

**Requirements:** ✅ Auth Required

**Request Body:**
```typescript
{
  user_id: string,              // Required, UUID
  device_id: string,            // Required
  device_name?: string,
  os_type: string,              // Required, enum: ios|android|web
  os_version?: string,
  device_model?: string,
  app_version?: string,
  app_installed_time?: string
}
```

**Response:**
```typescript
{
  success: true,
  message: "Device info saved",
  data: {
    device_id: string,
    user_id: string,
    os_type: string,
    device_name: string
  }
}
```

**Service:** `CommonService.saveDeviceInfo()`

---

#### GET /device-info
**Purpose:** Retrieve saved device information

**Requirements:** ✅ Auth Required

**Query Parameter:**
```
?user_id=<uuid>
```

**Response:**
```typescript
{
  success: true,
  data: {
    device_id: string,
    device_name: string,
    os_type: string,
    os_version: string,
    device_model: string,
    app_version: string
  }
}
```

**Service:** `CommonService.getDeviceInfo()`

---

#### POST /save-token
**Purpose:** Save Firebase Cloud Messaging token for push notifications

**Requirements:** ✅ Auth Required

**Request Body:**
```typescript
{
  user_id: string,    // Required, UUID
  fcm_token: string,  // Required
  device_id?: string  // Optional
}
```

**Response:**
```typescript
{
  success: true,
  message: "Token saved",
  data: {
    token_id: string,
    user_id: string,
    fcm_token: string,
    created_at: string
  }
}
```

**Service:** `CommonService.saveFCMToken()`

---

#### GET /fcm-token
**Purpose:** Retrieve stored FCM token

**Requirements:** ✅ Auth Required

**Query Parameter:**
```
?user_id=<uuid>
```

**Response:**
```typescript
{
  success: true,
  data: {
    fcm_token: string,
    user_id: string,
    device_id: string,
    is_active: boolean
  }
}
```

**Service:** `CommonService.getFCMToken()`

---

## 🔀 Data Flow Diagrams

### Appointment Booking Flow
```
Customer sends: POST /customer/book-appointment
    ↓
Controller validates input (Zod schema)
    ↓
Service processes request:
  1. Check if shop_id provided
  2. If not, find nearest shops
  3. Find shop with available barber
  4. If none, find earliest available
  5. Calculate service duration & price
  ↓
Create appointment record
Create appointment_service records
    ↓
Return appointment with status "Pending"
```

### Barber Assignment Flow
```
Owner sends: POST /customer/assign-appointments
    ↓
Controller validates input
    ↓
Service processes:
  1. Find appointment
  2. If barberId provided, assign it
  3. Else auto-assign logic
  4. Calculate expected times
  5. Update barber available = false
  ↓
Update appointment:
  - status = "Accepted"
  - barber_id = <assigned>
  - expected_start_time
  - expected_end_time
  ↓
Return updated appointment
```

### Status Update Flow
```
User sends: POST /customer/change-appointment-status
    ↓
Validate status transition
    ↓
If status == "Completed":
  1. Calculate total price
  2. Calculate discounts
  3. Set payment_status = "Success"
  4. Release barber (available = true)
  5. Record completion time
    ↓
Update appointment status
    ↓
Return response with totals and services
```

---

## 📊 Enum Values Reference

### Appointment Status
```
- Pending        : Just created, waiting for assignment
- Accepted       : Barber assigned, waiting for time
- InProgress     : Service in progress
- Completed      : Service completed
- Rejected       : Shop rejected appointment
- Cancelled      : Customer cancelled
```

### Payment Mode
```
- cash           : Cash payment
- card           : Credit/Debit card
- upi            : UPI payment
- wallet         : Digital wallet
```

### Payment Status
```
- Pending        : Payment not done
- Success        : Payment successful
- Failed         : Payment failed
- Refunded       : Amount refunded
```

### Gender
```
- male
- female
- unisex
- others
```

### User Status
```
- active         : Active user
- inactive       : Inactive user
- suspended      : Account suspended
```

### OS Type
```
- ios            : Apple iOS
- android        : Android
- web            : Web browser
```

---

## 🛠️ Service Layer Overview

Each controller calls a corresponding service:

| Route | Service |
|-------|---------|
| `/auth/*` | `AuthService` |
| `/customer/*` | `CustomerService` |
| `/barber/*` | `BarberService` |
| `/shop/*` | `ShopService` |
| `/user/*` | `UserService` |
| `/common/*` | `CommonService` |

Services contain business logic and database operations using Sequelize models.

---

## 🎯 Quick Integration Guide

### 1. Setup Auth
```javascript
// Before any protected route
app.post('/api/auth/send-otp', AuthController.sendOtp)
app.post('/api/auth/verify-otp', AuthController.verifyOtp)
```

### 2. Create Appointment
```javascript
// Customer books
POST /api/customer/book-appointment
  → Appointment created with status "Pending"

// Shop assigns barber
POST /api/customer/assign-appointments
  → Barber assigned, status = "Accepted"

// Complete service
POST /api/customer/change-appointment-status
  → status = "Completed", payments calculated
```

### 3. Manage Shop
```javascript
// Register shop
POST /api/shop/save-shop-details
POST /api/shop/save-shop-location

// Add services
POST /api/shop/create-service

// Manage barbers
POST /api/barber/create-barber
```

---

## 📋 Documentation Files

1. **API_DOCUMENTATION.md** - Complete route details
2. **FLOWCHART_GUIDE.md** - Flowchart explanations
3. **COMPLETE_ROUTES_DOCUMENTATION.md** - This file

---

**Generated:** 19 December 2024
**Version:** 1.0.0
**Status:** Complete
