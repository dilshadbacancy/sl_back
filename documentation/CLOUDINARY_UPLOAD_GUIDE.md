# Cloudinary Image Upload Guide

## Setup

### 1. Install Dependencies
```bash
npm install
```

Installed packages:
- `cloudinary` - Cloud storage API
- `multer` - Express file upload middleware

### 2. Configure Environment Variables

Add to your `.env` file:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

You can get these values from your [Cloudinary Dashboard](https://cloudinary.com/console).

## API Endpoint

### Upload Image

**Endpoint:** `POST /common/upload-image`

**Authentication:** Required (Bearer token)

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Field name: `image` (single file)
- Supported formats: JPEG, PNG, WebP
- Max file size: 5MB

**Query Parameters (Optional):**
- `folder` - Cloudinary folder path (default: `salon-booking`)

**Example cURL:**
```bash
curl -X POST http://localhost:3000/common/upload-image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg" \
  -F "folder=salon-booking/profiles"
```

**Example JavaScript/Fetch:**
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

const response = await fetch('http://localhost:3000/common/upload-image?folder=salon-booking/profiles', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const data = await response.json();
console.log(data.data.url); // Image URL
console.log(data.data.public_id); // Cloudinary public_id for later deletion
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/salon-booking/xyz.jpg",
    "public_id": "salon-booking/xyz",
    "original": {
      "public_id": "salon-booking/xyz",
      "version": 1234567890,
      "signature": "abc123",
      "width": 800,
      "height": 600,
      "format": "jpg",
      "resource_type": "image",
      "created_at": "2025-12-10T12:00:00Z",
      "tags": [],
      "bytes": 102400,
      "type": "upload",
      "etag": "def456",
      "placeholder": false,
      "url": "http://res.cloudinary.com/your-cloud/image/upload/v1234567890/salon-booking/xyz.jpg",
      "secure_url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/salon-booking/xyz.jpg",
      "folder": "salon-booking",
      "original_filename": "image"
    }
  }
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "message": "No file provided"
}
```

## Code Implementation

### Service Layer

The `CloudinaryService` in `src/utils/cloudinary.helper.ts` provides two methods:

#### Upload Image
```typescript
CloudinaryService.uploadImage(file, folder)
```
- `file` - Multer file object with buffer
- `folder` - Cloudinary folder path (default: 'salon-booking')
- Returns: `CloudinaryUploadResponse` with `public_id`, `secure_url`, etc.

#### Delete Image
```typescript
CloudinaryService.deleteImage(publicId)
```
- `publicId` - Cloudinary public_id of the image
- Returns: Deletion confirmation from Cloudinary

### Controller Usage

```typescript
import { CloudinaryService } from "../../utils/cloudinary.helper";

// In your controller method
if (req.file) {
  const result = await CloudinaryService.uploadImage(req.file, 'my-folder');
  console.log(result.secure_url); // Use this URL
}
```

### Route Usage

```typescript
import multer from 'multer';
import { CommonController } from '../../controllers/common/commoon.controller';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

router.post('/upload-image', upload.single('image'), CommonController.uploadImage);
```

## Use Cases

### Profile Picture Upload
```javascript
// User uploads their profile picture
const formData = new FormData();
formData.append('image', profilePicFile);

const response = await fetch('/common/upload-image?folder=profiles', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});

const { data } = await response.json();
// Store data.public_id in user profile
```

### Shop Gallery Images
```javascript
// Shop owner uploads gallery image
const response = await fetch('/common/upload-image?folder=shops/gallery', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
```

## Best Practices

1. **Always validate file types** - Already done in multer config
2. **Set file size limits** - 5MB limit configured
3. **Store public_id** - Use this to delete images later
4. **Use secure_url** - Always return HTTPS URLs to clients
5. **Organize with folders** - Use different folders for different content types
6. **Error handling** - Check response success flag before using URL

## Troubleshooting

**"No file provided"**
- Ensure file field name is `image` in form data
- Check Content-Type is `multipart/form-data`

**"Only JPEG, PNG, and WebP images are allowed"**
- Upload file is not one of the supported formats
- Supported: `.jpg`, `.jpeg`, `.png`, `.webp`

**File size error**
- File exceeds 5MB limit
- Reduce file size or increase limit in multer config

**Authentication error**
- Ensure Bearer token is provided in Authorization header
- Token may have expired, request new one

**Cloudinary credentials error**
- Check `.env` file has correct CLOUDINARY_* variables
- Verify credentials in Cloudinary dashboard
