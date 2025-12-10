| Category | Count | Key Routes |
|----------|-------|-----------|
| common | 8 | 2 methods |
| user | 18 | 2 methods |
| vendor | 14 | 2 methods ||-------|-----------|
| common | 8 | 2 methods |
| user | 18 | 2 methods |
| vendor | 14 | 2 methods ||-------|-----------|
|-------|-----------|
|-------|-----------|

---

## ⚡ Core Concepts

### 1. **Authentication**
```
1. User calls: POST /auth/send-otp
2. User enters OTP and calls: POST /auth/verify-otp
3. Receive: access_token (valid 1 hour) & refresh_token (valid 7 days)
4. Include token in requests: Authorization: Bearer <access_token>
5. When expired: POST /auth/new-access-token with refresh_token
```

### 2. **Appointments**
Status flow: `Pending → Accepted → InProgress → Completed`

### 3. **Smart Assignment**
- Auto-assigns best available barber to appointments
- Considers availability and skills

### 4. **Location Services**
- Uses Haversine distance calculation
- Finds nearby shops within radius

---

## 🎯 Common Tasks

### Task 1: Authenticate User
```json
POST /auth/send-otp
{ "mobile": "9876543210" }

↓ User enters OTP ↓

POST /auth/verify-otp
{ "mobile": "9876543210", "code": "123456" }

Response: { access_token, refresh_token, user_info }
```

### Task 2: Book Appointment
```json
1. GET /customer/near-by-shops
   { "latitude": 23.18, "longitude": 79.98, "radius": 5 }

2. POST /customer/book-appointment
   { customer_id, appointment_date, services[], payment_mode, ... }

3. POST /customer/assign-appointments (Optional - auto or manual)
   { id, barberId (optional) }
```

### Task 3: Setup Shop
```json
1. POST /shop/save-shop-details
2. POST /shop/save-shop-location
3. POST /shop/save-shop-kyc
4. POST /shop/save-shop-bank
5. POST /shop/create-service (Add services)
6. POST /barber/create-barber (Add staff)
```

---

## 📚 Route Summary

| Category | Count | Key Routes |
|----------|-------|-----------|
| Auth | 4 | send-otp, verify-otp, logout, new-access-token |
| Customer | 5 | near-by-shops, book-appointment, assign, get, change-status |
| Barber | 7 | login, profile, appointments, create, update, list, availability |
| Shop | 7 | details, location, kyc, bank, profile, service, list |
| User | 9 | save-profile, update, location, status, check, get-status, genders, roles |
| Common | 4 | device-info (x2), fcm-token (x2) |

---

## 🔐 Authentication Types

| Type | Used By | Method |
|------|---------|--------|
| **Public** | Everyone | No auth required |
| **Bearer Token** | Customers, Owners | `Authorization: Bearer <token>` |
| **Barber Auth** | Barbers | Special barber token |

---

## 📖 Documentation

- **[API_DOCUMENTATION.md](./01-API-Reference/API_DOCUMENTATION.md)** - All endpoints
- **[COMPLETE_ROUTES_DOCUMENTATION.md](./02-Routes-Guide/COMPLETE_ROUTES_DOCUMENTATION.md)** - Detailed routes
- **[Flowcharts](./03-Flowcharts/)** - Visual diagrams
- **[TABLE_OF_CONTENTS.md](./TABLE_OF_CONTENTS.md)** - Complete index

---

## 💻 Tech Stack

- **Node.js + Express** - Server
- **Sequelize** - ORM
- **JWT** - Authentication
- **Zod** - Validation
- **Firebase FCM** - Push notifications
- **MySQL** - Database

---

## 🚀 Next Steps

**Frontend Dev?** → [API_DOCUMENTATION.md](./01-API-Reference/API_DOCUMENTATION.md)  
**Backend Dev?** → [COMPLETE_ROUTES_DOCUMENTATION.md](./02-Routes-Guide/COMPLETE_ROUTES_DOCUMENTATION.md)  
**Need Visuals?** → [Flowcharts](./03-Flowcharts/FLOWCHART_GUIDE.md)  
**Find Anything?** → [TABLE_OF_CONTENTS.md](./TABLE_OF_CONTENTS.md)
