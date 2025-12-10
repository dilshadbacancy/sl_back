# Integration Examples

Complete code examples for integrating with the Salon Booking API.

---

## 1. Basic Authentication Flow

### JavaScript/TypeScript

```typescript
// Step 1: Send OTP
const sendOTP = async (mobile: string) => {
  const response = await fetch('http://api.example.com/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile })
  });
  return response.json();
};

// Step 2: Verify OTP and get tokens
const verifyOTP = async (mobile: string, code: string) => {
  const response = await fetch('http://api.example.com/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile, code })
  });
  const data = await response.json();
  
  // Store tokens
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  
  return data;
};

// Step 3: Make authenticated requests
const makeAuthenticatedRequest = async (url: string, options = {}) => {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (response.status === 401) {
    // Token expired, refresh it
    const newToken = await refreshAccessToken();
    return makeAuthenticatedRequest(url, options); // Retry
  }
  
  return response.json();
};

// Step 4: Refresh access token
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  
  const response = await fetch('http://api.example.com/auth/new-access-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken })
  });
  
  const data = await response.json();
  localStorage.setItem('access_token', data.access_token);
  
  return data.access_token;
};
```

### Python

```python
import requests
import json

BASE_URL = "http://api.example.com"
tokens = {}

def send_otp(mobile):
    response = requests.post(f"{BASE_URL}/auth/send-otp", json={"mobile": mobile})
    return response.json()

def verify_otp(mobile, code):
    response = requests.post(f"{BASE_URL}/auth/verify-otp", json={"mobile": mobile, "code": code})
    global tokens
    tokens = response.json()
    return tokens

def make_request(method, endpoint, data=None):
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    url = f"{BASE_URL}{endpoint}"
    
    if method == "GET":
        return requests.get(url, headers=headers).json()
    elif method == "POST":
        return requests.post(url, json=data, headers=headers).json()
    elif method == "PUT":
        return requests.put(url, json=data, headers=headers).json()

# Usage
send_otp("9876543210")
verify_otp("9876543210", "123456")
```

---

## 2. Common Integration Patterns

### Get Nearby Shops

```typescript
const getNearbyShops = async (latitude: number, longitude: number, radius: number = 5) => {
  const response = await fetch(
    `http://api.example.com/customer/near-by-shops?latitude=${latitude}&longitude=${longitude}&radius=${radius}`,
    {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
    }
  );
  return response.json();
};

// Usage
const shops = await getNearbyShops(23.18, 79.98, 5); // 5 km radius
console.log(shops); // Array of nearby shops with distance
```

### Book an Appointment

```typescript
const bookAppointment = async (appointmentData: {
  customer_id: string;
  appointment_date: string; // YYYY-MM-DD HH:mm:ss
  services: string[]; // array of service IDs
  payment_mode: string; // 'CASH' | 'ONLINE'
  shop_id: string;
}) => {
  const response = await makeAuthenticatedRequest(
    'http://api.example.com/customer/book-appointment',
    {
      method: 'POST',
      body: JSON.stringify(appointmentData)
    }
  );
  return response.json();
};

// Usage
const appointment = await bookAppointment({
  customer_id: "cust_123",
  appointment_date: "2025-12-15 10:30:00",
  services: ["service_1", "service_2"],
  payment_mode: "ONLINE",
  shop_id: "shop_1"
});
```

### Assign Appointment to Barber

```typescript
const assignAppointment = async (appointmentId: string, barberId?: string) => {
  const response = await makeAuthenticatedRequest(
    'http://api.example.com/customer/assign-appointments',
    {
      method: 'POST',
      body: JSON.stringify({
        id: appointmentId,
        barber_id: barberId // optional, system auto-assigns if not provided
      })
    }
  );
  return response.json();
};
```

### Track Appointment Status

```typescript
const trackAppointment = async (appointmentId: string) => {
  const response = await makeAuthenticatedRequest(
    `http://api.example.com/customer/get-appointment?id=${appointmentId}`
  );
  return response.json();
};

// Status flow: Pending → Accepted → InProgress → Completed
const statuses = {
  'Pending': 'Waiting for barber acceptance',
  'Accepted': 'Barber has accepted',
  'InProgress': 'Service is ongoing',
  'Completed': 'Service finished'
};
```

---

## 3. Push Notifications (FCM)

### Register Device Token

```typescript
const registerFCMToken = async (fcmToken: string, deviceType: 'WEB' | 'ANDROID' | 'IOS') => {
  const response = await makeAuthenticatedRequest(
    'http://api.example.com/common/fcm-token',
    {
      method: 'POST',
      body: JSON.stringify({
        fcm_token: fcmToken,
        device_type: deviceType
      })
    }
  );
  return response.json();
};

// Usage with Firebase Cloud Messaging
import { getMessaging, getToken } from "firebase/messaging";

const messaging = getMessaging();
getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' }).then(token => {
  registerFCMToken(token, 'WEB');
});
```

### Listen for Notifications

```typescript
// In your app initialization
import { getMessaging, onMessage } from "firebase/messaging";

const messaging = getMessaging();

onMessage(messaging, (payload) => {
  console.log('Notification received:', payload);
  
  // Handle different notification types
  const { notification, data } = payload;
  
  if (data.type === 'appointment_accepted') {
    showAlert(`Your appointment is confirmed at ${data.barber_name}`);
  } else if (data.type === 'appointment_started') {
    showAlert('Your service has started');
  } else if (data.type === 'appointment_completed') {
    showAlert('Your service is complete. Please rate your experience');
  }
});
```

---

## 4. Shop Owner Integration

### Setup New Shop

```typescript
const setupNewShop = async (ownerData: {
  mobile: string;
  email: string;
  name: string;
  shop_name: string;
  gst_number: string;
  pan_number: string;
  aadhar_number: string;
}) => {
  // Step 1: Register & verify OTP
  await sendOTP(ownerData.mobile);
  const tokens = await verifyOTP(ownerData.mobile, otpCode);
  
  // Step 2: Save shop details
  await makeAuthenticatedRequest('/shop/save-shop-details', {
    method: 'POST',
    body: JSON.stringify({
      user_id: tokens.user_id,
      shop_name: ownerData.shop_name,
      email: ownerData.email,
      gst_number: ownerData.gst_number
    })
  });
  
  // Step 3: Save shop location
  await makeAuthenticatedRequest('/shop/save-shop-location', {
    method: 'POST',
    body: JSON.stringify({
      shop_id: shopId,
      latitude: 23.18,
      longitude: 79.98,
      address: "123 Main Street"
    })
  });
  
  // Step 4: Save KYC documents
  await makeAuthenticatedRequest('/shop/save-shop-kyc', {
    method: 'POST',
    body: JSON.stringify({
      shop_id: shopId,
      pan_number: ownerData.pan_number,
      aadhar_number: ownerData.aadhar_number,
      pan_url: panDocumentUrl,
      aadhar_url: aadharDocumentUrl
    })
  });
  
  // Step 5: Save bank details
  await makeAuthenticatedRequest('/shop/save-shop-bank', {
    method: 'POST',
    body: JSON.stringify({
      shop_id: shopId,
      account_holder: ownerData.name,
      account_number: "1234567890",
      ifsc_code: "HDFC0001234"
    })
  });
};
```

### Add Services

```typescript
const addService = async (shopId: string, serviceName: string, price: number, duration: number) => {
  const response = await makeAuthenticatedRequest('/shop/create-service', {
    method: 'POST',
    body: JSON.stringify({
      shop_id: shopId,
      service_name: serviceName,
      price: price,
      duration: duration // in minutes
    })
  });
  return response.json();
};

// Usage
await addService("shop_1", "Haircut", 300, 30);
await addService("shop_1", "Beard Trim", 150, 15);
await addService("shop_1", "Hair Coloring", 500, 45);
```

### Add Barber Staff

```typescript
const addBarber = async (shopId: string, barberData: {
  name: string;
  mobile: string;
  experience: number;
  specialization: string[];
}) => {
  const response = await makeAuthenticatedRequest('/barber/create-barber', {
    method: 'POST',
    body: JSON.stringify({
      shop_id: shopId,
      name: barberData.name,
      mobile: barberData.mobile,
      experience: barberData.experience,
      specialization: barberData.specialization
    })
  });
  return response.json();
};

// Usage
await addBarber("shop_1", {
  name: "Raj Kumar",
  mobile: "9876543210",
  experience: 5,
  specialization: ["Haircut", "Beard Design", "Hair Coloring"]
});
```

---

## 5. Error Handling

```typescript
const handleAPIError = async (response: Response) => {
  const data = await response.json();
  
  switch (response.status) {
    case 400:
      console.error('Bad Request:', data.message);
      // Show validation error to user
      break;
    case 401:
      console.error('Unauthorized: Token expired or invalid');
      // Redirect to login
      break;
    case 403:
      console.error('Forbidden: You don\'t have permission');
      // Show permission error
      break;
    case 404:
      console.error('Not Found:', data.message);
      break;
    case 500:
      console.error('Server Error:', data.message);
      // Show generic error message
      break;
    default:
      console.error('Unknown error:', data.message);
  }
};

// Wrapper function
const safeAPICall = async (url: string, options = {}) => {
  try {
    const response = await makeAuthenticatedRequest(url, options);
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

---

## 6. Best Practices for Integration

1. **Always store tokens securely** (HttpOnly cookies or encrypted local storage)
2. **Implement token refresh logic** before expiry
3. **Handle rate limiting** with exponential backoff
4. **Validate all user inputs** before sending to API
5. **Use environment variables** for API endpoints and keys
6. **Implement proper error handling** with user-friendly messages
7. **Log API requests** for debugging (in development only)
8. **Test with different appointment statuses** before production

---

## 7. Environment Setup

```bash
# .env file
REACT_APP_API_BASE_URL=http://localhost:3000
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_VAPID_KEY=your_vapid_key
```

```typescript
// config.ts
export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000
};
```
