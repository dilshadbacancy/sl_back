# 🚀 API Documentation - Saloon Booking System

## 📋 Table of Contents
1. [Authentication Routes](#1-authentication-routes)
2. [Customer Routes](#2-customer-routes)
3. [Barber Routes](#3-barber-routes)
4. [Shop Routes](#4-shop-routes)
5. [User Routes](#5-user-routes)
6. [Common Routes](#6-common-routes)

---

## 1. Authentication Routes

### Base URL: `/auth`

#### 1.1 Send OTP
- **Endpoint:** `POST /send-otp`
- **Auth Required:** ❌ No
- **Description:** Send OTP to user's mobile number

**Request Body:**
```json
{
  "mobile": "9876543210"
}
```

**Validation:**
- `mobile` - Required, string

**Response (Success):**
```json
{
  "success": true,
  "message": "OTP send successfully",
  "data": {
    "otp": "123456",
    "expires_in": 300
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Error message"
}
```

---

#### 1.2 Verify OTP
- **Endpoint:** `POST /verify-otp`
- **Auth Required:** ❌ No
- **Description:** Verify OTP and create user session

**Request Body:**
```json
{
  "code": "123456",
  "mobile": "9876543210",
  "user_id": "uuid-optional"
}
```

**Validation:**
- `code` - Required, string
- `mobile` - Required, string
- `user_id` - Optional, UUID

**Response (Success):**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "user": {
      "id": "user-uuid",
      "mobile": "9876543210",
      "role": "customer"
    }
  }
}
```

---

#### 1.3 Logout
- **Endpoint:** `POST /logout`
- **Auth Required:** ✅ Yes (Bearer Token)
- **Description:** Logout user and invalidate tokens

**Request Header:**
```
Authorization: Bearer <access_token>
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": {}
}
```

---

#### 1.4 Generate New Access Token
- **Endpoint:** `POST /new-access-token`
- **Auth Required:** ❌ No
- **Description:** Generate new access token using refresh token

**Request Body:**
```json
{
  "refresh_token": "eyJhbGc..."
}
```

**Validation:**
- `refresh_token` - Required, string

**Response (Success):**
```json
{
  "success": true,
  "message": "New Access Token Generated",
  "data": {
    "access_token": "eyJhbGc...",
    "expires_in": 3600
  }
}
```

---

## 2. Customer Routes

### Base URL: `/customer`

#### 2.1 Fetch Nearby Shops
- **Endpoint:** `GET /near-by-shops`
- **Auth Required:** ✅ Yes
- **Description:** Get list of nearby shops based on location

**Request Body:**
```json
{
  "latitude": 23.1815,
  "longitude": 79.9864,
  "radius": 5
}
```

**Validation:**
- `latitude` - Required, number
- `longitude` - Required, number
- `radius` - Optional, number (default: 5)

**Response (Success):**
```json
{
  "success": true,
  "message": "All available near by shops fetched..",
  "data": [
    {
      "id": "shop-uuid",
      "shop_name": "Elite Salon",
      "email": "shop@example.com",
      "mobile": "9876543210",
      "distance": "2.5 km",
      "location": {
        "latitude": 23.1820,
        "longitude": 79.9850,
        "address": "Main Street, Downtown"
      },
      "shop_open_time": "09:00",
      "shop_close_time": "21:00"
    }
  ]
}
```

---

#### 2.2 Book Appointment
- **Endpoint:** `POST /book-appointment`
- **Auth Required:** ✅ Yes
- **Description:** Create new appointment with smart shop selection

**Request Body:**
```json
{
  "customer_id": "customer-uuid",
  "shop_id": "shop-uuid-optional",
  "appointment_date": "2024-12-20T14:00:00Z",
  "gender": "male",
  "notes": "Haircut and beard trim",
  "payment_mode": "cash",
  "services": [
    {
      "service_id": "service-uuid",
      "duration": 30,
      "price": 500,
      "discounted_price": 450
    }
  ],
  "location": {
    "latitude": "23.1815",
    "longitude": "79.9864",
    "radius": 5
  }
}
```

**Validation:**
- `customer_id` - Required, UUID
- `shop_id` - Optional, UUID
- `appointment_date` - Required, ISO date string
- `gender` - Required, enum (male|female|unisex|others)
- `payment_mode` - Required, enum (cash|card|upi|wallet)
- `services` - Required, array with min 1 item
- Each service requires: `service_id`, `duration`, `price`

**Logic:**
1. If shop_id provided → Use it
2. Else → Find nearest shop
3. Prefer shop with available barber
4. Else → Shop with barber free earliest

**Response (Success):**
```json
{
  "success": true,
  "message": "Appointment submitted",
  "data": {
    "id": "appointment-uuid",
    "customer_id": "customer-uuid",
    "shop_id": "shop-uuid",
    "appointment_date": "2024-12-20T14:00:00Z",
    "status": "Pending",
    "service_duration": 30,
    "distance": "2.5 km",
    "services": [
      {
        "id": "service-uuid",
        "name": "Haircut",
        "duration": 30,
        "price": 500
      }
    ]
  }
}
```

---

#### 2.3 Assign Appointments to Barber
- **Endpoint:** `POST /assign-appointments`
- **Auth Required:** ✅ Yes
- **Description:** Assign barber to pending appointment

**Request Body:**
```json
{
  "id": "appointment-uuid",
  "barberId": "barber-uuid-optional",
  "extra_duration": 15
}
```

**Validation:**
- `id` - Required, UUID
- `barberId` - Optional, UUID (if not provided, auto-assigns)
- `extra_duration` - Optional, number

**Logic:**
1. If barberId provided → Assign that barber
2. Else → Find any available barber
3. Else → Assign barber who gets free earliest
4. Calculate expected start/end times

**Response (Success):**
```json
{
  "success": true,
  "message": "Appointments accepted",
  "data": {
    "id": "appointment-uuid",
    "barber_id": "barber-uuid",
    "expected_start_time": "2024-12-20T14:00:00Z",
    "expected_end_time": "2024-12-20T14:45:00Z",
    "status": "Accepted",
    "total_service_duration": 45
  }
}
```

---

#### 2.4 Get All Appointments
- **Endpoint:** `GET /appointments`
- **Auth Required:** ✅ Yes
- **Description:** Retrieve appointments with filters

**Query Parameters:**
```
?user_id=uuid
&shop_id=uuid
&barber_id=uuid
&status=Pending|Accepted|InProgress|Completed|Rejected|Cancelled
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Appointments fetched successfully",
  "data": [
    {
      "id": "appointment-uuid",
      "booking_time": "2024-12-19T10:30:00Z",
      "appointment_date": "2024-12-20T14:00:00Z",
      "expected_start_time": "2024-12-20T14:00:00Z",
      "expected_end_time": "2024-12-20T14:45:00Z",
      "service_duration": 30,
      "extra_duration": 15,
      "total_service_duration": 45,
      "gender": "male",
      "status": "Accepted",
      "payment_status": "Pending",
      "payment_mode": "cash",
      "service_count": 1,
      "services": [
        {
          "id": "service-uuid",
          "appointment_service_id": "app-service-uuid",
          "name": "Haircut",
          "duration": 30,
          "price": 500,
          "description": "Premium haircut"
        }
      ],
      "barber": {
        "id": "barber-uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "mobile": "9876543210",
        "specialist_in": ["Haircut", "Beard Trim"],
        "available": false
      },
      "shop": {
        "id": "shop-uuid",
        "shop_name": "Elite Salon",
        "shop_logo_url": "https://...",
        "email": "shop@example.com",
        "mobile": "9876543210",
        "shop_open_time": "09:00",
        "shop_close_time": "21:00"
      },
      "customer": {
        "id": "customer-uuid",
        "first_name": "Jane",
        "last_name": "Smith",
        "email": "jane@example.com",
        "mobile": "9876543211"
      }
    }
  ]
}
```

---

#### 2.5 Change Appointment Status
- **Endpoint:** `POST /change-appointment-status`
- **Auth Required:** ✅ Yes
- **Description:** Update appointment status with validation

**Request Body:**
```json
{
  "id": "appointment-uuid",
  "status": "Completed",
  "remark": "Service completed successfully"
}
```

**Validation:**
- `id` - Required, UUID
- `status` - Required, enum (Pending|Accepted|InProgress|Completed|Rejected|Cancelled)
- `remark` - Required if status is Rejected or Cancelled

**Status Transition Rules:**
- Rejected appointments cannot be changed
- Cancelled appointments cannot be changed
- Cannot reject after accepted
- Cannot cancel ongoing appointments
- Cannot update completed appointments

**Response (Success):**
```json
{
  "success": true,
  "message": "Appointment status changed to Completed",
  "data": {
    "id": "appointment-uuid",
    "status": "Completed",
    "total_price": 500,
    "discount": 50,
    "chargeable_amount": 450,
    "appointment_id": "appointment-uuid",
    "shop_id": "shop-uuid",
    "customer_id": "customer-uuid",
    "barber_id": "barber-uuid",
    "service_count": 1,
    "services": [
      {
        "id": "service-uuid",
        "name": "Haircut",
        "description": "Premium haircut",
        "image_url": "https://...",
        "price": 500,
        "discount_price": 50
      }
    ]
  }
}
```

---

## 3. Barber Routes

### Base URL: `/barber`

#### 3.1 Barber Login
- **Endpoint:** `POST /login`
- **Auth Required:** ❌ No
- **Description:** Login barber with credentials

**Request Body:**
```json
{
  "username": "john_barber",
  "login_pin": "1234"
}
```

**Validation:**
- `username` - Required, string
- `login_pin` - Required, string

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successfully",
  "data": {
    "barber_id": "barber-uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "shop_id": "shop-uuid"
  }
}
```

---

#### 3.2 Get Barber Profile
- **Endpoint:** `GET /barber-profile`
- **Auth Required:** ✅ Yes (Barber Auth)
- **Description:** Get logged-in barber's profile

**Request Header:**
```
Authorization: Bearer <barber_token>
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Barber profile fetched",
  "data": {
    "id": "barber-uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "shop_id": "shop-uuid",
    "gender": "male",
    "specialist_in": ["Haircut", "Beard Trim", "Shaving"],
    "available": true,
    "status": "active",
    "age": 28
  }
}
```

---

#### 3.3 Get Barber's Appointments
- **Endpoint:** `GET /barbers-appointments`
- **Auth Required:** ✅ Yes (Barber Auth)
- **Description:** Get all appointments assigned to barber

**Request Header:**
```
Authorization: Bearer <barber_token>
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Appointments fetched",
  "data": [
    {
      "id": "appointment-uuid",
      "customer_id": "customer-uuid",
      "appointment_date": "2024-12-20T14:00:00Z",
      "expected_start_time": "2024-12-20T14:00:00Z",
      "expected_end_time": "2024-12-20T14:45:00Z",
      "status": "Accepted",
      "services": [
        {
          "id": "service-uuid",
          "name": "Haircut",
          "duration": 30
        }
      ],
      "customer": {
        "id": "customer-uuid",
        "first_name": "Jane",
        "last_name": "Smith",
        "mobile": "9876543211",
        "email": "jane@example.com"
      }
    }
  ]
}
```

---

#### 3.4 Create Barber
- **Endpoint:** `POST /create-barber`
- **Auth Required:** ✅ Yes (Shop Owner)
- **Description:** Register new barber in shop

**Request Body:**
```json
{
  "user_id": "user-uuid",
  "shop_id": "shop-uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "role": "barber",
  "age": 28,
  "gender": "male",
  "specialist_in": ["Haircut", "Beard Trim"],
  "status": "active"
}
```

**Validation:**
- `user_id` - Required, string
- `shop_id` - Required, string
- `name` - Required, string
- `mobile` - Required, 10-digit string
- `gender` - Required, enum
- Email validation if provided

**Response (Success):**
```json
{
  "success": true,
  "message": "Barber added successfully",
  "data": {
    "id": "barber-uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "shop_id": "shop-uuid",
    "status": "active",
    "gender": "male"
  }
}
```

---

#### 3.5 Update Barber
- **Endpoint:** `POST /update-barber`
- **Auth Required:** ✅ Yes (Shop Owner)
- **Description:** Update barber details

**Request Body:**
```json
{
  "id": "barber-uuid",
  "name": "John Doe Updated",
  "email": "newemail@example.com",
  "mobile": "9876543211",
  "gender": "male",
  "specialist_in": ["Haircut", "Beard Trim", "Coloring"],
  "status": "active",
  "age": 29
}
```

**Validation:**
- `id` - Required, UUID
- Other fields are optional

**Response (Success):**
```json
{
  "success": true,
  "message": "Barber details updated successfully",
  "data": {
    "id": "barber-uuid",
    "name": "John Doe Updated",
    "email": "newemail@example.com",
    "mobile": "9876543211",
    "updated_fields": [
      "name",
      "email",
      "mobile"
    ]
  }
}
```

---

#### 3.6 Get All Barbers of Shop
- **Endpoint:** `GET /barbers/:id`
- **Auth Required:** ✅ Yes (Shop Owner)
- **Path Parameters:**
```
:id = shop_id (UUID)
```

**Query Parameters:**
```
?available=true|false
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Barbers fetched successfully",
  "data": [
    {
      "id": "barber-uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "mobile": "9876543210",
      "specialist_in": ["Haircut", "Beard Trim"],
      "available": true,
      "status": "active",
      "shop_id": "shop-uuid"
    }
  ]
}
```

---

#### 3.7 Toggle Barber Availability
- **Endpoint:** `POST /availability`
- **Auth Required:** ✅ Yes (Shop Owner)
- **Description:** Mark barber as available/unavailable

**Request Body:**
```json
{
  "id": "barber-uuid",
  "available": true
}
```

**Validation:**
- `id` - Required, UUID
- `available` - Required, boolean

**Response (Success):**
```json
{
  "success": true,
  "message": "Barber availability changed successfully",
  "data": {
    "id": "barber-uuid",
    "available": true,
    "updated_at": "2024-12-19T10:30:00Z"
  }
}
```

---

## 4. Shop Routes

### Base URL: `/shop`

#### 4.1 Save Shop Details
- **Endpoint:** `POST /save-shop-details`
- **Auth Required:** ✅ Yes
- **Description:** Register/update shop information

**Request Body:**
```json
{
  "shop_name": "Elite Salon",
  "shop_logo_url": "https://example.com/logo.png",
  "email": "shop@example.com",
  "mobile": "9876543210",
  "shop_open_time": "09:00",
  "shop_close_time": "21:00",
  "vendor_id": "vendor-uuid-optional"
}
```

**Validation:**
- `shop_name` - Required, string
- `email` - Required, valid email
- `mobile` - Required, string

**Response (Success):**
```json
{
  "success": true,
  "message": "Shop details saved",
  "data": {
    "id": "shop-uuid",
    "shop_name": "Elite Salon",
    "email": "shop@example.com",
    "mobile": "9876543210",
    "shop_open_time": "09:00",
    "shop_close_time": "21:00"
  }
}
```

---

#### 4.2 Save Shop Location
- **Endpoint:** `POST /save-shop-location`
- **Auth Required:** ✅ Yes
- **Description:** Store shop's geographical location

**Request Body:**
```json
{
  "shop_id": "shop-uuid",
  "latitude": 23.1815,
  "longitude": 79.9864,
  "address": "123 Main Street",
  "city": "Indore",
  "state": "Madhya Pradesh",
  "zip_code": "452001"
}
```

**Validation:**
- `shop_id` - Required, UUID
- `latitude` - Required, number
- `longitude` - Required, number

**Response (Success):**
```json
{
  "success": true,
  "message": "Location saved",
  "data": {
    "id": "location-uuid",
    "shop_id": "shop-uuid",
    "latitude": 23.1815,
    "longitude": 79.9864,
    "address": "123 Main Street",
    "city": "Indore"
  }
}
```

---

#### 4.3 Save Shop KYC
- **Endpoint:** `POST /save-shop-kyc`
- **Auth Required:** ✅ Yes
- **Description:** Upload shop's KYC documents

**Request Body:**
```json
{
  "shop_id": "shop-uuid",
  "business_type": "Partnership",
  "gst_number": "18AABCT1234H1Z0",
  "pan_number": "AAAAA1111A",
  "aadhar_number": "1234567890123456",
  "kyc_document": "https://...",
  "kyc_status": "pending"
}
```

**Validation:**
- `shop_id` - Required, UUID
- `gst_number` - Required, string

**Response (Success):**
```json
{
  "success": true,
  "message": "KYC details saved",
  "data": {
    "id": "kyc-uuid",
    "shop_id": "shop-uuid",
    "gst_number": "18AABCT1234H1Z0",
    "kyc_status": "pending"
  }
}
```

---

#### 4.4 Save Shop Bank Details
- **Endpoint:** `POST /save-shop-bank`
- **Auth Required:** ✅ Yes
- **Description:** Store shop's bank account information

**Request Body:**
```json
{
  "shop_id": "shop-uuid",
  "account_holder": "Elite Salon Pvt Ltd",
  "account_number": "1234567890123456",
  "bank_name": "HDFC Bank",
  "ifsc_code": "HDFC0000001",
  "account_type": "Business",
  "branch": "Indore Main"
}
```

**Validation:**
- `shop_id` - Required, UUID
- `account_number` - Required, string
- `bank_name` - Required, string
- `ifsc_code` - Required, string

**Response (Success):**
```json
{
  "success": true,
  "message": "Bank details saved",
  "data": {
    "id": "bank-uuid",
    "shop_id": "shop-uuid",
    "account_number": "****7890",
    "bank_name": "HDFC Bank",
    "ifsc_code": "HDFC0000001"
  }
}
```

---

#### 4.5 Get Shop Profile
- **Endpoint:** `GET /get-shop-profile`
- **Auth Required:** ✅ Yes
- **Description:** Retrieve complete shop profile

**Query Parameters:**
```
?shop_id=uuid
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": "shop-uuid",
    "shop_name": "Elite Salon",
    "email": "shop@example.com",
    "mobile": "9876543210",
    "location": {
      "latitude": 23.1815,
      "longitude": 79.9864,
      "address": "123 Main Street",
      "city": "Indore"
    },
    "kyc": {
      "gst_number": "18AABCT1234H1Z0",
      "kyc_status": "verified"
    },
    "bank_details": {
      "account_holder": "Elite Salon Pvt Ltd",
      "bank_name": "HDFC Bank"
    },
    "services_count": 12,
    "barbers_count": 5
  }
}
```

---

#### 4.6 Create Service
- **Endpoint:** `POST /create-service`
- **Auth Required:** ✅ Yes
- **Description:** Add new service offered by shop

**Request Body:**
```json
{
  "shop_id": "shop-uuid",
  "name": "Premium Haircut",
  "description": "Professional haircut with styling",
  "duration": 30,
  "price": 500,
  "discounted_price": 450,
  "image_url": "https://example.com/service.jpg",
  "category": "Hair"
}
```

**Validation:**
- `shop_id` - Required, UUID
- `name` - Required, string
- `duration` - Required, number > 0
- `price` - Required, number >= 0

**Response (Success):**
```json
{
  "success": true,
  "message": "Service created",
  "data": {
    "id": "service-uuid",
    "name": "Premium Haircut",
    "duration": 30,
    "price": 500,
    "shop_id": "shop-uuid",
    "discounted_price": 450
  }
}
```

---

#### 4.7 Get All Services
- **Endpoint:** `GET /services`
- **Auth Required:** ✅ Yes
- **Description:** List all services of a shop

**Query Parameters:**
```
?shop_id=uuid
&category=string
```

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "id": "service-uuid",
      "name": "Premium Haircut",
      "description": "Professional haircut with styling",
      "duration": 30,
      "price": 500,
      "discounted_price": 450,
      "image_url": "https://example.com/service.jpg",
      "shop_id": "shop-uuid"
    }
  ]
}
```

---

## 5. User Routes

### Base URL: `/user`

#### 5.1 Save Profile
- **Endpoint:** `POST /save-profile`
- **Auth Required:** ✅ Yes
- **Description:** Create user profile for first time

**Request Body:**
```json
{
  "user_id": "user-uuid",
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane@example.com",
  "mobile": "9876543210",
  "gender": "female",
  "date_of_birth": "1990-05-15",
  "profile_pic": "https://example.com/pic.jpg"
}
```

**Validation:**
- `user_id` - Required, UUID
- `first_name` - Required, string
- `email` - Required, valid email
- `mobile` - Required, string
- `gender` - Required, enum

**Response (Success):**
```json
{
  "success": true,
  "message": "Profile saved",
  "data": {
    "user_id": "user-uuid",
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@example.com",
    "mobile": "9876543210",
    "gender": "female"
  }
}
```

---

#### 5.2 Update Profile
- **Endpoint:** `POST /update-profile`
- **Auth Required:** ✅ Yes
- **Description:** Update existing user profile

**Request Body:**
```json
{
  "user_id": "user-uuid",
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "newemail@example.com",
  "mobile": "9876543211",
  "gender": "female",
  "profile_pic": "https://example.com/newpic.jpg",
  "date_of_birth": "1990-05-15"
}
```

**Validation:**
- `user_id` - Required, UUID
- All other fields optional

**Response (Success):**
```json
{
  "success": true,
  "message": "Profile updated",
  "data": {
    "user_id": "user-uuid",
    "updated_fields": [
      "email",
      "mobile",
      "profile_pic"
    ]
  }
}
```

---

#### 5.3 Update Location
- **Endpoint:** `POST /update-location`
- **Auth Required:** ✅ Yes
- **Description:** Update user's current location

**Request Body:**
```json
{
  "user_id": "user-uuid",
  "latitude": 23.1815,
  "longitude": 79.9864,
  "address": "123 Main Street",
  "city": "Indore",
  "state": "Madhya Pradesh"
}
```

**Validation:**
- `user_id` - Required, UUID
- `latitude` - Required, number
- `longitude` - Required, number

**Response (Success):**
```json
{
  "success": true,
  "message": "Location updated",
  "data": {
    "user_id": "user-uuid",
    "latitude": 23.1815,
    "longitude": 79.9864,
    "address": "123 Main Street"
  }
}
```

---

#### 5.4 Get User Profile
- **Endpoint:** `GET /user-profile`
- **Auth Required:** ✅ Yes
- **Description:** Retrieve user's complete profile

**Query Parameters:**
```
?user_id=uuid
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "user_id": "user-uuid",
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@example.com",
    "mobile": "9876543210",
    "gender": "female",
    "profile_pic": "https://example.com/pic.jpg",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

---

#### 5.5 Update Status
- **Endpoint:** `POST /update-status`
- **Auth Required:** ✅ Yes
- **Description:** Update user's account status

**Request Body:**
```json
{
  "user_id": "user-uuid",
  "status": "active"
}
```

**Validation:**
- `user_id` - Required, UUID
- `status` - Required, enum

**Response (Success):**
```json
{
  "success": true,
  "message": "Status updated",
  "data": {
    "user_id": "user-uuid",
    "status": "active"
  }
}
```

---

#### 5.6 Get All User Statuses
- **Endpoint:** `GET /get-status`
- **Auth Required:** ✅ Yes
- **Description:** Get available user statuses

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "id": "status-1",
      "status_name": "Active",
      "description": "User account is active"
    },
    {
      "id": "status-2",
      "status_name": "Inactive",
      "description": "User account is inactive"
    },
    {
      "id": "status-3",
      "status_name": "Suspended",
      "description": "User account is suspended"
    }
  ]
}
```

---

#### 5.7 Get All Genders
- **Endpoint:** `GET /get-genders`
- **Auth Required:** ✅ Yes
- **Description:** Get available gender options

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "gender_name": "Male"
    },
    {
      "id": "2",
      "gender_name": "Female"
    },
    {
      "id": "3",
      "gender_name": "Other"
    }
  ]
}
```

---

#### 5.8 Get All Roles
- **Endpoint:** `GET /roles`
- **Auth Required:** ✅ Yes
- **Description:** Get available user roles

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "id": "role-1",
      "role_name": "Customer",
      "description": "Regular user who books appointments"
    },
    {
      "id": "role-2",
      "role_name": "Barber",
      "description": "Service provider"
    },
    {
      "id": "role-3",
      "role_name": "Shop Owner",
      "description": "Salon owner/manager"
    }
  ]
}
```

---

#### 5.9 Check Profile Completion
- **Endpoint:** `GET /check-profile`
- **Auth Required:** ✅ Yes
- **Description:** Check if user profile is complete

**Query Parameters:**
```
?user_id=uuid
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "is_complete": false,
    "completion_percentage": 75,
    "missing_fields": [
      "profile_pic",
      "date_of_birth"
    ]
  }
}
```

---

## 6. Common Routes

### Base URL: `/common`

#### 6.1 Update Device Info
- **Endpoint:** `POST /update-device-info`
- **Auth Required:** ✅ Yes
- **Description:** Save or update device information

**Request Body:**
```json
{
  "user_id": "user-uuid",
  "device_id": "device-unique-id",
  "device_name": "iPhone 14",
  "os_type": "ios",
  "os_version": "17.2",
  "device_model": "iPhone14,2",
  "app_version": "1.0.0",
  "app_installed_time": "2024-01-15"
}
```

**Validation:**
- `user_id` - Required, UUID
- `device_id` - Required, string
- `os_type` - Required, enum (ios|android|web)

**Response (Success):**
```json
{
  "success": true,
  "message": "Device info saved",
  "data": {
    "device_id": "device-unique-id",
    "user_id": "user-uuid",
    "os_type": "ios",
    "device_name": "iPhone 14"
  }
}
```

---

#### 6.2 Get Device Info
- **Endpoint:** `GET /device-info`
- **Auth Required:** ✅ Yes
- **Description:** Retrieve saved device information

**Query Parameters:**
```
?user_id=uuid
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "device_id": "device-unique-id",
    "device_name": "iPhone 14",
    "os_type": "ios",
    "os_version": "17.2",
    "device_model": "iPhone14,2",
    "app_version": "1.0.0"
  }
}
```

---

#### 6.3 Save FCM Token
- **Endpoint:** `POST /save-token`
- **Auth Required:** ✅ Yes
- **Description:** Store Firebase Cloud Messaging token for push notifications

**Request Body:**
```json
{
  "user_id": "user-uuid",
  "fcm_token": "eXRidTNyV3pIQ3BmQ2pXOjEwIjoyNDI0....",
  "device_id": "device-unique-id"
}
```

**Validation:**
- `user_id` - Required, UUID
- `fcm_token` - Required, string

**Response (Success):**
```json
{
  "success": true,
  "message": "Token saved",
  "data": {
    "token_id": "token-uuid",
    "user_id": "user-uuid",
    "fcm_token": "eXRidTNyV3pIQ3BmQ2pXOjEwIjoyNDI0....",
    "created_at": "2024-12-19T10:30:00Z"
  }
}
```

---

#### 6.4 Get FCM Token
- **Endpoint:** `GET /fcm-token`
- **Auth Required:** ✅ Yes
- **Description:** Retrieve stored FCM token

**Query Parameters:**
```
?user_id=uuid
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "fcm_token": "eXRidTNyV3pIQ3BmQ2pXOjEwIjoyNDI0....",
    "user_id": "user-uuid",
    "device_id": "device-unique-id",
    "is_active": true
  }
}
```

---

## Common Error Responses

All endpoints follow this error response format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Common Status Codes

- **200 OK** - Request successful
- **201 Created** - Resource created
- **400 Bad Request** - Invalid request body/params
- **401 Unauthorized** - Missing or invalid auth token
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

---

## Authentication

### Bearer Token Format

All authenticated endpoints require:

```
Authorization: Bearer <access_token>
```

### Token Generation

1. Call `/auth/send-otp` with mobile
2. Call `/auth/verify-otp` with code
3. Receive `access_token` and `refresh_token`
4. Use `access_token` in Authorization header
5. When `access_token` expires, use `/auth/new-access-token` with `refresh_token`

---

## Enum Values

### Appointment Status
- `Pending` - Appointment created, awaiting barber assignment
- `Accepted` - Barber assigned, waiting for appointment time
- `InProgress` - Appointment in progress
- `Completed` - Appointment completed successfully
- `Rejected` - Appointment rejected
- `Cancelled` - Appointment cancelled

### Payment Mode
- `cash`
- `card`
- `upi`
- `wallet`

### Payment Status
- `Pending`
- `Success`
- `Failed`
- `Refunded`

### Gender
- `male`
- `female`
- `unisex`
- `others`

### User Status
- `active`
- `inactive`
- `suspended`

### OS Type
- `ios`
- `android`
- `web`

---

**Last Updated:** 19 December 2024
**Version:** 1.0.0
