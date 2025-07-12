# Frontend React App for User Management API

This is a React frontend application built with Vite that provides authentication and user management functionality to test your Node.js/Express API.

## Features

- **Login Page**: Authenticate users with email and password
- **Register Page**: Create new user accounts
- **Dashboard**: View current user profile and list all users
- **Protected Routes**: Only authenticated users can access the dashboard
- **Token Management**: Automatic token refresh using refresh tokens
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Your backend API running on `http://localhost:8000`

### Installation

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

## API Integration

The application is configured to work with your backend API running on `http://localhost:8000`. It includes:

### Authentication Endpoints

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `GET /api/v1/auth/me` - Get current user profile

### User Management Endpoints

- `POST /api/v1/users` - Create new user (registration)
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user
- `GET /api/v1/users/search` - Search users
- `PATCH /api/v1/users/change-password` - Change user password

## Project Structure

```
src/
├── components/          # Reusable components
│   └── ProtectedRoute.jsx
├── pages/              # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Auth.css
│   └── Dashboard.css
├── services/           # API service layer
│   ├── api.js          # Axios configuration
│   ├── authService.js  # Authentication services
│   └── userService.js  # User management services
├── App.jsx             # Main app component with routing
└── main.jsx           # App entry point
```

## Configuration

If your backend API is running on a different URL, update the `baseURL` in `src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: "http://your-api-url/api/v1", // Update this URL
  headers: {
    "Content-Type": "application/json",
  },
});
```

## Testing Your API

1. **Registration**: Visit `/register` to create a new user account
2. **Login**: Visit `/login` to authenticate with existing credentials
3. **Dashboard**: After login, you'll see your profile and all users
4. **Token Refresh**: The app automatically handles token refresh
5. **Logout**: Click the logout button to clear tokens and redirect to login

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
