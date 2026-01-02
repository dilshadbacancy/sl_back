# Changelog - Project Refactoring

## Summary of Changes

This document outlines all the changes made during the project refactoring and cleanup.

## ✅ Completed Changes

### 1. Role System Updates
- **Updated Roles enum**: Changed from `USER`, `BARBER`, `VENDOR`, `ADMIN` to `CUSTOMER`, `VENDOR`, `ADMIN`
  - `USER` → `CUSTOMER` (for end users)
  - `BARBER` → Removed (barbers are now employees, not a role)
  - `VENDOR` → `VENDOR` (for shop owners)
  - `ADMIN` → `ADMIN` (for administrators)
- **Updated all references** throughout the codebase to use the new role names
- **Barber model**: Changed role field from ENUM to STRING (barbers are employees, not a user role)

### 2. File Naming Fixes
- Fixed typo: `cutomer.route.ts` → `customer.route.ts`
- Fixed typo: `commoon.controller.ts` → `common.controller.ts`
- Fixed typo: `barbar.route.ts` → `barber.route.ts`
- Fixed typo: `barbar.auth.middleware.ts` → `barber.auth.middleware.ts`
- Fixed typo: `barber.mode.ts` → `barber.model.ts`
- Updated all import statements to reflect the corrected file names

### 3. Code Cleanup
- **Removed unused imports**:
  - Removed `ota` from `zod/v4/locales` in auth.service.ts
  - Removed `da` from `zod/v4/locales` in barber.service.ts
  - Removed unused `router` import in auth.service.ts
- **Fixed bug** in `auth.controller.ts`: Changed `.then()` to `.catch()` for error handling in `generateNewAccessToken`
- **Replaced bcrypt with bcryptjs**: Updated helper.ts to use bcryptjs (which is in dependencies)

### 4. Package Cleanup
- **Removed duplicate packages**:
  - Removed `bcrypt` (using `bcryptjs` instead)
  - Removed `express-validator` (not used)
  - Removed `uuid` (not used)
- **Removed unused type definitions**:
  - Removed `@types/bcrypt` (using `@types/bcryptjs` instead)

### 5. Documentation Cleanup
- **Removed entire documentation folder** as requested
- All documentation files have been removed

### 6. Postman Collection Generation
- **Created script** `scripts/generate-postman-collection.js` to automatically generate Postman collection
- **Added npm script**: `npm run generate-postman` to run the script
- **Generated collection** includes:
  - All 42 API routes organized by category
  - Proper authentication headers
  - Request bodies and query parameters
  - Environment variables for base_url and tokens
- **Collection file**: `postman_collection.json` in project root

### 7. Error Handling Improvements
- Fixed error handler middleware in `app.ts` to include all required parameters (req, res, next)

## 📁 Project Structure

The project follows MVC pattern:

```
src/
├── config/          # Configuration files (database, logger, etc.)
├── controllers/     # Request handlers (organized by feature)
│   ├── admin/
│   ├── common/
│   ├── user/
│   └── vendor/
├── errors/          # Custom error classes
├── interfaces/      # TypeScript interfaces
├── middlewares/     # Express middlewares
├── migrations/       # Database migrations
├── models/          # Sequelize models
│   ├── admin/
│   ├── auth/
│   ├── user/
│   └── vendor/
├── routes/          # API routes (organized by feature)
│   ├── admin/
│   ├── common/
│   ├── user/
│   └── vendor/
├── schema/          # Zod validation schemas
├── service/         # Business logic layer
│   ├── admin/
│   ├── common/
│   ├── user/
│   └── vendor/
└── utils/           # Utility functions
```

## 🚀 Usage

### Generate Postman Collection
```bash
npm run generate-postman
```

This will create `postman_collection.json` in the project root.

### Import in Postman
1. Open Postman
2. Click "Import"
3. Select `postman_collection.json`
4. Update the `base_url` variable with your server URL
5. After login, copy the `access_token` to the collection variable

## 🔄 Migration Notes

### Database Changes
- The `users.role` enum values have changed:
  - Old: `user`, `barber`, `vendor`, `admin`
  - New: `customer`, `vendor`, `admin`
- The `barber.role` field is now a STRING instead of ENUM
- **Action Required**: You may need to run a migration to update existing role values in the database

### API Changes
- All endpoints remain the same
- Role values in requests should use: `customer`, `vendor`, or `admin`
- Barber authentication remains separate (barbers are employees, not users)

## 📝 Notes

- Barbers are treated as employees of shops, not as a user role
- The role system now clearly distinguishes between:
  - **Customer**: End users who book appointments
  - **Vendor**: Shop owners who manage shops
  - **Admin**: System administrators
- All file names have been corrected and imports updated
- The project structure is clean and follows MVC pattern

