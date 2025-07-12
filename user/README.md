# User Microservice

A comprehensive user management microservice built with Node.js, Express, and Prisma ORM. This service provides authentication, user management, and secure password handling with JWT-based authentication.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Security Features](#security-features)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## ✨ Features

- **User Management**: Create, read, update, delete users
- **Authentication**: JWT-based login/logout with refresh tokens
- **Password Security**: Secure password hashing with bcrypt
- **Password Reset**: Email-based password reset functionality
- **Token Validation**: Advanced token validation with password change detection
- **File Upload**: Avatar upload with multer and AWS S3 integration
- **Search**: User search by username or email
- **Security**: Password update timestamp tracking for token invalidation
- **Error Handling**: Comprehensive error handling with custom AppError class
- **CORS**: Cross-origin resource sharing enabled
- **Logging**: Request logging with Morgan

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer + AWS S3
- **Environment**: dotenv
- **Logging**: Morgan
- **CORS**: cors middleware

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- AWS S3 bucket (for file uploads)
- npm or yarn package manager

## 🚀 Installation

1. **Clone the repository**

   ```bash
   cd user
   npm install
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Generate Prisma client**

   ```bash
   npx prisma generate
   ```

5. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# JWT Secrets
JWT_SECRET="your_jwt_secret_key"
JWT_REFRESH_SECRET="your_refresh_secret_key"

# Server
PORT=8000

# AWS S3 (Optional - for file uploads)
AWS_ACCESS_KEY_ID="your_aws_access_key"
AWS_SECRET_ACCESS_KEY="your_aws_secret_key"
AWS_REGION="your_aws_region"
S3_BUCKET_NAME="your_s3_bucket_name"
```

## 🗄 Database Setup

The application uses Prisma ORM with PostgreSQL. The user schema includes:

```prisma
model User {
  id               String   @id @default(cuid())
  username         String   @unique
  email            String   @unique
  password         String
  passwordUpdatedAt DateTime @default(now())
  avatar           String?
  resetToken       String?
  resetTokenExpiry DateTime?
  name             String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}
```

### Key Fields:

- `passwordUpdatedAt`: Tracks when password was last changed for token validation
- `resetToken` & `resetTokenExpiry`: For password reset functionality
- `avatar`: URL to user's profile picture

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:8000` (or the port specified in your .env file).

## 📚 API Documentation

### Base URL

```
http://localhost:8000/api/v1
```

### Authentication Routes (`/auth`)

#### 1. Login

- **POST** `/auth/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: User data with access and refresh tokens

#### 2. Refresh Token

- **POST** `/auth/refresh-token`
- **Body**:
  ```json
  {
    "refreshToken": "your_refresh_token"
  }
  ```
- **Response**: New access and refresh tokens

#### 3. Get Current User

- **GET** `/auth/me`
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**: Current user data

#### 4. Logout

- **POST** `/auth/logout`
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**: Success message

#### 5. Forgot Password

- **POST** `/auth/forgot-password`
- **Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response**: Success message (reset token logged to console)

#### 6. Reset Password

- **POST** `/auth/reset-password`
- **Body**:
  ```json
  {
    "token": "reset_token",
    "newPassword": "newPassword123"
  }
  ```
- **Response**: Success message

### User Management Routes (`/users`)

#### 1. Create User (Register)

- **POST** `/users`
- **Body**:
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "name": "John Doe"
  }
  ```
- **Response**: Created user data (without password)

#### 2. Get All Users

- **GET** `/users`
- **Response**: Array of all users (without sensitive fields)

#### 3. Get User by ID

- **GET** `/users/:id`
- **Response**: User data for specified ID

#### 4. Update User

- **PATCH** `/users/:id`
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**: (multipart/form-data for avatar upload)
  ```json
  {
    "name": "Updated Name",
    "username": "newusername"
  }
  ```
- **Files**: `avatar` (optional)
- **Response**: Updated user data

#### 5. Delete User

- **DELETE** `/users/:id`
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**: Success message

#### 6. Search Users

- **GET** `/users/search?q=search_term`
- **Query Parameters**: `q` (username or email to search)
- **Response**: Array of matching users

#### 7. Change Password

- **PATCH** `/users/change-password`
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**:
  ```json
  {
    "currentPassword": "oldPassword123",
    "newPassword": "newPassword123"
  }
  ```
- **Response**: Success message

## 🔐 Authentication

The service uses JWT-based authentication with the following features:

### Token Types

1. **Access Token**: Short-lived (15 minutes) for API access
2. **Refresh Token**: Long-lived (7 days) for obtaining new access tokens

### Security Features

- **Password Change Detection**: Tokens are invalidated when password is changed
- **Token Issue Time Validation**: Compares token `iat` with `passwordUpdatedAt`
- **Automatic Token Refresh**: Frontend can automatically refresh expired tokens

### Protected Routes

Routes requiring authentication use the `isAuthenticated` middleware:

- `/auth/me`
- `/auth/logout`
- `/users/:id` (PATCH, DELETE)
- `/users/change-password`

## 🛡 Security Features

1. **Password Hashing**: Uses bcryptjs with salt rounds
2. **Token Validation**: JWT tokens validated on each request
3. **Password Change Tracking**: `passwordUpdatedAt` field tracks changes
4. **Token Invalidation**: Old tokens become invalid after password change
5. **CORS Protection**: Configured for specific origins
6. **Error Handling**: Consistent error responses without data leakage
7. **Input Validation**: Request validation and sanitization

## 📁 Project Structure

```
user/
├── src/
│   ├── controller/           # Request handlers
│   │   ├── auth.controller.js
│   │   └── user.controller.js
│   ├── middleware/           # Custom middleware
│   │   ├── auth.js          # Authentication middleware
│   │   └── multer.js        # File upload configuration
│   ├── route/               # Route definitions
│   │   ├── auth.route.js
│   │   └── user.route.js
│   ├── service/             # Business logic
│   │   ├── auth.service.js
│   │   └── user.service.js
│   ├── utils/               # Utility functions
│   │   ├── ApiResponse.js   # Standardized API responses
│   │   ├── AppError.js      # Custom error class
│   │   ├── globalErrorHandler.js
│   │   ├── helper.js
│   │   ├── prisma.js        # Prisma client
│   │   └── s3.js           # AWS S3 configuration
│   └── app.js              # Application entry point
├── prisma/
│   ├── migrations/         # Database migrations
│   └── schema.prisma       # Database schema
├── package.json
├── .env                    # Environment variables
└── README.md
```

## 🔄 API Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "data": [
    /* response data */
  ],
  "message": "Success message"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "data": []
}
```

## 🧪 Testing the API

You can test the API using tools like:

- **Postman**: Import the routes and test endpoints
- **curl**: Command-line testing
- **Frontend Application**: The included React frontend in the `frontend` directory

### Example curl commands:

```bash
# Register a new user
curl -X POST http://localhost:8000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get current user (replace TOKEN with actual token)
curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer TOKEN"
```

## 🔧 Development Notes

### Password Security Implementation

When a user changes their password:

1. `passwordUpdatedAt` is updated to current timestamp
2. All existing tokens become invalid (token `iat` < `passwordUpdatedAt`)
3. User must re-login to get new valid tokens

### Token Validation Flow

1. Extract JWT token from Authorization header
2. Verify token signature and expiration
3. Check if token was issued before last password change
4. If validation passes, proceed with request

### File Upload

- Avatar uploads are handled via multer middleware
- Files can be stored locally or uploaded to AWS S3
- Configure S3 settings in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues**

   - Verify DATABASE_URL in .env
   - Ensure PostgreSQL is running
   - Check database credentials

2. **JWT Token Issues**

   - Verify JWT_SECRET in .env
   - Check token expiration
   - Ensure proper Authorization header format

3. **Password Change Token Invalidation**

   - This is expected behavior for security
   - Users need to re-login after password change

4. **File Upload Issues**
   - Check AWS S3 credentials
   - Verify bucket permissions
   - Ensure multer middleware is configured

## 📞 Support

For support and questions, please refer to the project documentation or create an issue in the repository.
