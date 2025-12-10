# 📊 API Flowcharts & Documentation Summary

## Overview
This document provides a comprehensive guide to all the detailed flowcharts created for the Saloon Booking System. Each flowchart includes:
- ✅ Route endpoints
- 📥 Request methods (GET, POST)
- 📋 Body parameters
- ✅ Validation rules
- 📤 Response examples
- 🔐 Authentication requirements
- 🔄 Service layer calls

---

## 📑 Table of Contents

### 1. [Authentication Routes](#1-auth-routes-flowchart)
- Send OTP
- Verify OTP
- Logout
- Generate New Access Token

### 2. [Customer Routes](#2-customer-routes-flowchart)
- Fetch Nearby Shops
- Book Appointment
- Assign Barber to Appointment
- Get All Appointments
- Change Appointment Status

### 3. [Barber Routes](#3-barber-routes-flowchart)
- Barber Login
- Get Barber Profile
- Get Barber's Appointments
- Create Barber
- Update Barber
- Get All Barbers of Shop
- Toggle Barber Availability

### 4. [Shop Routes](#4-shop-routes-flowchart)
- Save Shop Details
- Save Shop Location
- Save Shop KYC
- Save Shop Bank Details
- Get Shop Profile
- Create Service
- Get All Services

### 5. [User Routes](#5-user-routes-flowchart)
- Save Profile
- Update Profile
- Update Location
- Get User Profile
- Update Status
- Get All User Statuses
- Get All Genders
- Get All Roles
- Check Profile Completion

### 6. [Common Routes](#6-common-routes-flowchart)
- Update Device Info
- Get Device Info
- Save FCM Token
- Get FCM Token

---

## 🔑 Key Features of Flowcharts

### Request Information
Each flowchart shows:
- 📥 **REQUEST BODY** - All required and optional fields
- 📋 **QUERY PARAMS** - URL parameters
- 🛣️ **ROUTE PARAMS** - Path parameters
- 📍 **REQUEST HEADERS** - Required headers (Authorization, etc.)

### Validation Rules
- ✅ Field requirements (required/optional)
- 📏 Data type validation
- 🔢 Length/range constraints
- 📧 Format validation (email, phone, etc.)
- 🎯 Enum value validation

### Business Logic
- 🔄 Service layer calls
- ⚡ Processing steps
- 🔀 Conditional flows
- 📊 Data transformation

### Response Format
- 📤 Success response structure
- ❌ Error response format
- 💾 Data fields returned
- 📊 Related object details

### Authentication
- 🔓 Public endpoints (no auth required)
- 🔐 Protected endpoints (bearer token required)
- 👤 Role-based access (barber auth, user auth)

---

## 📋 Quick Reference Guide

### HTTP Methods Used
```
GET    - Retrieve data (appointments, profiles, shops)
POST   - Create/Update data (bookings, registrations, settings)
```

### Authentication Methods
```
🔓 Public      - No authentication required
🔐 Bearer      - Access token in Authorization header
🔐 Barber Auth - Barber-specific token
🔐 User Auth   - User/Customer token
```

### Common Response Fields
```json
{
  "success": true/false,
  "message": "Operation status",
  "data": { /* Response data */ },
  "errors": [ /* Validation errors */ ]
}
```

---

## 🎯 Appointment Flow Example

1. **Customer initiates booking:**
   - Calls `GET /customer/near-by-shops` with location
   - Receives list of nearby shops

2. **Customer books appointment:**
   - Calls `POST /customer/book-appointment`
   - System automatically finds shop & barber
   - Returns appointment in "Pending" status

3. **Shop owner assigns barber:**
   - Calls `POST /customer/assign-appointments`
   - Barber is assigned and marked unavailable
   - Appointment moves to "Accepted" status

4. **Customer/Barber updates status:**
   - `InProgress` when barber starts
   - `Completed` when service is done
   - System calculates charges and releases barber

---

## 🔐 Authentication Flow Example

```
1. User calls: POST /auth/send-otp
   ├─ Send OTP to mobile number
   
2. User enters OTP and calls: POST /auth/verify-otp
   ├─ Verify OTP code
   ├─ Create user if new
   ├─ Return: access_token, refresh_token
   
3. User uses access_token in Authorization header:
   └─ Authorization: Bearer <access_token>
   
4. When token expires:
   └─ Call: POST /auth/new-access-token
   └─ Provide: refresh_token
   └─ Receive: new access_token
```

---

## 📊 Data Models Overview

### Appointment
```
- id (UUID)
- customer_id (UUID)
- barber_id (UUID)
- shop_id (UUID)
- appointment_date (ISO String)
- expected_start_time (ISO String)
- expected_end_time (ISO String)
- status (enum)
- service_duration (number)
- extra_duration (number)
- payment_mode (enum)
- payment_status (enum)
- notes (string)
```

### Barber
```
- id (UUID)
- user_id (UUID)
- shop_id (UUID)
- name (string)
- email (string)
- mobile (10-digit string)
- gender (enum)
- specialist_in (array)
- available (boolean)
- status (enum)
```

### Shop
```
- id (UUID)
- shop_name (string)
- email (string)
- mobile (string)
- shop_open_time (time)
- shop_close_time (time)
- shop_logo_url (URL)
- location (nested object)
- kyc (nested object)
- bank_details (nested object)
```

### User/Customer
```
- id (UUID)
- first_name (string)
- last_name (string)
- email (string)
- mobile (string)
- gender (enum)
- profile_pic (URL)
- date_of_birth (date)
- status (enum)
- created_at (ISO String)
```

### Service
```
- id (UUID)
- shop_id (UUID)
- name (string)
- description (string)
- duration (minutes)
- price (number)
- discounted_price (number)
- image_url (URL)
- category (string)
```

---

## ⚡ Key Business Logic

### Smart Shop Selection (Book Appointment)
1. **If shop_id provided** → Use the specified shop
2. **Else find nearest shops** → Calculate distance using coordinates
3. **Check for available barber** → Prefer shop with available barber now
4. **Else find earliest available** → Choose shop where barber gets free earliest
5. **Create appointment** → Store with calculated duration and pricing

### Smart Barber Assignment (Assign Appointment)
1. **If barberId provided** → Assign that specific barber
2. **Else find available barber** → Search for barber with available=true
3. **Else find earliest free** → Get barber who finishes earliest
4. **Calculate times** → Based on current appointments
5. **Update status** → Change to "Accepted"

### Status Transitions (Change Appointment Status)
- **Pending** → Can move to: Accepted, Rejected, Cancelled
- **Accepted** → Can move to: InProgress, Cancelled
- **InProgress** → Can move to: Completed
- **Completed** → Final state (no changes)
- **Rejected** → Final state (no changes)
- **Cancelled** → Final state (no changes)

### Completion Logic
- When status changes to **Completed**:
  - Calculate total price from services
  - Calculate discounts
  - Set payment_status to "Success"
  - Release barber (mark available=true)
  - Record service_completed_at timestamp

---

## 🔄 Integration Points

### Service Layer Calls
Each endpoint calls corresponding service methods:

```
Route → Controller → Service → Model → Database
```

**Example:**
```
POST /customer/book-appointment
  ↓
CustomerController.bookAppointment()
  ↓
CustomerService.createAppointment()
  ↓
Appointment.create(), AppointmentService.create()
  ↓
Database
```

---

## 📱 Device & Push Notification Setup

### Device Registration
1. User installs app on device
2. App sends device info via `POST /common/update-device-info`
3. App gets FCM token from Firebase
4. App saves token via `POST /common/save-token`

### Push Notifications
- Server can query user's FCM token
- Send notifications for:
  - Appointment reminders
  - Barber updates
  - Payment confirmations
  - Status changes

---

## 🎯 Role-Based Access

### Customer
- Can book appointments
- Can view own appointments
- Can change appointment status
- Can update profile and location
- Cannot access barber/shop management

### Barber
- Can login with credentials
- Can view own profile
- Can view own appointments
- Cannot create/manage other barbers
- Cannot manage shop settings

### Shop Owner
- Can create/update barbers
- Can manage services
- Can upload KYC and bank details
- Can view shop appointments
- Can manage shop profile

### Admin
- Can manage all users
- Can manage all shops
- Can generate reports
- (Admin routes not shown in flowcharts)

---

## 📝 Validation Rules Summary

### Mobile Number
- Format: 10 digits
- Pattern: `/^[0-9]{10}$/`

### Email
- Standard email format
- Pattern: Valid email regex

### UUID Fields
- Must be valid UUID format
- Example: `550e8400-e29b-41d4-a716-446655440000`

### Coordinates
- Latitude: -90 to 90
- Longitude: -180 to 180
- Numbers with decimals

### Enums
- Must match predefined values
- Case-sensitive
- No partial matches

### Dates
- ISO 8601 format: `2024-12-20T14:00:00Z`
- Must be valid date
- Can be future or past

---

## 🚀 Error Handling

### Validation Errors
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "mobile",
      "message": "Mobile number must be 10 digits"
    }
  ]
}
```

### Business Logic Errors
```json
{
  "success": false,
  "message": "No nearby shops found",
  "errors": []
}
```

### Authentication Errors
```json
{
  "success": false,
  "message": "Unauthorized - Invalid token",
  "errors": []
}
```

---

## 📚 Additional Resources

- **Full API Documentation:** `API_DOCUMENTATION.md`
- **Database Schema:** `models/` folder
- **Validation Schemas:** `schema/` folder
- **Service Logic:** `service/` folder
- **Route Definitions:** `routes/` folder

---

## 🔄 Request/Response Cycle

```
Client Request
    ↓
Express Route Handler
    ↓
Controller Method
    ↓
Input Validation (Zod Schema)
    ↓
Middleware Check (Auth)
    ↓
Service Method
    ↓
Database Query
    ↓
Response Formatting
    ↓
ApiResponse.success() or ApiResponse.error()
    ↓
Client Response (JSON)
```

---

## 📊 Common Query Parameters

### Pagination (if implemented)
```
?page=1&limit=20&sort=created_at&order=desc
```

### Filtering
```
?status=active&gender=male&available=true
```

### Searching
```
?search=shop_name&category=haircut
```

---

## 🎯 Usage Tips

1. **Always include Content-Type header:**
   ```
   Content-Type: application/json
   ```

2. **Use proper HTTP methods:**
   - GET for retrieving data
   - POST for creating/updating data

3. **Handle errors gracefully:**
   - Check `success` field
   - Log error messages
   - Show user-friendly error

4. **Store tokens securely:**
   - Save refresh_token in secure storage
   - Never expose tokens in logs
   - Clear tokens on logout

5. **Implement retry logic:**
   - Retry failed requests with exponential backoff
   - Handle network timeouts
   - Implement request timeout (30s)

---

## 📈 Performance Considerations

### Optimize Location Queries
- Cache nearby shops results
- Use geospatial indexes in database
- Limit radius parameter (max 50km)

### Optimize Appointment Queries
- Use pagination for large result sets
- Filter by date range when possible
- Index status and barber_id columns

### Cache Frequently Accessed Data
- Services list (updated rarely)
- Shop details
- User roles and statuses

---

## 🔐 Security Best Practices

1. **Validate all inputs** - Never trust client data
2. **Use HTTPS only** - Encrypt data in transit
3. **Implement rate limiting** - Prevent abuse
4. **Sanitize outputs** - Prevent XSS attacks
5. **Store secrets securely** - Use environment variables
6. **Implement CORS properly** - Allow only trusted origins
7. **Rotate tokens** - Implement token refresh
8. **Log security events** - Monitor for suspicious activity

---

## 📞 Support & Contributions

For issues or improvements:
1. Review the flowcharts for endpoint details
2. Check validation rules in schema files
3. Test with provided request examples
4. Refer to service layer for business logic

**Last Updated:** 19 December 2024
**Documentation Version:** 1.0.0
**API Version:** 1.0.0
