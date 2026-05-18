# UniqueCare – Campus Complaint Management System

A production-grade full-stack application for managing campus complaints. Students report issues, technicians resolve them, and admins oversee the entire workflow with real-time tracking and notifications.

## Overview

UniqueCare is built with a focus on security, performance, and scalability. It demonstrates modern web development practices including JWT-based authentication, role-based access control, protected API endpoints, and comprehensive validation.

## Key Features

### Authentication & Authorization
- 🔐 **Secure JWT-based Auth** – Access tokens (15min) + refresh tokens (30d) with httpOnly cookies
- 👤 **Role-Based Access Control** – Three roles: `student`, `technician`, `admin` with distinct permissions
- 🔄 **Automatic Session Refresh** – Client-side interceptor handles token refresh without user interaction
- 🛡️ **Password Security** – bcrypt hashing with salt rounds for safe storage
- 📝 **Admin Account Seeding** – Initialize admin users with customizable credentials

### Complaint Management
- 📋 **Full Lifecycle Tracking** – Complaints move through stages: Submitted → Under Review → In Progress → Resolved
- 🎯 **Role-Specific Operations:**
  - Students: Create and view their own complaints
  - Technicians: View assigned complaints, update status
  - Admins: Full access to all complaints, user management, reports
- 🔔 **Real-Time Notifications** – Notify users when complaints are created, assigned, or resolved
- 📊 **Complaint Analytics** – Track statistics and generate reports by time period

### Security & Performance
- 🔒 **Helmet.js** – Security headers (CSP, X-Frame-Options, X-Content-Type-Options, etc.)
- 🚫 **Rate Limiting** – Global, auth-specific, and complaint-specific limits to prevent abuse
- 🛡️ **CORS with Whitelist** – Strict origin validation; localhost allowed in development
- 🔗 **HPP Protection** – HTTP Parameter Pollution defense
- 📦 **Compression** – Gzip compression for reduced payload size
- ✅ **Input Validation** – Custom validators for auth, complaints, and notifications
- 📝 **Request Logging** – All requests logged for audit trails

### Developer Experience
- ⚡ **Express.js** – Lightweight, modular Node.js framework
- 🗄️ **MongoDB + Mongoose** – Document-based storage with schema validation
- 🎨 **React + Vite** – Fast HMR development with Vite
- 🎯 **Service Layer** – Business logic separated from controllers
- 🚨 **Global Error Handler** – Consistent error responses with custom error names

## Architecture

### Backend Structure
```
backend/
├── server.js              # Entry point, server startup, error handling
├── src/
│   ├── app.js            # Express app, middleware setup
│   ├── config/
│   │   ├── db.js         # MongoDB connection
│   │   └── env.js        # Environment validation
│   ├── controllers/      # Route handlers
│   ├── middlewares/      # Auth, error, logging, rate limiting
│   ├── modals/           # Mongoose schemas
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic (auth, complaints)
│   ├── utils/            # Helpers (response formatting, async handler)
│   └── validators/       # Input validation schemas
```

### Frontend Structure
```
frontend/
├── src/
│   ├── api/              # HTTP client, API calls
│   ├── context/          # Auth & Theme providers
│   ├── hooks/            # Custom hooks (useNavigation, useUserProfile)
│   ├── layouts/          # Page layouts (Public, Private, Protected)
│   ├── pages/            # Page components
│   ├── components/       # Reusable UI components
│   ├── routes/           # Route guards and definitions
│   └── styles/           # Global & component styles
```

## Tech Stack

| Layer | Technologies |
|-------|---|
| **Frontend** | React 19, Vite, React Router v7, Tailwind CSS, Axios, Recharts |
| **Backend** | Node.js, Express 5, MongoDB, Mongoose |
| **Security** | JWT (jsonwebtoken), bcryptjs, Helmet, CORS, HPP, express-rate-limit |
| **Utilities** | Compression, validator.js, xss protection |

## Security Highlights

- **Token Strategy:** Short-lived access tokens + long-lived refresh tokens in secure cookies
- **CORS:** Configurable whitelist with development localhost bypass
- **Rate Limiting:**
  - Global: 300 requests/15min
  - Auth: 20 requests/15min (prevents brute force)
  - Complaints: 50 requests/10min
- **Input Validation:** Sanitized and validated on both client and server
- **Password Hashing:** bcrypt with automatic salt generation
- **Admin Credentials:** Configurable via environment or defaults

## Environment Variables

### Backend (`.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
ADMIN_EMAIL=write your email
ADMIN_FIXED_PASSWORD=your password
FRONTEND_ORIGIN=http://localhost:5173
SEED_ADMIN=true
```



## Getting Started

### Prerequisites
- Node.js 18+
- npm
- MongoDB (local or Atlas)

### Installation

**Backend:**
```bash
cd backend
npm install
npm run dev    # Starts on port 5000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev    # Starts on port 5173
```

## Best Practices Implemented

✅ **Error Handling** – Global middleware catches and formats all errors  
✅ **Async/Await** – asyncHandler wrapper prevents unhandled promise rejections  
✅ **Validation** – Schema-level and route-level input validation  
✅ **SOLID Principles** – Separated concerns (controllers, services, validators)  
✅ **Environment Configuration** – All secrets in env vars, none hardcoded  
✅ **Request Logging** – Centralized logging for debugging and audit  
✅ **Response Consistency** – Standardized API response format  
✅ **Protected Routes** – Auth middleware on all protected endpoints  
✅ **Security Headers** – Helmet protects against common web vulnerabilities  

## Production Readiness

- ✅ Rate limiting to prevent abuse
- ✅ CORS configured with strict whitelist
- ✅ Security headers via Helmet
- ✅ Password hashing with bcrypt
- ✅ JWT with expiration
- ✅ Error handling and logging
- ✅ Input validation and sanitization
- ✅ Graceful shutdown handling
- ✅ Environment-based configuration

## License

No license specified.