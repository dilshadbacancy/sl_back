# Data Models

Complete reference for database models, schemas, and relationships.

---

## 1. User Model

**Table:** `users`

```typescript
{
  id: string (UUID, Primary Key)
  mobile: string (Unique, Required)
  email: string (Optional)
  first_name: string (Optional)
  last_name: string (Optional)
  profile_image: string (URL, Optional)
  gender: ENUM('Male', 'Female', 'Other', Optional)
  role: ENUM('Customer', 'Shop_Owner', 'Barber', 'Admin') (Required)
  country_code: string (Default: '+91')
  is_active: boolean (Default: true)
  created_at: timestamp
  updated_at: timestamp
  deleted_at: timestamp (Soft Delete)
}
```

**Relationships:**
- Has Many: Appointments (as customer)
- Has One: Device Info
- Has Many: FCM Tokens
- Has Many: Refresh Tokens

---

## 2. Shop Model

**Table:** `shops`

```typescript
{
  id: string (UUID, Primary Key)
  user_id: string (Foreign Key → users)
  shop_name: string (Required)
  description: string (Optional)
  email: string (Optional)
  mobile: string (Optional)
  gst_number: string (Optional, Unique)
  pan_number: string (Optional)
  aadhar_number: string (Optional)
  profile_image: string (URL, Optional)
  cover_image: string (URL, Optional)
  rating: decimal(2,1) (Default: 0.0)
  is_verified: boolean (Default: false)
  is_active: boolean (Default: true)
  created_at: timestamp
  updated_at: timestamp
  deleted_at: timestamp (Soft Delete)
}
```

**Relationships:**
- Belongs To: User (owner)
- Has Many: Shop Locations
- Has One: Shop KYC
- Has One: Shop Bank Details
- Has Many: Services
- Has Many: Barbers
- Has Many: Appointments

---

## 3. Shop Location Model

**Table:** `shop_locations`

```typescript
{
  id: string (UUID, Primary Key)
  shop_id: string (Foreign Key → shops, Required)
  latitude: decimal(10,8) (Required)
  longitude: decimal(11,8) (Required)
  address: string (Required)
  city: string (Optional)
  state: string (Optional)
  postal_code: string (Optional)
  country: string (Optional)
  opening_time: time (HH:mm:ss format)
  closing_time: time (HH:mm:ss format)
  created_at: timestamp
  updated_at: timestamp
}
```

**Purpose:** Store multiple locations per shop with distance calculation using Haversine formula.

---

## 4. Shop KYC Model

**Table:** `shop_kycs`

```typescript
{
  id: string (UUID, Primary Key)
  shop_id: string (Foreign Key → shops, Unique, Required)
  pan_number: string (Optional)
  pan_url: string (Document URL, Optional)
  pan_status: ENUM('Pending', 'Verified', 'Rejected') (Default: 'Pending')
  aadhar_number: string (Optional)
  aadhar_url: string (Document URL, Optional)
  aadhar_status: ENUM('Pending', 'Verified', 'Rejected') (Default: 'Pending')
  gst_certificate_url: string (Document URL, Optional)
  gst_status: ENUM('Pending', 'Verified', 'Rejected') (Default: 'Pending')
  created_at: timestamp
  updated_at: timestamp
}
```

**Purpose:** Store KYC documents for shop owner verification.

---

## 5. Shop Bank Details Model

**Table:** `shop_bank_details`

```typescript
{
  id: string (UUID, Primary Key)
  shop_id: string (Foreign Key → shops, Unique, Required)
  account_holder: string (Required)
  account_number: string (Required, Encrypted in production)
  ifsc_code: string (Required)
  bank_name: string (Optional)
  bank_address: string (Optional)
  account_type: ENUM('Savings', 'Current') (Optional)
  created_at: timestamp
  updated_at: timestamp
}
```

**Purpose:** Store bank details for payout processing.

---

## 6. Service Model

**Table:** `services`

```typescript
{
  id: string (UUID, Primary Key)
  shop_id: string (Foreign Key → shops, Required)
  service_name: string (Required)
  description: string (Optional)
  price: decimal(10,2) (Required)
  duration: integer (in minutes, Required)
  category: string (Optional)
  is_active: boolean (Default: true)
  created_at: timestamp
  updated_at: timestamp
}
```

**Example Services:**
- Haircut (₹300, 30 mins)
- Beard Trim (₹150, 15 mins)
- Hair Coloring (₹500, 45 mins)
- Facial (₹400, 40 mins)

---

## 7. Barber Model

**Table:** `barbers`

```typescript
{
  id: string (UUID, Primary Key)
  shop_id: string (Foreign Key → shops, Required)
  user_id: string (Foreign Key → users, Optional)
  name: string (Required)
  mobile: string (Optional)
  email: string (Optional)
  profile_image: string (URL, Optional)
  experience: integer (in years, Optional)
  specialization: JSON (Array of strings) (Optional)
  rating: decimal(2,1) (Default: 0.0)
  is_active: boolean (Default: true)
  created_at: timestamp
  updated_at: timestamp
  deleted_at: timestamp (Soft Delete)
}
```

**Specialization Examples:** ["Haircut", "Beard Design", "Hair Coloring", "Threading"]

**Relationships:**
- Belongs To: Shop
- Belongs To: User (optional, if has own account)
- Has Many: Barber Attendances
- Has Many: Appointments

---

## 8. Appointment Model

**Table:** `appointments`

```typescript
{
  id: string (UUID, Primary Key)
  customer_id: string (Foreign Key → users, Required)
  shop_id: string (Foreign Key → shops, Required)
  barber_id: string (Foreign Key → barbers, Optional initially)
  appointment_date: timestamp (Required)
  duration: integer (in minutes, calculated from services)
  status: ENUM('Pending', 'Accepted', 'InProgress', 'Completed', 'Cancelled') (Default: 'Pending')
  payment_mode: ENUM('CASH', 'ONLINE') (Default: 'CASH')
  payment_status: ENUM('Pending', 'Completed', 'Failed') (Default: 'Pending')
  total_amount: decimal(10,2) (Calculated from services)
  notes: text (Optional, customer notes)
  created_at: timestamp
  updated_at: timestamp
  deleted_at: timestamp (Soft Delete)
}
```

**Status Flow:**
```
Pending → Accepted → InProgress → Completed
                  ↘ Cancelled (anytime before InProgress)
```

**Relationships:**
- Belongs To: Customer (User)
- Belongs To: Shop
- Belongs To: Barber (assigned later)
- Has Many: Appointment Services (junction table)

---

## 9. Appointment Service Model

**Table:** `appointment_services`

```typescript
{
  id: string (UUID, Primary Key)
  appointment_id: string (Foreign Key → appointments, Required)
  service_id: string (Foreign Key → services, Required)
  price: decimal(10,2) (Snapshot of service price at booking time)
  duration: integer (in minutes, snapshot)
  created_at: timestamp
}
```

**Purpose:** Many-to-many relationship between appointments and services, allowing multiple services per appointment.

---

## 10. Barber Attendance Model

**Table:** `barber_attendances`

```typescript
{
  id: string (UUID, Primary Key)
  barber_id: string (Foreign Key → barbers, Required)
  attendance_date: date (Required)
  check_in_time: time (Optional)
  check_out_time: time (Optional)
  status: ENUM('Present', 'Absent', 'Leave') (Default: 'Absent')
  notes: text (Optional)
  created_at: timestamp
  updated_at: timestamp
}
```

**Purpose:** Track barber attendance and availability.

---

## 11. OTP Model

**Table:** `otps`

```typescript
{
  id: string (UUID, Primary Key)
  mobile: string (Required)
  code: string (6-digit OTP, Required)
  attempt: integer (Default: 0, max 3)
  is_verified: boolean (Default: false)
  expires_at: timestamp (5 minutes from creation)
  created_at: timestamp
}
```

**Purpose:** Temporary OTP storage for authentication.

---

## 12. Refresh Token Model

**Table:** `refresh_tokens`

```typescript
{
  id: string (UUID, Primary Key)
  user_id: string (Foreign Key → users, Required)
  token: string (Required, Unique)
  expires_at: timestamp (7 days from creation)
  created_at: timestamp
}
```

**Purpose:** Store refresh tokens for re-issuing access tokens without re-authentication.

---

## 13. Device Info Model

**Table:** `device_infos`

```typescript
{
  id: string (UUID, Primary Key)
  user_id: string (Foreign Key → users, Required)
  device_type: ENUM('WEB', 'ANDROID', 'IOS') (Required)
  device_id: string (Unique identifier, Required)
  app_version: string (Optional)
  os_version: string (Optional)
  manufacturer: string (Optional)
  model: string (Optional)
  last_active: timestamp (Optional)
  is_active: boolean (Default: true)
  created_at: timestamp
  updated_at: timestamp
}
```

**Purpose:** Track user devices for push notifications and device management.

---

## 14. FCM Token Model

**Table:** `fcm_tokens`

```typescript
{
  id: string (UUID, Primary Key)
  user_id: string (Foreign Key → users, Required)
  device_info_id: string (Foreign Key → device_infos, Optional)
  fcm_token: string (Required, Unique)
  device_type: ENUM('WEB', 'ANDROID', 'IOS') (Required)
  is_active: boolean (Default: true)
  created_at: timestamp
  updated_at: timestamp
}
```

**Purpose:** Store Firebase Cloud Messaging tokens for push notifications.

---

## Entity Relationship Diagram

```
Users (1) ──── (Many) Appointments (as customer)
   │
   └──── (1) Device Info
   │
   └──── (Many) FCM Tokens
   │
   └──── (Many) Refresh Tokens
   │
   └──── (1) Shop (Shop Owner)
   │
   └──── (Many) Barbers (if staff account)

Shops (1) ──── (1) Shop Location
   │
   └──── (1) Shop KYC
   │
   └──── (1) Shop Bank Details
   │
   └──── (Many) Services
   │
   └──── (Many) Barbers
   │
   └──── (Many) Appointments

Barbers (1) ──── (Many) Barber Attendances
   │
   └──── (Many) Appointments

Appointments (Many) ──── (Many) Services (via Appointment Services)
   │
   └──── (1) Barber (assigned)
   │
   └──── (1) Customer (User)
   │
   └──── (1) Shop
```

---

## Key Constraints & Indexes

### Unique Constraints
- `users.mobile` - Must be unique
- `shops.gst_number` - Must be unique
- `refresh_tokens.token` - Must be unique
- `fcm_tokens.fcm_token` - Must be unique
- `device_infos.device_id` - Must be unique per user

### Indexes (Performance)
- `appointments.customer_id` - Quick user lookup
- `appointments.shop_id` - Quick shop lookup
- `appointments.barber_id` - Quick barber lookup
- `appointments.appointment_date` - Date range queries
- `barber_attendances.barber_id, attendance_date` - Composite
- `fcm_tokens.user_id` - Push notification lookup
- `shop_locations.shop_id` - Location queries

### Soft Deletes
These models use soft deletes (deleted_at field):
- `users`
- `barbers`
- `appointments`

---

## Data Validation Rules

### Mobile Number
- Must be 10 digits
- Must match pattern: `^\d{10}$`

### Email
- Standard email validation
- Optional field

### OTP
- 6 digits
- Expires in 5 minutes
- Max 3 verification attempts

### Refresh Token
- Expires in 7 days
- One per user per device (recommended)

### Appointment Date
- Must be in future
- Should be within shop's opening hours
- Must have at least 1 service selected

### Price Fields
- Must be positive decimal
- Maximum 2 decimal places

---

## Migration Guide

All models use Sequelize ORM. Database migrations are in `/src/models/`.

Key migration patterns:
1. **Users & Authentication** - Run first (core user management)
2. **Shop Management** - Run second (depends on users)
3. **Services & Barbers** - Run third (depends on shops)
4. **Appointments** - Run last (depends on users, shops, barbers, services)
