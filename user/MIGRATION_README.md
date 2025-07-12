# User Microservice - MongoDB Migration

## Overview

This user microservice has been successfully migrated from Prisma + PostgreSQL to MongoDB + Mongoose while preserving all existing business logic and functionality.

## Key Features Preserved

- ✅ JWT Authentication with access and refresh tokens
- ✅ Password security with timestamp-based token invalidation
- ✅ User CRUD operations
- ✅ Password change functionality with automatic token invalidation
- ✅ Password reset via email tokens
- ✅ File upload to AWS S3
- ✅ Comprehensive load testing suite with table format output

## Migration Changes

### Database Layer

- **Before**: Prisma ORM with PostgreSQL
- **After**: Mongoose ODM with MongoDB
- **Schema**: Converted Prisma schema to Mongoose schema with validations
- **Connections**: Replaced Prisma client with native MongoDB connection

### Key Files Changed

1. **`src/models/user.model.js`** - New Mongoose model with middleware
2. **`src/utils/database.js`** - MongoDB connection handler (was prisma.js)
3. **`src/service/user.service.js`** - Converted all Prisma queries to Mongoose
4. **`src/service/auth.service.js`** - Updated to use Mongoose model methods
5. **`src/app.js`** - Added MongoDB connection initialization
6. **`package.json`** - Updated scripts to remove Prisma dependency

### Enhanced Security Features

- Password hashing automated via Mongoose pre-save middleware
- Automatic `passwordUpdatedAt` timestamp updates
- Token validation against password change timestamps
- Secure password comparison using bcrypt

### Testing Infrastructure

- Comprehensive autocannon load testing suite in `test/` folder
- Table format output for easy result analysis
- JSON and CSV export capabilities
- Multiple endpoint testing functions

## Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
DATABASE_URL=mongodb://localhost:27017/userservice
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
PORT=8000
```

## Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## API Endpoints Unchanged

All existing REST API endpoints remain the same:

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/forgot-password` - Initiate password reset
- `POST /api/v1/auth/reset-password` - Complete password reset
- `GET /api/v1/auth/me` - Get current user info
- `POST /api/v1/users` - Create new user
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user
- `PUT /api/v1/users/:id/change-password` - Change password

## Load Testing

Run comprehensive load tests:

```bash
node test/load-test.js
```

## Migration Benefits

1. **NoSQL Flexibility**: Schema-less design for future scalability
2. **Better Performance**: Optimized for high-throughput operations
3. **Simplified Deployment**: No database migration scripts needed
4. **Enhanced Security**: Mongoose middleware for automatic security handling
5. **Same Business Logic**: Zero functional changes to existing features
