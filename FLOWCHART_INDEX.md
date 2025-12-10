# 📊 Flowchart Index & Summary

## 🎯 Overview

This document indexes all flowcharts created for the Saloon Booking System API. Each flowchart provides a visual representation of routes, parameters, and data flow.

---

## 📑 All Flowcharts Created

### 1. **Authentication Routes Flowchart**
**File:** Displayed in Mermaid format
**Coverage:**
- ✅ POST /send-otp
- ✅ POST /verify-otp
- ✅ POST /logout (Auth Required)
- ✅ POST /new-access-token

**Details Shown:**
- 📥 Request body parameters
- ✅ Validation rules
- 🔄 Service calls
- 📤 Response structure

**Key Features:**
- Clear token generation flow
- OTP verification process
- Token refresh mechanism
- Logout handling

---

### 2. **Customer Routes Flowchart**
**File:** Displayed in Mermaid format
**Coverage:**
- ✅ GET /near-by-shops
- ✅ POST /book-appointment
- ✅ POST /assign-appointments
- ✅ GET /appointments
- ✅ POST /change-appointment-status

**Details Shown:**
- 📥 Complex request body parameters
- 📍 Location-based queries
- ✅ Smart shop selection logic
- 🔄 Service layer integration
- 📤 Detailed response objects with nested data

**Key Features:**
- Distance calculation visualization
- Appointment lifecycle
- Smart barber assignment logic
- Status transition rules
- Payment calculations on completion

---

### 3. **Barber Routes Flowchart**
**File:** Displayed in Mermaid format
**Coverage:**
- ✅ POST /login (No Auth)
- ✅ GET /barber-profile (Barber Auth)
- ✅ GET /barbers-appointments (Barber Auth)
- ✅ POST /create-barber
- ✅ POST /update-barber
- ✅ GET /barbers/:id
- ✅ POST /availability

**Details Shown:**
- 📥 Credential validation
- 🔐 Different auth types (Barber vs Shop Owner)
- ✅ Schema validation for creation/updates
- 📤 Individual barber details
- 📊 Availability toggle mechanism

**Key Features:**
- Barber login without general auth
- Role-based access (Barber Auth vs Regular Auth)
- Shop-specific barber management
- Availability status control

---

### 4. **Shop Routes Flowchart**
**File:** Displayed in Mermaid format
**Coverage:**
- ✅ POST /save-shop-details
- ✅ POST /save-shop-location
- ✅ POST /save-shop-kyc
- ✅ POST /save-shop-bank
- ✅ GET /get-shop-profile
- ✅ POST /create-service
- ✅ GET /services

**Details Shown:**
- 📥 Multi-step shop registration
- 📍 Geolocation storage
- 📋 KYC document handling
- 💳 Bank account details
- 🛍️ Service management
- 📤 Complete profile aggregation

**Key Features:**
- Multi-part shop setup process
- Location-based queries
- KYC compliance tracking
- Service pricing and discounts
- Complete shop profile assembly

---

### 5. **User Routes Flowchart**
**File:** Displayed in Mermaid format
**Coverage:**
- ✅ POST /save-profile
- ✅ POST /update-profile
- ✅ POST /update-location
- ✅ GET /user-profile
- ✅ POST /update-status
- ✅ GET /get-status
- ✅ GET /get-genders
- ✅ GET /roles
- ✅ GET /check-profile

**Details Shown:**
- 👤 Profile creation and updates
- 📍 Location tracking
- ✅ Status management
- 📋 Reference data (statuses, genders, roles)
- 📊 Profile completion tracking

**Key Features:**
- Comprehensive user profile management
- Location updates for appointments
- Status tracking and changes
- Profile completion percentage
- Missing fields identification

---

### 6. **Common Routes Flowchart**
**File:** Displayed in Mermaid format
**Coverage:**
- ✅ POST /update-device-info
- ✅ GET /device-info
- ✅ POST /save-token
- ✅ GET /fcm-token

**Details Shown:**
- 📱 Device information handling
- 🔔 FCM token management
- 📥 Device metadata storage
- 📤 Token retrieval for push notifications

**Key Features:**
- Device registration for multi-device support
- FCM token management for push notifications
- OS type tracking (iOS, Android, Web)
- Device-specific information storage

---

## 📊 Flowchart Visual Elements

### Color Coding
- 🔵 **Light Blue** - Start/Entry points
- 🟢 **Light Green** - Data fetch operations
- 🟡 **Light Yellow** - Create operations
- 🟠 **Light Orange** - Query/List operations
- 🟣 **Light Purple** - Update operations
- 🔴 **Light Red** - Status change operations

### Symbols Used
- 📥 REQUEST - Input data (body, params, headers)
- ✅ VALIDATION - Input validation rules
- 🔄 SERVICE - Business logic calls
- 📤 RESPONSE - Output data structure
- 🔐 MIDDLEWARE - Authentication/Authorization
- 🎯 DECISION - Conditional logic
- 💾 DATABASE - Data persistence

---

## 🔗 Related Documentation Files

### 1. **API_DOCUMENTATION.md**
- Complete route endpoint documentation
- Request/response examples
- Validation rules for each field
- Error handling
- Enum value references
- Authentication flow details

**Best for:** Detailed API reference, integration examples

---

### 2. **FLOWCHART_GUIDE.md**
- Flowchart explanations
- Data model overviews
- Business logic walkthrough
- Integration points
- Usage tips and best practices
- Performance considerations
- Security guidelines

**Best for:** Understanding system flow, best practices

---

### 3. **COMPLETE_ROUTES_DOCUMENTATION.md**
- Detailed route-by-route breakdown
- Service layer references
- Data flow diagrams
- Quick integration guide
- Enum value reference
- Error response formats

**Best for:** Comprehensive understanding, development reference

---

## 🎯 How to Use These Flowcharts

### For Frontend Developers
1. Check the **request body** structure in each flowchart
2. See **query parameters** needed for GET requests
3. Understand **response data** structure
4. Handle **error responses**
5. Implement **auth token** management

### For Backend Developers
1. Review **validation rules** for input
2. Check **service method** being called
3. Understand **business logic** flows
4. See **database operations** involved
5. Implement **error handling**

### For QA/Testing
1. Use request examples for test cases
2. Verify response structure
3. Test validation boundaries
4. Check error scenarios
5. Validate business logic

### For DevOps/Infrastructure
1. Understand **data flow** between services
2. Check **database** access patterns
3. Plan **scaling** for hot endpoints
4. Setup **monitoring** for critical flows
5. Configure **logging** appropriately

---

## 📈 API Coverage Summary

| Category | Routes | Status |
|----------|--------|--------|
| Authentication | 4 | ✅ Complete |
| Customer | 5 | ✅ Complete |
| Barber | 7 | ✅ Complete |
| Shop | 7 | ✅ Complete |
| User | 9 | ✅ Complete |
| Common | 4 | ✅ Complete |
| **Total** | **36 Routes** | **✅ 100% Documented** |

---

## 🔄 Request/Response Cycle

All flowcharts follow this pattern:

```
Route Definition
    ↓
Authentication Check (if required)
    ↓
Request Validation (Zod schema)
    ↓
Controller Method
    ↓
Service Layer (Business Logic)
    ↓
Database Operations (Sequelize)
    ↓
Response Formatting
    ↓
Error Handling (if any)
    ↓
JSON Response to Client
```

---

## 🎯 Key Insights from Flowcharts

### 1. **Smart Appointment System**
- Automatically finds nearby shops
- Intelligent barber assignment
- Distance-based selection
- Availability-based scheduling

### 2. **Multi-Step Shop Setup**
- Shop details → Location → KYC → Bank
- Modular approach for flexibility
- Easy profile updates

### 3. **Comprehensive User Management**
- Profile creation and updates
- Location tracking
- Status management
- Profile completion tracking

### 4. **Role-Based Access**
- Customer authentication
- Barber authentication (separate)
- Shop owner authentication
- Admin authentication (in separate routes)

### 5. **Payment Integration Ready**
- Multiple payment modes supported
- Discount calculations
- Payment status tracking
- Bank details for settlement

---

## 💡 Implementation Tips

### For Efficient API Consumption:
1. **Batch requests** where possible
2. **Cache response** data (shops, services)
3. **Implement pagination** for list endpoints
4. **Use query params** for filtering
5. **Handle token refresh** proactively

### For Performance:
1. **Index frequently queried fields**
2. **Use database transactions** for multi-step operations
3. **Implement request rate limiting**
4. **Cache location-based queries**
5. **Optimize distance calculations**

### For Security:
1. **Validate all inputs** server-side
2. **Implement CORS** properly
3. **Use HTTPS only** in production
4. **Rotate tokens** regularly
5. **Log security events**

---

## 📞 Common Integration Scenarios

### Scenario 1: Customer Books Appointment
```
1. GET /customer/near-by-shops
   → Display available shops

2. POST /customer/book-appointment
   → Create appointment (status: Pending)

3. POST /customer/assign-appointments
   → Assign barber (status: Accepted)

4. GET /customer/appointments
   → Show appointment details

5. POST /customer/change-appointment-status
   → Complete appointment (status: Completed)
```

### Scenario 2: Shop Owner Setup
```
1. POST /auth/send-otp
   → Verify phone number

2. POST /auth/verify-otp
   → Create account

3. POST /shop/save-shop-details
   → Add shop information

4. POST /shop/save-shop-location
   → Add location

5. POST /shop/save-shop-kyc
   → Upload KYC documents

6. POST /shop/save-shop-bank
   → Add bank details

7. POST /barber/create-barber
   → Add staff members

8. POST /shop/create-service
   → Add services offered
```

### Scenario 3: Barber Login & Work
```
1. POST /barber/login
   → Barber logs in

2. GET /barber/barber-profile
   → View own profile

3. GET /barber/barbers-appointments
   → View assigned appointments

4. (Customer completes appointment)

5. POST /customer/change-appointment-status
   → Status changes to Completed
   → Barber becomes available
```

---

## 🚀 Next Steps

1. **Review flowcharts** for your area of responsibility
2. **Read detailed documentation** in API_DOCUMENTATION.md
3. **Check COMPLETE_ROUTES_DOCUMENTATION.md** for specifics
4. **Set up Postman collection** using request examples
5. **Implement in your** frontend/backend/testing framework

---

## 📝 Document Information

- **Created:** 19 December 2024
- **Version:** 1.0.0
- **Total Routes Documented:** 36
- **Total Flowcharts:** 6
- **Documentation Files:** 4
- **Status:** ✅ Complete and Ready for Implementation

---

## 🔗 Quick Links

- **Start Here:** API_DOCUMENTATION.md
- **Flow Guide:** FLOWCHART_GUIDE.md
- **Detailed Routes:** COMPLETE_ROUTES_DOCUMENTATION.md
- **Flowchart Diagrams:** View in Mermaid format (each section)

---

**Happy Coding! 🚀**

For questions or clarifications, refer to the appropriate documentation file or the original source code files in the `src/` directory.
