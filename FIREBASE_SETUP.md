# 🔔 Firebase Push Notifications Setup Guide

## Overview

Firebase push notifications have been integrated into the appointment booking system. Notifications are automatically sent for:

1. **Customer books appointment** → Vendor receives notification
2. **Vendor accepts/declines** → Customer receives notification  
3. **Appointment status changes** → Both parties receive notification (based on who changed it)

---

## 📋 Prerequisites

1. Firebase project created at [Firebase Console](https://console.firebase.google.com/)
2. Firebase Cloud Messaging (FCM) enabled
3. Service account key generated

---

## 🔧 Setup Instructions

### Step 1: Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** (gear icon) → **Service Accounts** tab
4. Click **Generate New Private Key**
5. Download the JSON file

### Step 2: Configure Environment Variables

Add Firebase credentials to your `.env` file:

**Option 1: Using Service Account JSON (Recommended)**
```bash
# Copy the entire JSON content and set it as a single line
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"your-project-id",...}'
```

**Option 2: Using Individual Variables**
```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

### Step 3: For Render Deployment

Add the same environment variables in Render Dashboard:
1. Go to your service → **Environment** tab
2. Add the Firebase environment variables
3. Redeploy

---

## 📱 Notification Payloads

### 1. Customer Books Appointment → Vendor Notification

```json
{
  "title": "New Appointment Booking",
  "message": "John Doe has booked an appointment",
  "data": {
    "customerId": "uuid",
    "customerName": "John Doe",
    "serviceName": "Haircut, Shave",
    "appointmentId": "uuid",
    "appointmentDate": "2026-01-05T10:00:00Z",
    "status": "pending"
  }
}
```

### 2. Vendor Accepts/Declines → Customer Notification

```json
{
  "title": "Appointment Accepted",
  "message": "Barber Shop has accepted your appointment",
  "data": {
    "vendorId": "uuid",
    "vendorName": "Barber Shop",
    "service": "Haircut, Shave",
    "status": "accepted",
    "estimatedTime": "2026-01-05T10:00:00Z",
    "appointmentDate": "2026-01-05T10:00:00Z",
    "appointmentId": "uuid",
    "barberId": "uuid",
    "barberName": "John Barber"
  }
}
```

### 3. Status Changed → Notification (Customer or Vendor)

**When Customer Changes Status:**
```json
{
  "title": "Appointment Status Updated",
  "message": "John Doe has cancelled the appointment",
  "data": {
    "customerId": "uuid",
    "customerName": "John Doe",
    "service": "Haircut",
    "status": "cancelled",
    "appointmentDate": "2026-01-05T10:00:00Z",
    "appointmentId": "uuid",
    "estimatedTime": "2026-01-05T10:00:00Z",
    "changedBy": "customer"
  }
}
```

**When Vendor Changes Status:**
```json
{
  "title": "Appointment Status Updated",
  "message": "Barber Shop has completed your appointment",
  "data": {
    "vendorId": "uuid",
    "vendorName": "Barber Shop",
    "service": "Haircut",
    "status": "completed",
    "appointmentDate": "2026-01-05T10:00:00Z",
    "appointmentId": "uuid",
    "estimatedTime": "2026-01-05T10:00:00Z",
    "changedBy": "vendor"
  }
}
```

---

## 🔍 How It Works

### Notification Flow

1. **User registers FCM token** via `/common/save-token` endpoint
2. **Token stored** in `fcm-records` table with `user_id`
3. **When event occurs** (booking, acceptance, status change):
   - System fetches all FCM tokens for the target user
   - Sends notification via Firebase Admin SDK
   - Invalid tokens are automatically removed

### Automatic Token Cleanup

- Invalid or unregistered tokens are automatically removed from database
- Prevents sending to dead tokens
- Keeps database clean

---

## 🧪 Testing

### 1. Test Firebase Connection

```bash
# Check if Firebase initializes correctly
# Look for this in server logs:
✅ Firebase Admin SDK initialized successfully
```

### 2. Test Notification Sending

1. Register FCM token via `/common/save-token`
2. Book an appointment
3. Check vendor's device for notification
4. Accept appointment
5. Check customer's device for notification

### 3. Check Logs

Notifications are logged:
- ✅ Success: `Notification sent to X device(s) for user {userId}`
- ❌ Error: `Error sending notification: {error}`

---

## 🐛 Troubleshooting

### Firebase Not Initialized

**Error:** `⚠️ Firebase credentials not found. Push notifications will be disabled.`

**Solution:**
- Check `.env` file has Firebase credentials
- Verify `FIREBASE_SERVICE_ACCOUNT` or individual variables are set
- Restart server after adding credentials

### No Notifications Received

**Possible Causes:**
1. **No FCM tokens registered** - User must call `/common/save-token` first
2. **Invalid tokens** - Tokens expire, user needs to re-register
3. **Firebase not initialized** - Check server logs
4. **Wrong user_id** - Verify tokens are linked to correct user

**Debug Steps:**
```bash
# Check if user has FCM tokens
GET /common/fcm-token

# Check server logs for notification attempts
# Look for: "No FCM tokens found for user: {userId}"
```

### Invalid Token Errors

**Error:** `messaging/invalid-registration-token`

**Solution:**
- Tokens are automatically removed
- User needs to re-register token via `/common/save-token`
- This is normal - tokens expire when app is uninstalled

---

## 📝 Environment Variables Reference

```bash
# Required (choose one method)

# Method 1: Service Account JSON
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'

# Method 2: Individual Variables
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

---

## 🔒 Security Notes

1. **Never commit** Firebase credentials to git
2. **Use environment variables** for all credentials
3. **Rotate keys** periodically
4. **Restrict service account** permissions in Firebase Console
5. **Monitor usage** in Firebase Console

---

## 📚 Related Files

- `src/service/notification/firebase.service.ts` - Firebase notification service
- `src/service/user/customer.service.ts` - Appointment service with notifications
- `src/models/user/fcm.model.ts` - FCM token model
- `src/service/common/common.service.ts` - FCM token management

---

## ✅ Checklist

- [ ] Firebase project created
- [ ] Service account key downloaded
- [ ] Environment variables added to `.env`
- [ ] Environment variables added to Render (if deploying)
- [ ] Server restarted
- [ ] Firebase initialization confirmed in logs
- [ ] FCM tokens registered via `/common/save-token`
- [ ] Test notification sent successfully

---

**Need Help?** Check server logs for detailed error messages!

