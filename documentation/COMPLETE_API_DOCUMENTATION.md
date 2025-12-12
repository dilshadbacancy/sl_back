# Complete API Documentation

**Last Updated:** December 10, 2025  
**API Version:** 1.0.0  
**Total Endpoints:** 41

---

## Table of Contents

1. [Authentication (COMMON)](#authentication-common)
2. [Device & FCM (COMMON)](#device--fcm-common)
3. [Image Upload (COMMON)](#image-upload-common)
4. [Customer - Appointments (USER)](#customer---appointments-user)
5. [Customer - Services (USER)](#customer---services-user)
6. [User - Profile (USER)](#user---profile-user)
7. [Barber - Authentication (VENDOR)](#barber---authentication-vendor)
8. [Barber - Management (VENDOR)](#barber---management-vendor)
9. [Shop - Setup (VENDOR)](#shop---setup-vendor)
10. [Shop - Services (VENDOR)](#shop---services-vendor)

---

## Authentication (COMMON)

### 1. Send OTP

**Endpoint:** `POST /common/send-otp`

**Authentication:** Not Required

**Description:** Send OTP to user's mobile number for authentication

**Request Body:**
```json
{
  "mobile": "9876543210"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "mobile": "9876543210",
    "otp_id": "550e8400-e29b-41d4-a716-446655440000",
    "expires_in": "5 minutes"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid mobile number"
}
```

---

### 2. Verify OTP

**Endpoint:** `POST /common/verify-otp`

**Authentication:** Not Required

**Description:** Verify OTP and get access/refresh tokens

**Request Body:**
```json
{
  "mobile": "9876543210",
  "otp": "123456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "mobile": "9876543210",
      "role": "customer"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid OTP"
}
```

---

### 3. Logout

**Endpoint:** `POST /common/logout`

**Authentication:** Required (Bearer Token)

**Description:** Logout user and invalidate tokens

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 4. Refresh Access Token

**Endpoint:** `POST /common/new-access-token`

**Authentication:** Required (Bearer Token)

**Description:** Get new access token using refresh token

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "New access token generated",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": "1 hour"
  }
}
```

---

## Device & FCM (COMMON)

### 5. Save Device Info

**Endpoint:** `POST /common/update-device-info`

**Authentication:** Required (Bearer Token)

**Description:** Save or update device information

**Request Body:**
```json
{
  "device_info": {
    "device_id": "ABC123XYZ",
    "device_name": "iPhone 14 Pro",
    "os": "iOS",
    "os_version": "17.1",
    "app_version": "1.0.0"
  },
  "platform_info": {
    "platform": "iOS",
    "locale": "en_US"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Device updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "device_info": {
      "device_id": "ABC123XYZ",
      "device_name": "iPhone 14 Pro",
      "os": "iOS"
    }
  }
}
```

---

### 6. Get Device Info

**Endpoint:** `GET /common/device-info`

**Authentication:** Required (Bearer Token)

**Description:** Get current user's device information

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Device information fetched",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "device_info": {
      "device_id": "ABC123XYZ",
      "device_name": "iPhone 14 Pro",
      "os": "iOS"
    },
    "platform_info": {
      "platform": "iOS",
      "locale": "en_US"
    }
  }
}
```

---

### 7. Save FCM Token

**Endpoint:** `POST /common/save-token`

**Authentication:** Required (Bearer Token)

**Description:** Register Firebase Cloud Messaging token for push notifications

**Request Body:**
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "fcm_token": "eRvv3QQwNvA:APA91bGl7Z5J...",
  "device_type": "iOS"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Token saved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "fcm_token": "eRvv3QQwNvA:APA91bGl7Z5J...",
    "device_type": "iOS"
  }
}
```

---

### 8. Get FCM Tokens

**Endpoint:** `GET /common/fcm-token`

**Authentication:** Required (Bearer Token)

**Description:** Get all FCM tokens registered for current user

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Fcm token fetched successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "fcm_token": "eRvv3QQwNvA:APA91bGl7Z5J...",
      "device_type": "iOS"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "fcm_token": "dXvv4QRxOwB:BPB92ChMm8Z...",
      "device_type": "Android"
    }
  ]
}
```

---

### 9. Upload Image

**Endpoint:** `POST /common/upload-image`

**Authentication:** Required (Bearer Token)

**Description:** Upload image to Cloudinary and get secure URL

**Request:**
- Content-Type: `multipart/form-data`
- Field: `image` (file, max 5MB)
- Query Params: `?folder=salon-booking/profiles` (optional)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/salon-booking/xyz.jpg",
    "public_id": "salon-booking/xyz"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "No file provided"
}
```

---

## Customer - Appointments (USER)

### 10. Find Nearby Shops

**Endpoint:** `GET /user/near-by-shops`

**Authentication:** Required (Bearer Token)

**Description:** Find salons/barber shops near user's location

**Request Body:**
```json
{
  "latitude": 28.6139,
  "longitude": 77.2090,
  "radius": 5
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "All available near by shops fetched",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "shop_name": "Premium Salon",
      "email": "info@salon.com",
      "mobile": "9876543210",
      "shop_open_time": "09:00",
      "shop_close_time": "21:00",
      "distance": 2.5
    }
  ]
}
```

---

### 11. Book Appointment

**Endpoint:** `POST /user/book-appointment`

**Authentication:** Required (Bearer Token)

**Description:** Create a new appointment booking

**Request Body:**
```json
{
  "customer_id": "550e8400-e29b-41d4-a716-446655440000",
  "shop_id": "660e8400-e29b-41d4-a716-446655440001",
  "appointment_date": "2025-12-15T14:30:00Z",
  "gender": "male",
  "notes": "Professional haircut",
  "payment_mode": "online",
  "services": [
    {
      "service_id": "770e8400-e29b-41d4-a716-446655440002",
      "duration": 30,
      "price": 500,
      "discounted_price": 450
    }
  ],
  "location": {
    "latitude": "28.6139",
    "longitude": "77.2090"
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "customer_id": "550e8400-e29b-41d4-a716-446655440000",
    "shop_id": "660e8400-e29b-41d4-a716-446655440001",
    "appointment_date": "2025-12-15T14:30:00Z",
    "status": "pending",
    "total_price": 450
  }
}
```

---

### 12. Assign Barber to Appointment

**Endpoint:** `POST /user/assign-appointments`

**Authentication:** Required (Bearer Token)

**Description:** Assign a barber to a booked appointment

**Request Body:**
```json
{
  "appointment_id": "880e8400-e29b-41d4-a716-446655440003",
  "barber_id": "990e8400-e29b-41d4-a716-446655440004"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Barber assigned successfully",
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "barber_id": "990e8400-e29b-41d4-a716-446655440004",
    "status": "accepted"
  }
}
```

---

### 13. Get User Appointments

**Endpoint:** `GET /user/appointments`

**Authentication:** Required (Bearer Token)

**Description:** Get all appointments for current user

**Query Parameters:**
- `status` (optional): pending, accepted, inprogress, completed, cancelled
- `limit` (optional): default 10
- `offset` (optional): default 0

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Appointments fetched",
  "data": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440003",
      "shop_name": "Premium Salon",
      "appointment_date": "2025-12-15T14:30:00Z",
      "status": "pending",
      "total_price": 450,
      "barber_name": "John Doe"
    }
  ]
}
```

---

### 14. Change Appointment Status

**Endpoint:** `POST /user/change-appointment-status`

**Authentication:** Required (Bearer Token)

**Description:** Update appointment status (accept, start, complete, cancel)

**Request Body:**
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "status": "inprogress",
  "remark": "Barber started the service"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Appointment status updated",
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "status": "inprogress",
    "updated_at": "2025-12-15T14:35:00Z"
  }
}
```

---

### 15. Get Payment Modes

**Endpoint:** `GET /user/payment-modes`

**Authentication:** Required (Bearer Token)

**Description:** Get available payment modes

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Payment modes fetched",
  "data": [
    "cash",
    "online",
    "card",
    "wallet"
  ]
}
```

---

### 16. Get Appointment Statuses

**Endpoint:** `GET /user/appointment-statuses`

**Authentication:** Required (Bearer Token)

**Description:** Get available appointment statuses

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Appointment statuses fetched",
  "data": [
    "pending",
    "accepted",
    "inprogress",
    "completed",
    "cancelled",
    "rejected"
  ]
}
```

---

## Customer - Services (USER)

### 17. Add Services

**Endpoint:** `POST /user/add-services`

**Authentication:** Required (Bearer Token)

**Description:** Add services offered by salon/shop

**Request Body:**
```json
{
  "shop_id": "660e8400-e29b-41d4-a716-446655440001",
  "services": [
    {
      "service_name": "Professional Haircut",
      "description": "Full haircut with styling",
      "duration": 30,
      "price": 500
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Services added to your shops",
  "data": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "service_name": "Professional Haircut",
      "price": 500,
      "duration": 30
    }
  ]
}
```

---

### 18. Update Service

**Endpoint:** `POST /user/update-service`

**Authentication:** Required (Bearer Token)

**Description:** Update existing service details

**Request Body:**
```json
{
  "service_id": "770e8400-e29b-41d4-a716-446655440002",
  "service_name": "Premium Haircut",
  "description": "Professional haircut with premium styling",
  "duration": 45,
  "price": 750
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Service updated successfully",
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "service_name": "Premium Haircut",
    "price": 750,
    "duration": 45
  }
}
```

---

## User - Profile (USER)

### 19. Save Profile

**Endpoint:** `POST /user/save-profile`

**Authentication:** Required (Bearer Token)

**Description:** Create or save user profile information

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "gender": "male",
  "location": "New Delhi",
  "profile_picture": "https://res.cloudinary.com/..."
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Profile created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com"
  }
}
```

---

### 20. Update Profile

**Endpoint:** `PUT /user/update-profile`

**Authentication:** Required (Bearer Token)

**Description:** Update existing user profile

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Smith",
  "location": "Gurgaon"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "first_name": "John",
    "last_name": "Smith"
  }
}
```

---

### 21. Update Location

**Endpoint:** `POST /user/update-location`

**Authentication:** Required (Bearer Token)

**Description:** Update user's location coordinates

**Request Body:**
```json
{
  "latitude": 28.6139,
  "longitude": 77.2090,
  "address": "123 Main Street, New Delhi"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Location updated successfully",
  "data": {
    "latitude": 28.6139,
    "longitude": 77.2090
  }
}
```

---

### 22. Get User Profile

**Endpoint:** `GET /user/user-profile`

**Authentication:** Required (Bearer Token)

**Description:** Get current user's complete profile

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User profile fetched",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "gender": "male",
    "location": "New Delhi"
  }
}
```

---

### 23. Update Status

**Endpoint:** `POST /user/update-status`

**Authentication:** Required (Bearer Token)

**Description:** Update user account status

**Request Body:**
```json
{
  "status": "active"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Status updated successfully",
  "data": {
    "status": "active"
  }
}
```

---

### 24. Get Status

**Endpoint:** `GET /user/get-status`

**Authentication:** Required (Bearer Token)

**Description:** Get current user account status

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Status fetched",
  "data": {
    "status": "active",
    "profile_complete": true
  }
}
```

---

### 25. Get Genders

**Endpoint:** `GET /user/get-genders`

**Authentication:** Required (Bearer Token)

**Description:** Get available gender options

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Genders fetched",
  "data": ["male", "female", "unisex", "others"]
}
```

---

### 26. Get Roles

**Endpoint:** `GET /user/roles`

**Authentication:** Required (Bearer Token)

**Description:** Get available user roles

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Roles fetched",
  "data": ["customer", "vendor", "barber", "admin"]
}
```

---

### 27. Check Profile Completion

**Endpoint:** `GET /user/check-profile`

**Authentication:** Required (Bearer Token)

**Description:** Check if user profile is complete

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile completion status",
  "data": {
    "is_complete": true,
    "missing_fields": []
  }
}
```

---

## Barber - Authentication (VENDOR)

### 28. Barber Login

**Endpoint:** `POST /vendor/login`

**Authentication:** Not Required

**Description:** Barber login with credentials

**Request Body:**
```json
{
  "email": "barber@salon.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "barber": {
      "id": "990e8400-e29b-41d4-a716-446655440004",
      "name": "John Barber",
      "email": "barber@salon.com"
    }
  }
}
```

---

## Barber - Management (VENDOR)

### 29. Get Barber Profile

**Endpoint:** `GET /vendor/barber-profile`

**Authentication:** Required (Barber Auth)

**Description:** Get current barber's profile information

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Barber profile fetched",
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440004",
    "name": "John Barber",
    "email": "barber@salon.com",
    "shop_id": "660e8400-e29b-41d4-a716-446655440001",
    "specializations": ["haircut", "beard", "color"]
  }
}
```

---

### 30. Get Barber Appointments

**Endpoint:** `GET /vendor/barbers-appointments`

**Authentication:** Required (Barber Auth)

**Description:** Get all appointments assigned to barber

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Appointments fetched",
  "data": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440003",
      "customer_name": "John Doe",
      "appointment_date": "2025-12-15T14:30:00Z",
      "services": ["Professional Haircut"],
      "status": "pending"
    }
  ]
}
```

---

### 31. Create Barber

**Endpoint:** `POST /vendor/create-barber`

**Authentication:** Required (Bearer Token - Shop Owner)

**Description:** Add new barber to shop

**Request Body:**
```json
{
  "name": "John Barber",
  "email": "john@salon.com",
  "mobile": "9876543210",
  "specializations": ["haircut", "beard", "color"],
  "shop_id": "660e8400-e29b-41d4-a716-446655440001"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Barber created successfully",
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440004",
    "name": "John Barber",
    "email": "john@salon.com"
  }
}
```

---

### 32. Update Barber

**Endpoint:** `PUT /vendor/update-barber`

**Authentication:** Required (Bearer Token)

**Description:** Update barber information

**Request Body:**
```json
{
  "barber_id": "990e8400-e29b-41d4-a716-446655440004",
  "specializations": ["haircut", "beard", "color", "styling"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Barber updated successfully",
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440004",
    "specializations": ["haircut", "beard", "color", "styling"]
  }
}
```

---

### 33. Get Barber by ID

**Endpoint:** `GET /vendor/barbers/:id`

**Authentication:** Required (Bearer Token)

**Description:** Get specific barber details

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Barber details fetched",
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440004",
    "name": "John Barber",
    "email": "john@salon.com",
    "specializations": ["haircut", "beard", "color"]
  }
}
```

---

### 34. Set Barber Availability

**Endpoint:** `POST /vendor/availability`

**Authentication:** Required (Barber Auth)

**Description:** Set barber's working hours and days

**Request Body:**
```json
{
  "barber_id": "990e8400-e29b-41d4-a716-446655440004",
  "working_days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  "start_time": "09:00",
  "end_time": "21:00",
  "break_start": "13:00",
  "break_end": "14:00"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Availability set successfully",
  "data": {
    "barber_id": "990e8400-e29b-41d4-a716-446655440004",
    "working_days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "start_time": "09:00",
    "end_time": "21:00"
  }
}
```

---

## Shop - Setup (VENDOR)

### 35. Save Shop Details

**Endpoint:** `POST /vendor/save-shop-details`

**Authentication:** Required (Bearer Token)

**Description:** Create shop profile with basic information

**Request Body:**
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "shop_name": "Premium Salon",
  "email": "info@salon.com",
  "mobile": "9876543210",
  "shop_open_time": "09:00",
  "shop_close_time": "21:00",
  "weekly_holiday": "Sunday",
  "gstin_number": "27ABCDE1234F0Z5"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Shop details saved successfully",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "shop_name": "Premium Salon",
    "email": "info@salon.com"
  }
}
```

---

### 36. Save Shop Location

**Endpoint:** `POST /vendor/save-shop-location`

**Authentication:** Required (Bearer Token)

**Description:** Add location details for shop

**Request Body:**
```json
{
  "shop_id": "660e8400-e29b-41d4-a716-446655440001",
  "address": "123 Main Street",
  "city": "New Delhi",
  "state": "Delhi",
  "postal_code": "110001",
  "latitude": 28.6139,
  "longitude": 77.2090
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Shop location saved successfully",
  "data": {
    "shop_id": "660e8400-e29b-41d4-a716-446655440001",
    "address": "123 Main Street",
    "city": "New Delhi"
  }
}
```

---

### 37. Save Shop KYC

**Endpoint:** `POST /vendor/save-shop-kyc`

**Authentication:** Required (Bearer Token)

**Description:** Upload KYC (Know Your Customer) documents

**Request Body:**
```json
{
  "shop_id": "660e8400-e29b-41d4-a716-446655440001",
  "owner_name": "John Smith",
  "aadhar_number": "1234567890123456",
  "pan_number": "AAAPA1234A1234",
  "aadhar_document_url": "https://res.cloudinary.com/...",
  "pan_document_url": "https://res.cloudinary.com/..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "KYC details saved successfully",
  "data": {
    "shop_id": "660e8400-e29b-41d4-a716-446655440001",
    "owner_name": "John Smith",
    "kyc_status": "pending"
  }
}
```

---

### 38. Save Shop Bank Details

**Endpoint:** `POST /vendor/save-shop-bank`

**Authentication:** Required (Bearer Token)

**Description:** Add bank account details for payment

**Request Body:**
```json
{
  "shop_id": "660e8400-e29b-41d4-a716-446655440001",
  "account_holder_name": "Premium Salon",
  "account_number": "1234567890123456",
  "ifsc_code": "SBIN0001234",
  "bank_name": "State Bank of India",
  "account_type": "Business"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Bank details saved successfully",
  "data": {
    "shop_id": "660e8400-e29b-41d4-a716-446655440001",
    "account_holder_name": "Premium Salon"
  }
}
```

---

### 39. Get Shop Profile

**Endpoint:** `GET /vendor/get-shop-profile`

**Authentication:** Required (Bearer Token)

**Description:** Get complete shop profile information

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Shop profile fetched",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "shop_name": "Premium Salon",
    "email": "info@salon.com",
    "mobile": "9876543210",
    "address": "123 Main Street",
    "city": "New Delhi",
    "latitude": 28.6139,
    "longitude": 77.2090
  }
}
```

---

## Shop - Services (VENDOR)

### 40. Create Service

**Endpoint:** `POST /vendor/create-service`

**Authentication:** Required (Bearer Token)

**Description:** Add new service to shop

**Request Body:**
```json
{
  "shop_id": "660e8400-e29b-41d4-a716-446655440001",
  "service_name": "Professional Haircut",
  "description": "Full haircut with styling",
  "duration": 30,
  "price": 500,
  "image_url": "https://res.cloudinary.com/..."
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Service created successfully",
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "service_name": "Professional Haircut",
    "price": 500,
    "duration": 30
  }
}
```

---

### 41. Get Shop Services

**Endpoint:** `GET /vendor/services`

**Authentication:** Required (Bearer Token)

**Description:** Get all services offered by shop

**Query Parameters:**
- `shop_id` (required): Shop ID
- `limit` (optional): default 10
- `offset` (optional): default 0

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Services fetched",
  "data": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "service_name": "Professional Haircut",
      "description": "Full haircut with styling",
      "price": 500,
      "duration": 30
    },
    {
      "id": "880e8400-e29b-41d4-a716-446655440003",
      "service_name": "Beard Trim",
      "description": "Beard shaping and trimming",
      "price": 300,
      "duration": 20
    }
  ]
}
```

---

## Error Handling

All endpoints return consistent error responses:

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Invalid input data",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Authentication required or invalid token"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "You don't have permission to access this resource"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details (only in development)"
}
```

---

## Authentication

All protected endpoints require the `Authorization` header:

```
Authorization: Bearer <access_token>
```

Tokens are obtained from:
- `/common/verify-otp` - User login
- `/vendor/login` - Barber login

---

## Base URL

```
http://localhost:3000/api
```

Or in production:
```
https://api.example.com
```

---

**Last Updated:** December 10, 2025
