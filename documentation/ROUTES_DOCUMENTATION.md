# API Routes Documentation

**Last Updated:** 1/2/2026, 11:25:58 AM  
**Total Routes:** 42

---

## 📊 Routes Summary

| Category | Count | Methods |
|----------|-------|---------|
| Auth | 4 | POST |
| User | 9 | POST, PUT, GET |
| Customer | 7 | GET, POST, PUT |
| Vendor | 9 | POST, GET, PUT |
| Barber | 7 | POST, GET, PUT |
| Common | 5 | PUT, GET, POST |
| Health | 1 | GET |

---

## Auth Routes (4)

### POST /auth/logout

**Description:** Logout user and blacklist token

**Authentication:** Required

**Defined In:** `common/auth.route.ts`

**Request Body:** Based on route requirements

**Example Response:**

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "success"
  }
}
```

---

### POST /auth/new-access-token

**Description:** Generate new access token using refresh token

**Authentication:** Not Required

**Defined In:** `common/auth.route.ts`

**Request Body:**

```typescript
{
  refresh_token: string;
}
```

**Fields:**

- `refresh_token` (string) (required) - Refresh token

**Example Request Body:**

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Example Response:**

```json
{
  "success": true,
  "message": "New access token generated",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### POST /auth/send-otp

**Description:** Send OTP to user mobile number

**Authentication:** Not Required

**Defined In:** `common/auth.route.ts`

**Request Body:**

```typescript
{
  mobile: string;
  role: string;
}
```

**Fields:**

- `mobile` (string) (required) - 10 digit mobile number
- `role` (enum) (required) - User role (customer, vendor, admin)

**Example Request Body:**

```json
{
  "mobile": "9876543210",
  "role": "customer"
}
```

**Example Response:**

```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "mobile": "9876543210"
  }
}
```

---

### POST /auth/verify-otp

**Description:** Verify OTP and get access token

**Authentication:** Not Required

**Defined In:** `common/auth.route.ts`

**Request Body:**

```typescript
{
  code: string;
  mobile: string;
  user_id?: string;
}
```

**Fields:**

- `code` (string) (required) - OTP code received via SMS
- `mobile` (string) (required) - 10 digit mobile number
- `user_id` (string) (optional) - User ID (optional, for existing users)

**Example Request Body:**

```json
{
  "code": "123456",
  "mobile": "9876543210",
  "user_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Example Response:**

```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDAwIiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzA0MjE2MDAwLCJleHAiOjE3MDQyMTk2MDB9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDAwIiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzA0MjE2MDAwLCJleHAiOjE3MDQ4MjA4MDB9...",
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "mobile": "9876543210",
      "role": "customer"
    }
  }
}
```

---

## User Routes (9)

### GET /users/check-profile

**Description:** Check if user profile is completed

**Authentication:** Required

**Defined In:** `user/user.route.ts`

**Example Response:**

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "user@example.com",
    "mobile": "9876543210",
    "role": "customer"
  }
}
```

---

### GET /users/get-genders

**Description:** Get all available genders

**Authentication:** Required

**Defined In:** `user/user.route.ts`

**Example Response:**

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": [
    "male",
    "female",
    "unisex",
    "others"
  ]
}
```

---

### GET /users/get-status

**Description:** Get all available user statuses

**Authentication:** Required

**Defined In:** `user/user.route.ts`

**Example Response:**

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": [
    "male",
    "female",
    "unisex",
    "others"
  ]
}
```

---

### GET /users/roles

**Description:** Get all available roles

**Authentication:** Required

**Defined In:** `user/user.route.ts`

**Example Response:**

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": [
    "male",
    "female",
    "unisex",
    "others"
  ]
}
```

---

### GET /users/user-profile

**Description:** Get current user profile

**Authentication:** Required

**Defined In:** `user/user.route.ts`

**Example Response:**

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "user@example.com",
    "mobile": "9876543210",
    "role": "customer"
  }
}
```

---

### POST /users/save-profile

**Description:** Save user profile information

**Authentication:** Required

**Defined In:** `user/user.route.ts`

**Request Body:**

```typescript
{
  user_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  location: object;
  is_onboarding_completed?: boolean;
  gender: string;
}
```

**Fields:**

- `user_id` (string) (optional) - User ID (optional)
- `first_name` (string) (required) - First name
- `last_name` (string) (required) - Last name
- `email` (string) (required) - Email address
- `location` (object) (required) - User location
- `is_onboarding_completed` (boolean) (optional) - Onboarding completion status
- `gender` (enum) (required) - Gender (male, female, unisex, others)

**Example Request Body:**

```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "first_name": "John",
  "last_name": "Doe",
  "email": "user@example.com",
  "location": {
    "country": "USA",
    "state": "NY",
    "city": "New York",
    "landmark": "Near Central Park",
    "latitude": "40.7128",
    "longitude": "-74.0060"
  },
  "gender": "male"
}
```

**Example Response:**

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "success"
  }
}
```

---

### PUT /users/update-location

**Description:** Update user location

**Authentication:** Required

**Defined In:** `user/user.route.ts`

**Request Body:**

```typescript
{
  latitude: string;
  longitude: string;
  user_id: string;
}
```

**Fields:**

- `latitude` (string) (required) - Latitude coordinate
- `longitude` (string) (required) - Longitude coordinate
- `user_id` (string) (required) - User ID

**Example Request Body:**

```json
{
  "latitude": "28.6139",
  "longitude": "77.2090",
  "user_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Example Response:**

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "success"
  }
}
```

---

### PUT /users/update-profile

**Description:** Update user profile information

**Authentication:** Required

**Defined In:** `user/user.route.ts`

**Request Body:**

```typescript
{
  user_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  location?: object;
  is_onboarding_completed?: boolean;
  gender?: string;
}
```

**Fields:**

- `user_id` (string) (optional) - User ID (optional)
- `first_name` (string) (optional) - First name
- `last_name` (string) (optional) - Last name
- `email` (string) (optional) - Email address
- `location` (object) (optional) - User location (all fields optional)
- `is_onboarding_completed` (boolean) (optional) - Onboarding completion status
- `gender` (enum) (optional) - Gender (male, female, unisex, others)

**Example Request Body:**

```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "first_name": "John",
  "last_name": "Doe",
  "location": {},
  "is_onboarding_completed": true,
  "gender": "male"
}
```

**Example Response:**

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "success"
  }
}
```

---

### PUT /users/update-status

**Description:** Update user status

**Authentication:** Required

**Defined In:** `user/user.route.ts`

**Request Body:**

```typescript
{
  user_id: string;
  status: string;
}
```

**Fields:**

- `user_id` (string) (required) - User ID
- `status` (enum) (required) - Status (active, inactive, deleted)

**Example Request Body:**

```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "active"
}
```

**Example Response:**

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "success"
  }
}
```

---

## Customer Routes (7)

### GET /customer/appointment-statuses

**Description:** Change appointment status

**Authentication:** Required

**Defined In:** `user/customer.route.ts`

**Example Response:**

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": [
    "male",
    "female",
    "unisex",
    "others"
  ]
}
```

---

### GET /customer/appointments

**Description:** Get all customer appointments

**Authentication:** Required

**Defined In:** `user/customer.route.ts`

**Query Parameters:**

- `user_id` (string) (optional) - Filter by user ID
- `shop_id` (string) (optional) - Filter by shop ID
- `barber_id` (string) (optional) - Filter by barber ID
- `status` (enum) (optional) - Filter by status

**Example Response:**

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "customer_id": "123e4567-e89b-12d3-a456-426614174000",
      "shop_id": "123e4567-e89b-12d3-a456-426614174000",
      "appointment_date": "2026-01-15T10:00:00Z",
      "status": "pending"
    }
  ]
}
```

---

### GET /customer/near-by-shops

**Description:** Get nearby shops based on location

**Authentication:** Not Required

**Defined In:** `user/customer.route.ts`

**Query Parameters:**

- `latitude` (number) (required) - Latitude coordinate
- `longitude` (number) (required) - Longitude coordinate
- `radius` (number) (optional) - Search radius in km (default: 5)

**Example Response:**

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "shop_name": "My Barber Shop",
      "distance": 2.5,
      "location": {
        "latitude": 28.6139,
        "longitude": 77.209
      }
    }
  ]
}
```

---

### GET /customer/payment-modes

**Description:** Get all available payment modes

**Authentication:** Required

**Defined In:** `user/customer.route.ts`

**Example Response:**

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": [
    "cash",
    "online",
    "other"
  ]
}
```

---

### POST /customer/book-appointment

**Description:** Book a new appointment

**Authentication:** Required

**Defined In:** `user/customer.route.ts`

**Request Body:**

```typescript
{
  customer_id: string;
  shop_id?: string;
  appointment_date: string;
  gender: string;
  notes?: string;
  payment_mode: string;
  services: Array<object>;
  location?: object;
}
```

**Fields:**

- `customer_id` (string) (required) - Customer UUID
- `shop_id` (string) (optional) - Shop UUID (optional)
- `appointment_date` (string) (required) - ISO date string
- `gender` (enum) (required) - Gender preference (male, female, unisex, others)
- `notes` (string) (optional) - Additional notes
- `payment_mode` (enum) (required) - Payment mode (cash, online, other)
- `services` (array) (required) - Array of services
- `location` (object) (optional) - Location details (optional)

**Example Request Body:**

```json
{
  "customer_id": "123e4567-e89b-12d3-a456-426614174000",
  "shop_id": "123e4567-e89b-12d3-a456-426614174000",
  "appointment_date": "2026-01-15T10:00:00Z",
  "gender": "male",
  "payment_mode": "cash",
  "services": [
    {
      "service_id": "123e4567-e89b-12d3-a456-426614174000",
      "duration": 30,
      "price": 500,
      "discounted_price": 450
    }
  ],
  "location": {
    "latitude": "28.6139",
    "longitude": "77.2090",
    "radius": 5
  }
}
```

**Example Response:**

```json
{
  "success": true,
  "message": "Appointment submitted",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "customer_id": "123e4567-e89b-12d3-a456-426614174000",
    "shop_id": "123e4567-e89b-12d3-a456-426614174000",
    "appointment_date": "2026-01-15T10:00:00Z",
    "status": "pending",
    "created_at": "2026-01-02T05:55:58.906Z"
  }
}
```

---

### PUT /customer/assign-appointments

**Description:** Assign appointments to barbers

**Authentication:** Required

**Defined In:** `user/customer.route.ts`

**Request Body:**

```typescript
{
  id: string;
  barberId: string;
  extra_duration?: number;
}
```

**Fields:**

- `id` (string) (required) - Appointment ID
- `barberId` (string) (required) - Barber ID
- `extra_duration` (number) (optional) - Extra duration in minutes

**Example Request Body:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "barberId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Example Response:**

```json
{
  "success": true,
  "message": "Appointments accepted",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "barber_id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "accepted"
  }
}
```

---

### PUT /customer/change-appointment-status

**Description:** Change appointment status

**Authentication:** Required

**Defined In:** `user/customer.route.ts`

**Request Body:**

```typescript
{
  id: string;
  status: string;
  remark?: string;
}
```

**Fields:**

- `id` (string) (required) - Appointment ID
- `status` (enum) (required) - Status (pending, accepted, in-progress, completed, rejected, cancelled)
- `remark` (string) (optional) - Remark (required if status is rejected or cancelled)

**Example Request Body:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "accepted",
  "remark": "Customer requested cancellation"
}
```

**Example Response:**

```json
{
  "success": true,
  "message": "Appointment status changed to accepted",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "accepted"
  }
}
```

---

## Vendor Routes (9)

### GET /vendor/get-shop-profile

**Description:** Get shop profile

**Authentication:** Required

**Defined In:** `vendor/shop.route.ts`

**Example Response:**

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "user@example.com",
    "mobile": "9876543210",
    "role": "customer"
  }
}
```

---

### GET /vendor/services

**Description:** Get all services

**Authentication:** Required

**Defined In:** `vendor/shop.route.ts`

**Example Response:**

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Haircut",
      "price": 500,
      "duration": 30
    }
  ]
}
```

---

### POST /vendor/create-service

**Description:** Create a new service

**Authentication:** Required

**Defined In:** `vendor/shop.route.ts`

**Request Body:**

```typescript
{
  name: string;
  shop_id: string;
  description?: string;
  duration: number;
  price: number;
  discounted_price?: number;
  gender: string;
  category: string;
  is_active?: boolean;
  image_url?: string;
}
```

**Fields:**

- `name` (string) (required) - Service name
- `shop_id` (string) (required) - Shop ID
- `description` (string) (optional) - Service description
- `duration` (number) (required) - Duration in minutes
- `price` (number) (required) - Service price
- `discounted_price` (number) (optional) - Discounted price
- `gender` (enum) (required) - Gender (male, female, unisex, others)
- `category` (string) (required) - Service category
- `is_active` (boolean) (optional) - Service active status
- `image_url` (string) (optional) - Service image URL

**Example Request Body:**

```json
{
  "name": "Haircut",
  "shop_id": "123e4567-e89b-12d3-a456-426614174000",
  "description": "Professional haircut service",
  "duration": 30,
  "price": 500,
  "discounted_price": 450,
  "gender": "male",
  "category": "Hair Services",
  "is_active": true
}
```

**Example Response:**

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "success"
  }
}
```

---

### POST /vendor/save-shop-bank

**Description:** Save shop bank details

**Authentication:** Required

**Defined In:** `vendor/shop.route.ts`

**Request Body:**

```typescript
{
  shop_id: string;
  user_id: string;
  bank_name?: string;
  account_number?: string;
  ifsc_code?: string;
  account_holder_name?: string;
}
```

**Fields:**

- `shop_id` (string) (required) - Shop ID
- `user_id` (string) (required) - User ID
- `bank_name` (string) (optional) - Bank name
- `account_number` (string) (optional) - Account number
- `ifsc_code` (string) (optional) - IFSC code
- `account_holder_name` (string) (optional) - Account holder name

**Example Request Body:**

```json
{
  "shop_id": "123e4567-e89b-12d3-a456-426614174000",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "bank_name": "State Bank of India",
  "account_number": "1234567890",
  "ifsc_code": "SBIN0001234",
  "account_holder_name": "John Doe"
}
```

**Example Response:**

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "success"
  }
}
```

---

### POST /vendor/save-shop-details

**Description:** Save shop details

**Authentication:** Required

**Defined In:** `vendor/shop.route.ts`

**Request Body:**

```typescript
{
  user_id: string;
  shop_name: string;
  shop_logo_url?: string;
  shop_banner_url?: string;
  gstin_number?: string;
  email: string;
  mobile: string;
  shop_open_time?: string;
  shop_close_time?: string;
  weekly_holiday?: string;
  services?: Array<any>;
}
```

**Fields:**

- `user_id` (string) (required) - User ID
- `shop_name` (string) (required) - Shop name
- `shop_logo_url` (string) (optional) - Shop logo URL
- `shop_banner_url` (string) (optional) - Shop banner URL
- `gstin_number` (string) (optional) - GSTIN number (15 characters)
- `email` (string) (required) - Shop email
- `mobile` (string) (required) - 10 digit mobile number
- `shop_open_time` (string) (optional) - Shop opening time
- `shop_close_time` (string) (optional) - Shop closing time
- `weekly_holiday` (string) (optional) - Weekly holiday
- `services` (array) (optional) - Array of service IDs

**Example Request Body:**

```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "shop_name": "My Barber Shop",
  "shop_logo_url": "https://example.com/logo.jpg",
  "shop_banner_url": "https://example.com/banner.jpg",
  "gstin_number": "29ABCDE1234F1Z5",
  "email": "shop@example.com",
  "mobile": "9876543210",
  "shop_open_time": "09:00",
  "shop_close_time": "21:00",
  "weekly_holiday": "Sunday",
  "services": []
}
```

**Example Response:**

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "success"
  }
}
```

---

### POST /vendor/save-shop-kyc

**Description:** Save shop KYC details

**Authentication:** Required

**Defined In:** `vendor/shop.route.ts`

**Request Body:**

```typescript
{
  shop_id: string;
  user_id: string;
  aadhar_number?: string;
  pan_number?: string;
  aadhar_front?: string;
  aadhar_back?: string;
  pan_card?: string;
  shop_license?: string;
}
```

**Fields:**

- `shop_id` (string) (required) - Shop ID
- `user_id` (string) (required) - User ID
- `aadhar_number` (string) (optional) - Aadhar number
- `pan_number` (string) (optional) - PAN number
- `aadhar_front` (string) (optional) - Aadhar front image URL
- `aadhar_back` (string) (optional) - Aadhar back image URL
- `pan_card` (string) (optional) - PAN card image URL
- `shop_license` (string) (optional) - Shop license image URL

**Example Request Body:**

```json
{
  "shop_id": "123e4567-e89b-12d3-a456-426614174000",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "pan_number": "ABCDE1234F",
  "aadhar_back": "https://example.com/aadhar-back.jpg",
  "pan_card": "https://example.com/pan.jpg",
  "shop_license": "https://example.com/license.jpg"
}
```

**Example Response:**

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "success"
  }
}
```

---

### POST /vendor/save-shop-location

**Description:** Save shop location

**Authentication:** Required

**Defined In:** `vendor/shop.route.ts`

**Request Body:**

```typescript
{
  user_id: string;
  shop_id: string;
  address_line1: string;
  address_line2?: string;
  area: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
}
```

**Fields:**

- `user_id` (string) (required) - User ID
- `shop_id` (string) (required) - Shop ID
- `address_line1` (string) (required) - Address line 1
- `address_line2` (string) (optional) - Address line 2
- `area` (string) (required) - Area
- `city` (string) (required) - City
- `state` (string) (required) - State
- `country` (string) (required) - Country
- `pincode` (string) (required) - 6 digit pincode
- `latitude` (number) (optional) - Latitude
- `longitude` (number) (optional) - Longitude

**Example Request Body:**

```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "shop_id": "123e4567-e89b-12d3-a456-426614174000",
  "address_line1": "123 Main Street",
  "address_line2": "Apt 4B",
  "area": "Downtown",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "pincode": "10001",
  "latitude": 28.6139,
  "longitude": 77.209
}
```

**Example Response:**

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "success"
  }
}
```

---

### PUT /vendor/add-services

**Description:** Add services to shop

**Authentication:** Required

**Defined In:** `vendor/shop.route.ts`

**Request Body:**

```typescript
{
  shop_id: string;
  services: Array<any>;
}
```

**Fields:**

- `shop_id` (string) (required) - Shop ID
- `services` (array) (required) - Array of service IDs

**Example Request Body:**

```json
{
  "shop_id": "123e4567-e89b-12d3-a456-426614174000",
  "services": [
    "123e4567-e89b-12d3-a456-426614174000"
  ]
}
```

**Example Response:**

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "success"
  }
}
```

---

### PUT /vendor/update-service

**Description:** Update service details

**Authentication:** Required

**Defined In:** `vendor/shop.route.ts`

**Request Body:**

```typescript
{
  id: string;
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
  discounted_price?: number;
  gender?: string;
  category?: string;
  is_active?: boolean;
  image_url?: string;
}
```

**Fields:**

- `id` (string) (required) - Service ID
- `name` (string) (optional) - Service name
- `description` (string) (optional) - Service description
- `duration` (number) (optional) - Duration in minutes
- `price` (number) (optional) - Service price
- `discounted_price` (number) (optional) - Discounted price
- `gender` (enum) (optional) - Gender (male, female, unisex, others)
- `category` (string) (optional) - Service category
- `is_active` (boolean) (optional) - Service active status
- `image_url` (string) (optional) - Service image URL

**Example Request Body:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Haircut",
  "duration": 30,
  "price": 500,
  "discounted_price": 450,
  "category": "Hair Services",
  "is_active": true,
  "image_url": "https://example.com/service.jpg"
}
```

**Example Response:**

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "success"
  }
}
```

---

## Barber Routes (7)

### GET /barber/barber-profile

**Description:** Get barber profile

**Authentication:** Required

**Defined In:** `vendor/barber.route.ts`

**Example Response:**

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "user@example.com",
    "mobile": "9876543210",
    "role": "customer"
  }
}
```

---

### GET /barber/barbers-appointments

**Description:** Get all customer appointments

**Authentication:** Required

**Defined In:** `vendor/barber.route.ts`

**Query Parameters:**

- `user_id` (string, optional) - Filter by user ID
- `shop_id` (string, optional) - Filter by shop ID
- `barber_id` (string, optional) - Filter by barber ID
- `status` (enum, optional) - Filter by appointment status

**Example Response:**

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "customer_id": "123e4567-e89b-12d3-a456-426614174000",
      "shop_id": "123e4567-e89b-12d3-a456-426614174000",
      "appointment_date": "2026-01-15T10:00:00Z",
      "status": "pending"
    }
  ]
}
```

---

### GET /barber/barbers/:id

**Description:** Get all barbers of a shop

**Authentication:** Required

**Defined In:** `vendor/barber.route.ts`

**Path Parameters:**

- `id` (string, required) - Shop ID

**Query Parameters:**

- `available` (boolean) (optional) - Filter by availability

**Example Response:**

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "John Barber",
      "available": true
    }
  ]
}
```

---

### POST /barber/create-barber

**Description:** Create a new barber

**Authentication:** Required

**Defined In:** `vendor/barber.route.ts`

**Request Body:**

```typescript
{
  user_id: string;
  shop_id: string;
  name: string;
  email?: string;
  mobile: string;
  age?: number;
  gender: string;
  specialist_in?: Array<any>;
  status?: string;
}
```

**Fields:**

- `user_id` (string) (required) - User ID
- `shop_id` (string) (required) - Shop ID
- `name` (string) (required) - Barber name
- `email` (string) (optional) - Barber email
- `mobile` (string) (required) - 10 digit mobile number
- `age` (number) (optional) - Barber age
- `gender` (enum) (required) - Gender (male, female, unisex, others)
- `specialist_in` (array) (optional) - Specializations
- `status` (enum) (optional) - Status (active, inactive, deleted)

**Example Request Body:**

```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "shop_id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "John Barber",
  "mobile": "9876543210",
  "age": 25,
  "gender": "male",
  "specialist_in": [
    "Haircut",
    "Beard Trim"
  ],
  "status": "active"
}
```

**Example Response:**

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "success"
  }
}
```

---

### POST /barber/login

**Description:** POST /barber/login

**Authentication:** Not Required

**Defined In:** `vendor/barber.route.ts`

**Request Body:**

```typescript
{
  username: string;
  login_pin: number;
}
```

**Fields:**

- `username` (string) (required) - Barber username
- `login_pin` (number) (required) - Barber login PIN

**Example Request Body:**

```json
{
  "username": "barber123",
  "login_pin": 1234
}
```

**Example Response:**

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "success"
  }
}
```

---

### PUT /barber/availability

**Description:** Toggle barber availability

**Authentication:** Required

**Defined In:** `vendor/barber.route.ts`

**Request Body:**

```typescript
{
  id: string;
  available: boolean;
}
```

**Fields:**

- `id` (string) (required) - Barber ID
- `available` (boolean) (required) - Availability status

**Example Request Body:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "available": true
}
```

**Example Response:**

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "success"
  }
}
```

---

### PUT /barber/update-barber

**Description:** Update barber details

**Authentication:** Required

**Defined In:** `vendor/barber.route.ts`

**Request Body:**

```typescript
{
  id: string;
  user_id?: string;
  shop_id?: string;
  name?: string;
  email?: string;
  mobile?: string;
  age?: number;
  gender?: string;
  specialist_in?: Array<any>;
  status?: string;
}
```

**Fields:**

- `id` (string) (required) - Barber ID
- `user_id` (string) (optional) - User ID
- `shop_id` (string) (optional) - Shop ID
- `name` (string) (optional) - Barber name
- `email` (string) (optional) - Barber email
- `mobile` (string) (optional) - 10 digit mobile number
- `age` (number) (optional) - Barber age
- `gender` (enum) (optional) - Gender (male, female, unisex, others)
- `specialist_in` (array) (optional) - Specializations
- `status` (enum) (optional) - Status (active, inactive, deleted)

**Example Request Body:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "barber@example.com",
  "mobile": "9876543210",
  "age": 25,
  "gender": "male",
  "specialist_in": [
    "Haircut",
    "Beard Trim"
  ]
}
```

**Example Response:**

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "success"
  }
}
```

---

## Common Routes (5)

### GET /common/device-info

**Description:** Get device information

**Authentication:** Required

**Defined In:** `common/common.route.ts`

**Example Response:**

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": {}
}
```

---

### GET /common/fcm-token

**Description:** Save FCM token for push notifications

**Authentication:** Required

**Defined In:** `common/common.route.ts`

**Example Response:**

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": {}
}
```

---

### POST /common/save-token

**Description:** Save FCM token for push notifications

**Authentication:** Required

**Defined In:** `common/common.route.ts`

**Request Body:**

```typescript
{
  user_id: string;
  device_id: string;
  token: object;
}
```

**Fields:**

- `user_id` (string) (required) - User ID
- `device_id` (string) (required) - Device ID
- `token` (object) (required) - FCM token object

**Example Request Body:**

```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "device_id": "123e4567-e89b-12d3-a456-426614174000",
  "token": {
    "type": "fcm",
    "token": "fcm_token_string_here"
  }
}
```

**Example Response:**

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "success"
  }
}
```

---

### POST /common/upload-media

**Description:** Upload media file

**Authentication:** Required

**Defined In:** `common/common.route.ts`

**Request Body:** Based on route requirements

**Example Response:**

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "success"
  }
}
```

---

### PUT /common/update-device-info

**Description:** Update device information

**Authentication:** Required

**Defined In:** `common/common.route.ts`

**Request Body:**

```typescript
{
  device_id?: string;
  device_type?: string;
  device_model?: string;
  os_version?: string;
  app_version?: string;
  user_id?: string;
}
```

**Fields:**

- `device_id` (string) (optional) - Device ID
- `device_type` (string) (optional) - Device type
- `device_model` (string) (optional) - Device model
- `os_version` (string) (optional) - OS version
- `app_version` (string) (optional) - App version
- `user_id` (string) (optional) - User ID

**Example Request Body:**

```json
{
  "device_id": "123e4567-e89b-12d3-a456-426614174000",
  "device_type": "mobile",
  "os_version": "iOS 15.0",
  "app_version": "1.0.0",
  "user_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Example Response:**

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "success"
  }
}
```

---

## Health Routes (1)

### GET /api

**Description:** Check if server is running

**Authentication:** Not Required

**Defined In:** `app.ts`

**Example Response:**

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": {}
}
```

---


## 📝 Notes

- All routes use JSON for request/response bodies
- Authentication is done via Bearer token: `Authorization: Bearer <token>`
- Base URL: `http://localhost:3036` (development) or your production domain
- For detailed request/response examples, see Postman collection
- All UUID fields should be valid UUID v4 format
- Date fields should be in ISO 8601 format (e.g., 2026-01-15T10:00:00Z)

**Generated:** 1/2/2026, 11:25:58 AM
