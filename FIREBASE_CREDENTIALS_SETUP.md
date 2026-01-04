# 🔥 Firebase Credentials Setup Guide for salonwale-edab3

## Step-by-Step Instructions

### Step 1: Get Service Account Key from Firebase Console

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/project/salonwale-edab3/overview
   - Sign in with your Google account

2. **Navigate to Project Settings**
   - Click the **gear icon** (⚙️) next to "Project Overview" in the left sidebar
   - Select **"Project settings"**

3. **Go to Service Accounts Tab**
   - Click on the **"Service accounts"** tab at the top
   - You'll see options for Node.js, Python, and Java

4. **Generate New Private Key**
   - Click **"Generate new private key"** button
   - A warning dialog will appear - click **"Generate key"**
   - A JSON file will be downloaded (e.g., `salonwale-edab3-firebase-adminsdk-xxxxx.json`)

### Step 2: Extract Credentials from JSON File

Open the downloaded JSON file. It will look like this:

```json
{
  "type": "service_account",
  "project_id": "salonwale-edab3",
  "private_key_id": "xxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@salonwale-edab3.iam.gserviceaccount.com",
  "client_id": "xxxxx",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

### Step 3: Add Credentials to Your .env File

You have **two options**:

#### Option 1: Use Full JSON (Recommended)

Add this to your `.env` file:

```bash
# Firebase Configuration (Option 1: Full JSON)
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"salonwale-edab3","private_key_id":"YOUR_PRIVATE_KEY_ID","private_key":"-----BEGIN PRIVATE KEY-----\\nYOUR_PRIVATE_KEY\\n-----END PRIVATE KEY-----\\n","client_email":"firebase-adminsdk-xxxxx@salonwale-edab3.iam.gserviceaccount.com","client_id":"YOUR_CLIENT_ID","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"YOUR_CERT_URL"}'
```

**Important**: 
- Replace all `\n` in the private_key with `\\n` (double backslash)
- Keep the entire JSON as a single line
- Wrap in single quotes

#### Option 2: Use Individual Variables

Add these to your `.env` file:

```bash
# Firebase Configuration (Option 2: Individual Variables)
FIREBASE_PROJECT_ID=salonwale-edab3
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@salonwale-edab3.iam.gserviceaccount.com
```

**Important**:
- Replace `YOUR_PRIVATE_KEY_HERE` with the actual private key from the JSON
- Keep the `\n` characters in the private key
- Wrap the private key in double quotes

### Step 4: Enable Cloud Messaging (FCM)

1. **In Firebase Console**, go to **"Build"** → **"Cloud Messaging"** in the left sidebar
2. If not already enabled, click **"Get started"**
3. This enables Firebase Cloud Messaging for your project

### Step 5: Verify Setup

1. **Check your `.env` file** has the credentials
2. **Restart your server**:
   ```bash
   npm run dev
   ```
3. **Look for this in the logs**:
   ```
   ✅ Firebase Admin SDK initialized successfully
   ```

If you see this message, Firebase is configured correctly!

### Step 6: Test Notifications

1. **Register an FCM token** via your API:
   ```bash
   POST /common/save-token
   {
     "device_id": "device-uuid",
     "token": {
       "type": "fcm",
       "token": "your-fcm-token-from-mobile-app"
     }
   }
   ```

2. **Book an appointment** to trigger a notification
3. **Check the device** for the notification

---

## 🔒 Security Best Practices

1. **Never commit `.env` to git** ✅ (Already in `.gitignore`)
2. **Keep credentials secure** - Don't share the JSON file
3. **Rotate keys periodically** - Generate new keys every 6-12 months
4. **Use environment variables** - Never hardcode credentials

---

## 🐛 Troubleshooting

### Error: "Firebase credentials not found"
- Check `.env` file exists and has the credentials
- Verify variable names match exactly
- Restart server after adding credentials

### Error: "Invalid credentials"
- Check private key format (should have `\n` for newlines)
- Verify client_email is correct
- Make sure project_id matches

### Error: "Permission denied"
- Check service account has proper permissions
- Verify Cloud Messaging is enabled in Firebase Console

---

## 📝 Quick Reference

**Project ID**: `salonwale-edab3`  
**Console URL**: https://console.firebase.google.com/project/salonwale-edab3/overview

**Required Environment Variables**:
- `FIREBASE_SERVICE_ACCOUNT` (Option 1) OR
- `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL` (Option 2)

---

## ✅ Checklist

- [ ] Downloaded service account JSON from Firebase Console
- [ ] Added credentials to `.env` file
- [ ] Enabled Cloud Messaging in Firebase Console
- [ ] Restarted server
- [ ] Verified "Firebase Admin SDK initialized successfully" in logs
- [ ] Tested notification sending

---

**Need Help?** Check the logs for detailed error messages!

