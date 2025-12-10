# 📋 Complete Table of Contents

**Saloon Booking System API** | 36 Routes | 6 Flowcharts

---

## 📑 Navigation Files

| File | Purpose |
|------|---------|
| [README.md](./README.md) | Main hub with role-based quick links |
| [QUICK_START.md](./QUICK_START.md) | 5-minute intro, core concepts, common tasks |
| [TABLE_OF_CONTENTS.md](./TABLE_OF_CONTENTS.md) | This file - complete index |

---

## 🗂️ Documentation Folders

### 01-API-Reference
**[API_DOCUMENTATION.md](./01-API-Reference/API_DOCUMENTATION.md)**
- All 36 endpoints documented
- Request/response examples
- Validation rules & error codes
- Enum values reference

**36 Routes:**
- Auth: 4 (send-otp, verify-otp, logout, new-access-token)
- Customer: 5 (near-by-shops, book, assign, get, change-status)
- Barber: 7 (login, profile, appointments, create, update, list, availability)
- Shop: 7 (details, location, kyc, bank, profile, service-create, service-list)
- User: 9 (save, update, location, profile, status, get-status, genders, roles, check)
- Common: 4 (device-info x2, fcm-token x2)

---

### 02-Routes-Guide
**[COMPLETE_ROUTES_DOCUMENTATION.md](./02-Routes-Guide/COMPLETE_ROUTES_DOCUMENTATION.md)**
- Detailed route breakdown by category
- Business logic explanations
- Service layer integration
- Data flow diagrams
- Authentication flows

---

### 03-Flowcharts
**Files:**
- [FLOWCHART_GUIDE.md](./03-Flowcharts/FLOWCHART_GUIDE.md) - How to read flowcharts
- [FLOWCHART_INDEX.md](./03-Flowcharts/FLOWCHART_INDEX.md) - Flowchart index & coverage

**6 Mermaid Diagrams:**
- flowchart-auth.mmd (4 endpoints)
- flowchart-customer.mmd (5 endpoints)
- flowchart-barber.mmd (7 endpoints)
- flowchart-shop.mmd (7 endpoints)
- flowchart-user.mmd (9 endpoints)
- flowchart-common.mmd (4 endpoints)

---

### 04-Integration-Examples
Ready for: Authentication flows, Appointment booking, Shop setup, Error handling

---

### 05-Data-Models
Ready for: Data structures, Enums, Validation rules

---

### 06-Best-Practices
Ready for: Security, Performance, Design patterns

---

## 🔍 Quick Search

### By Endpoint Type
- **Auth Routes** → [API_DOCUMENTATION.md#1-authentication-routes](./01-API-Reference/API_DOCUMENTATION.md)
- **Customer Routes** → [API_DOCUMENTATION.md#2-customer-routes](./01-API-Reference/API_DOCUMENTATION.md)
- **Barber Routes** → [API_DOCUMENTATION.md#3-barber-routes](./01-API-Reference/API_DOCUMENTATION.md)
- **Shop Routes** → [API_DOCUMENTATION.md#4-shop-routes](./01-API-Reference/API_DOCUMENTATION.md)
- **User Routes** → [API_DOCUMENTATION.md#5-user-routes](./01-API-Reference/API_DOCUMENTATION.md)
- **Common Routes** → [API_DOCUMENTATION.md#6-common-routes](./01-API-Reference/API_DOCUMENTATION.md)

### By Role
- **Frontend Dev** → Start: [API_DOCUMENTATION.md](./01-API-Reference/API_DOCUMENTATION.md)
- **Backend Dev** → Start: [COMPLETE_ROUTES_DOCUMENTATION.md](./02-Routes-Guide/COMPLETE_ROUTES_DOCUMENTATION.md)
- **QA Engineer** → Use flowcharts & examples
- **New Developer** → Start: [QUICK_START.md](./QUICK_START.md)

---

## 📊 Statistics

| Metric | Count |
|--------|-------|
| Total Routes | 36 |
| HTTP GET | 13 |
| HTTP POST | 23 |
| Flowcharts | 6 |
| Documentation Files | 5 |

---

## 🚀 Start Here

**First time?** → [QUICK_START.md](./QUICK_START.md)  
**API dev?** → [API_DOCUMENTATION.md](./01-API-Reference/API_DOCUMENTATION.md)  
**System understanding?** → [FLOWCHART_GUIDE.md](./03-Flowcharts/FLOWCHART_GUIDE.md)  
**Need everything?** → This file!
