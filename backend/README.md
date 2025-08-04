# GameTrust Authentication Backend

Express.js authentication system using JWT and Prisma ORM.

## Features

- User registration with password hashing (bcrypt)
- User login with JWT token generation
- Protected routes with JWT middleware
- Prisma ORM with PostgreSQL database
- Input validation with Joi
- Security middleware (helmet, cors, rate limiting)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Update the `.env` file with your database URL:
```
DATABASE_URL="postgresql://username:password@localhost:5432/gametrust?schema=public"
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
```

4. Run database migrations:
```bash
npx prisma db push
```

5. Generate Prisma client:
```bash
npx prisma generate
```

6. Start the server:
```bash
npm run dev
```

## API Endpoints

### Public Routes

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "confirmPassword": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "clx...",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "clx...",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Protected Routes

#### GET /api/auth/me
Get current user profile (requires JWT token).

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx...",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

## Database Schema

The User model includes:
- `id`: Unique identifier (CUID)
- `name`: User's full name
- `email`: Unique email address
- `password`: Hashed password (bcrypt)
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT tokens with configurable expiration
- Rate limiting on authentication routes
- CORS protection
- Helmet security headers
- Input validation with Joi

## Environment Variables

- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 5000)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRE`: Access token expiration (default: 15m)
- `JWT_REFRESH_EXPIRE`: Refresh token expiration (default: 7d)