# API Documentation - Auto-Generated

**Last Updated:** 12/10/2025, 12:12:25 PM  
**Total Routes:** 40

---

## 📚 Routes by Category

| Category | Routes | Methods |
|----------|--------|----------|
| common | 8 | 2 |
| user | 18 | 2 |
| vendor | 14 | 2 |

---

## COMMON Routes (8)

### POST /common/send-otp
- **File:** `common/auth.route.ts`
- **Method:** POST
- **Endpoint:** `/common/send-otp`

### POST /common/verify-otp
- **File:** `common/auth.route.ts`
- **Method:** POST
- **Endpoint:** `/common/verify-otp`

### POST /common/logout
- **File:** `common/auth.route.ts`
- **Method:** POST
- **Endpoint:** `/common/logout`

### POST /common/new-access-token
- **File:** `common/auth.route.ts`
- **Method:** POST
- **Endpoint:** `/common/new-access-token`

### POST /common/update-device-info
- **File:** `common/common.route.ts`
- **Method:** POST
- **Endpoint:** `/common/update-device-info`

### GET /common/device-info
- **File:** `common/common.route.ts`
- **Method:** GET
- **Endpoint:** `/common/device-info`

### POST /common/save-token
- **File:** `common/common.route.ts`
- **Method:** POST
- **Endpoint:** `/common/save-token`

### GET /common/fcm-token
- **File:** `common/common.route.ts`
- **Method:** GET
- **Endpoint:** `/common/fcm-token`

## USER Routes (18)

### GET /user/near-by-shops
- **File:** `user/cutomer.route.ts`
- **Method:** GET
- **Endpoint:** `/user/near-by-shops`

### POST /user/book-appointment
- **File:** `user/cutomer.route.ts`
- **Method:** POST
- **Endpoint:** `/user/book-appointment`

### POST /user/assign-appointments
- **File:** `user/cutomer.route.ts`
- **Method:** POST
- **Endpoint:** `/user/assign-appointments`

### GET /user/appointments
- **File:** `user/cutomer.route.ts`
- **Method:** GET
- **Endpoint:** `/user/appointments`

### POST /user/change-appointment-status
- **File:** `user/cutomer.route.ts`
- **Method:** POST
- **Endpoint:** `/user/change-appointment-status`

### GET /user/payment-modes
- **File:** `user/cutomer.route.ts`
- **Method:** GET
- **Endpoint:** `/user/payment-modes`

### GET /user/appointment-statuses
- **File:** `user/cutomer.route.ts`
- **Method:** GET
- **Endpoint:** `/user/appointment-statuses`

### POST /user/add-services
- **File:** `user/saloon.route.ts`
- **Method:** POST
- **Endpoint:** `/user/add-services`

### POST /user/update-service
- **File:** `user/saloon.route.ts`
- **Method:** POST
- **Endpoint:** `/user/update-service`

### POST /user/save-profile
- **File:** `user/user.route.ts`
- **Method:** POST
- **Endpoint:** `/user/save-profile`

### POST /user/update-profile
- **File:** `user/user.route.ts`
- **Method:** POST
- **Endpoint:** `/user/update-profile`

### POST /user/update-location
- **File:** `user/user.route.ts`
- **Method:** POST
- **Endpoint:** `/user/update-location`

### GET /user/user-profile
- **File:** `user/user.route.ts`
- **Method:** GET
- **Endpoint:** `/user/user-profile`

### POST /user/update-status
- **File:** `user/user.route.ts`
- **Method:** POST
- **Endpoint:** `/user/update-status`

### GET /user/get-status
- **File:** `user/user.route.ts`
- **Method:** GET
- **Endpoint:** `/user/get-status`

### GET /user/get-genders
- **File:** `user/user.route.ts`
- **Method:** GET
- **Endpoint:** `/user/get-genders`

### GET /user/roles
- **File:** `user/user.route.ts`
- **Method:** GET
- **Endpoint:** `/user/roles`

### GET /user/check-profile
- **File:** `user/user.route.ts`
- **Method:** GET
- **Endpoint:** `/user/check-profile`

## VENDOR Routes (14)

### POST /vendor/login
- **File:** `vendor/barbar.route.ts`
- **Method:** POST
- **Endpoint:** `/vendor/login`

### GET /vendor/barber-profile
- **File:** `vendor/barbar.route.ts`
- **Method:** GET
- **Endpoint:** `/vendor/barber-profile`

### GET /vendor/barbers-appointments
- **File:** `vendor/barbar.route.ts`
- **Method:** GET
- **Endpoint:** `/vendor/barbers-appointments`

### POST /vendor/create-barber
- **File:** `vendor/barbar.route.ts`
- **Method:** POST
- **Endpoint:** `/vendor/create-barber`

### POST /vendor/update-barber
- **File:** `vendor/barbar.route.ts`
- **Method:** POST
- **Endpoint:** `/vendor/update-barber`

### GET /vendor/barbers/:id
- **File:** `vendor/barbar.route.ts`
- **Method:** GET
- **Endpoint:** `/vendor/barbers/:id`

### POST /vendor/availability
- **File:** `vendor/barbar.route.ts`
- **Method:** POST
- **Endpoint:** `/vendor/availability`

### POST /vendor/save-shop-details
- **File:** `vendor/shop.route.ts`
- **Method:** POST
- **Endpoint:** `/vendor/save-shop-details`

### POST /vendor/save-shop-location
- **File:** `vendor/shop.route.ts`
- **Method:** POST
- **Endpoint:** `/vendor/save-shop-location`

### POST /vendor/save-shop-kyc
- **File:** `vendor/shop.route.ts`
- **Method:** POST
- **Endpoint:** `/vendor/save-shop-kyc`

### POST /vendor/save-shop-bank
- **File:** `vendor/shop.route.ts`
- **Method:** POST
- **Endpoint:** `/vendor/save-shop-bank`

### GET /vendor/get-shop-profile
- **File:** `vendor/shop.route.ts`
- **Method:** GET
- **Endpoint:** `/vendor/get-shop-profile`

### POST /vendor/create-service
- **File:** `vendor/shop.route.ts`
- **Method:** POST
- **Endpoint:** `/vendor/create-service`

### GET /vendor/services
- **File:** `vendor/shop.route.ts`
- **Method:** GET
- **Endpoint:** `/vendor/services`


---

## Summary

- Total endpoints: **40**
- Categories: **3**
- Generated: **12/10/2025, 12:12:25 PM**
