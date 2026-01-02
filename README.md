# 📚 Trimly API - Salon Booking System

Complete Node.js API for a salon/barber shop booking system with PM2 production setup, comprehensive documentation, and integration guides.

---

## 📊 API Statistics

| Metric | Value |
|--------|-------|
| **Total Endpoints** | 42 |
| **Authentication Routes** | 4 |
| **User Routes** | 9 |
| **Customer Routes** | 7 |
| **Vendor/Shop Routes** | 9 |
| **Barber Routes** | 7 |
| **Common Routes** | 5 |
| **Health Check** | 1 |
| **HTTP Methods** | GET, POST, PUT |
| **Last Updated** | Auto-generated |

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MySQL (v8+)
- PM2 (for production)
- Firebase account for FCM (optional)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd sl_back

# Install dependencies
npm install

# Install PM2 globally (if not installed)
npm install -g pm2

# Setup environment
cp .env.example .env

# Configure .env file
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=trimly
# PORT=3036
# JWT_SECRET=your_secret_key
# NODE_ENV=development
```

### Build Project

```bash
# Build TypeScript to JavaScript
npm run build
```

---

## 🎯 PM2 Production Setup

### Initial Setup

```bash
# 1. Build the project first
npm run build

# 2. Start PM2 with development environment
npm run pm2:start

# 3. Start PM2 with production environment
npm run pm2:start:prod

# 4. Save PM2 process list (so it persists after reboot)
npm run pm2:save

# 5. Setup PM2 to start on system boot
npm run pm2:startup
# Follow the instructions shown in terminal
```

### PM2 Commands

```bash
# Start application
npm run pm2:start              # Development mode
npm run pm2:start:prod         # Production mode

# Stop application
npm run pm2:stop

# Restart application
npm run pm2:restart

# Delete application from PM2
npm run pm2:delete

# View logs
npm run pm2:logs

# Monitor application (CPU, Memory)
npm run pm2:monit

# Check status
npm run pm2:status

# Save current process list
npm run pm2:save
```

### PM2 Advanced Usage

```bash
# View detailed logs
pm2 logs trimly-api --lines 100

# Restart with zero downtime
pm2 reload trimly-api

# Stop all PM2 processes
pm2 stop all

# Delete all PM2 processes
pm2 delete all

# View PM2 dashboard
pm2 plus

# Clear logs
pm2 flush
```

### PM2 Configuration

The PM2 configuration is in `ecosystem.config.js`:

- **App Name**: `trimly-api`
- **Script**: `dist/server.js` (compiled from TypeScript)
- **Instances**: `max` (uses all CPU cores)
- **Mode**: `cluster` (load balancing)
- **Memory Limit**: 500MB per instance
- **Auto Restart**: Enabled
- **Logs**: Stored in `./logs/` directory

---

## 🏃 Development

```bash
# Development mode (with auto-reload)
npm run dev

# Server runs on http://localhost:3036
```

---

## 📡 API Endpoints

### Base URL
```
Development: http://localhost:3036
Production: https://your-domain.com
```

### Authentication Routes (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/auth/send-otp` | Send OTP to mobile number | No |
| POST | `/auth/verify-otp` | Verify OTP and get tokens | No |
| POST | `/auth/logout` | Logout user and blacklist token | Yes |
| POST | `/auth/new-access-token` | Generate new access token | No |

### User Routes (`/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/users/save-profile` | Save user profile information | Yes |
| PUT | `/users/update-profile` | Update user profile information | Yes |
| PUT | `/users/update-location` | Update user location | Yes |
| GET | `/users/user-profile` | Get current user profile | Yes |
| PUT | `/users/update-status` | Update user status | Yes |
| GET | `/users/get-status` | Get all available user statuses | Yes |
| GET | `/users/get-genders` | Get all available genders | Yes |
| GET | `/users/roles` | Get all available roles | Yes |
| GET | `/users/check-profile` | Check if user profile is completed | Yes |

### Customer Routes (`/customer`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/customer/near-by-shops` | Get nearby shops based on location | No |
| POST | `/customer/book-appointment` | Book a new appointment | Yes |
| PUT | `/customer/assign-appointments` | Assign appointments to barbers | Yes |
| GET | `/customer/appointments` | Get all customer appointments | Yes |
| PUT | `/customer/change-appointment-status` | Change appointment status | Yes |
| GET | `/customer/payment-modes` | Get all available payment modes | Yes |
| GET | `/customer/appointment-statuses` | Get all available appointment statuses | Yes |

### Vendor/Shop Routes (`/vendor`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/vendor/save-shop-details` | Save shop details | Yes |
| POST | `/vendor/save-shop-location` | Save shop location | Yes |
| POST | `/vendor/save-shop-kyc` | Save shop KYC details | Yes |
| POST | `/vendor/save-shop-bank` | Save shop bank details | Yes |
| GET | `/vendor/get-shop-profile` | Get shop profile | Yes |
| POST | `/vendor/create-service` | Create a new service | Yes |
| GET | `/vendor/services` | Get all services | Yes |
| PUT | `/vendor/add-services` | Add services to shop | Yes |
| PUT | `/vendor/update-service` | Update service details | Yes |

### Barber Routes (`/barber`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/barber/login` | Login barber with username and PIN | No |
| GET | `/barber/barber-profile` | Get barber profile | Yes (Barber) |
| GET | `/barber/barbers-appointments` | Get all barber appointments | Yes (Barber) |
| POST | `/barber/create-barber` | Create a new barber | Yes |
| PUT | `/barber/update-barber` | Update barber details | Yes |
| GET | `/barber/barbers/:id` | Get all barbers of a shop | Yes |
| PUT | `/barber/availability` | Toggle barber availability | Yes |

### Common Routes (`/common`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| PUT | `/common/update-device-info` | Update device information | Yes |
| GET | `/common/device-info` | Get device information | Yes |
| POST | `/common/save-token` | Save FCM token for push notifications | Yes |
| GET | `/common/fcm-token` | Get FCM token | Yes |
| POST | `/common/upload-media` | Upload media file | Yes |

### Health Check

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/api` | Check if server is running | No |

---

## 🔐 Authentication

### Authentication Flow

```
1. User calls:    POST /auth/send-otp
   Body: { mobile: "9876543210", role: "customer" }

2. User receives: OTP via SMS

3. User calls:    POST /auth/verify-otp
   Body: { code: "123456", mobile: "9876543210" }

4. Response:      { access_token, refresh_token }

5. Use token:     Authorization: Bearer <access_token>

6. When expired:  POST /auth/new-access-token
   Body: { refresh_token: "..." }
```

### Authentication Types

1. **Public Routes** - No authentication needed
   - `/auth/send-otp`
   - `/auth/verify-otp`
   - `/auth/new-access-token`
   - `/customer/near-by-shops`
   - `/api` (health check)

2. **Bearer Token Auth** - Standard user authentication
   - Most routes require `Authorization: Bearer <access_token>` header

3. **Barber Auth** - Special barber authentication
   - `/barber/barber-profile`
   - `/barber/barbers-appointments`

---

## 📂 Project Structure

```
src/
├── config/              # Configuration files
│   ├── config.ts        # App configuration
│   ├── database.config.ts
│   └── logger.ts
├── controllers/         # Request handlers
│   ├── common/
│   ├── user/
│   └── vendor/
├── models/             # Database models
│   ├── user/
│   ├── vendor/
│   └── auth/
├── routes/             # API routes
│   ├── common/
│   ├── user/
│   └── vendor/
├── services/           # Business logic
│   ├── common/
│   ├── user/
│   └── vendor/
├── middlewares/        # Custom middlewares
│   ├── auth.middleware.ts
│   └── barber.auth.middleware.ts
├── utils/              # Helper functions
│   ├── apiResponse.ts
│   └── jwt_utils.ts
├── errors/             # Error classes
├── interfaces/         # TypeScript interfaces
├── schema/             # Validation schemas
├── app.ts              # Express app setup
└── server.ts           # Server entry point

scripts/
├── generate-docs.js
├── generate-postman-collection.js
└── push-to-postman.js

ecosystem.config.js     # PM2 configuration
```

---

## 🗄️ Database Setup

```bash
# Create database
mysql -u root -p
CREATE DATABASE trimly;

# Update .env with database credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=trimly
```

The application uses Sequelize ORM with `sync({ alter: true })` which automatically creates/updates tables based on models.

---

## 📝 Environment Variables

Create a `.env` file in the root directory:

```bash
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=trimly

# Server
PORT=3036
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_TOKEN=your_refresh_token_secret

# Logging
LOG_LEVEL=debug
```

---

## 🚀 Production Deployment

### Step 1: Build the Project

```bash
npm run build
```

### Step 2: Start with PM2

```bash
# Start in production mode
npm run pm2:start:prod

# Save PM2 process list
npm run pm2:save

# Setup PM2 to start on system boot
npm run pm2:startup
# Follow the instructions shown
```

### Step 3: Verify

```bash
# Check status
npm run pm2:status

# View logs
npm run pm2:logs

# Monitor
npm run pm2:monit
```

### Step 4: Nginx Configuration (Optional)

If using Nginx as reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3036;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📚 Documentation

Complete documentation available in `/documentation/` folder:

- **[01-API-Reference](./documentation/01-API-Reference/)** - All endpoints with examples
- **[02-Routes-Guide](./documentation/02-Routes-Guide/)** - Detailed route breakdown  
- **[03-Flowcharts](./documentation/03-Flowcharts/)** - Visual diagrams & flowchart guides
- **[04-Integration-Examples](./documentation/04-Integration-Examples/)** - Real code examples
- **[05-Data-Models](./documentation/05-Data-Models/)** - Database schemas & relationships
- **[06-Best-Practices](./documentation/06-Best-Practices/)** - Security & performance guidelines

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start development server with nodemon

# Build
npm run build            # Compile TypeScript to JavaScript

# Production
npm start                # Start compiled server
npm run pm2:start        # Start with PM2 (development)
npm run pm2:start:prod   # Start with PM2 (production)

# PM2 Management
npm run pm2:stop         # Stop PM2 process
npm run pm2:restart      # Restart PM2 process
npm run pm2:logs         # View PM2 logs
npm run pm2:monit        # Monitor PM2 processes
npm run pm2:status       # Check PM2 status

# Documentation
npm run generate-docs    # Generate API documentation

# Postman
npm run generate-postman    # Generate Postman collection
npm run postman:push        # Push collection to Postman
npm run postman            # Generate and push to Postman
```

---

## 🔒 Security Features

- ✅ JWT authentication with access & refresh tokens
- ✅ OTP-based authentication
- ✅ Password hashing (bcrypt)
- ✅ Input validation (Zod)
- ✅ SQL injection prevention (Sequelize ORM)
- ✅ CORS protection
- ✅ Rate limiting
- ✅ Secure headers
- ✅ Soft deletes (GDPR compliance)

---

## 🐛 Troubleshooting

### PM2 Issues

```bash
# PM2 process not starting
pm2 delete all
npm run build
npm run pm2:start:prod

# View error logs
pm2 logs trimly-api --err

# Check if port is in use
lsof -i :3036
```

### Database Connection Error

```bash
# Check MySQL is running
mysql -u root -p

# Verify .env file has correct credentials
cat .env | grep DB_
```

### Build Errors

```bash
# Clean and rebuild
rm -rf dist
npm run build
```

---

## 📞 Support

For detailed documentation, visit the `/documentation/` folder.

**Happy coding! 🚀**
