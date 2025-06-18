# GameTrust Authentication Backend

A secure authentication system for the GameTrust gaming account marketplace built with Node.js, Express.js, MongoDB, and JWT.

## 🚀 Features

- **Secure Authentication**: JWT-based authentication with access and refresh tokens
- **User Management**: Complete user registration, login, and profile management
- **Role-Based Access**: Support for user and admin roles
- **Security**: Password hashing with bcrypt, rate limiting, input validation
- **MongoDB Integration**: Mongoose ODM with optimized schemas and indexes
- **Production Ready**: Error handling, logging, and security middleware

## 📦 Installation

1. **Clone and navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
```

4. **Configure environment variables in `.env`**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gametrust
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
```

5. **Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

## 🛠️ API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/refresh` | Refresh access token | No |
| POST | `/api/auth/logout` | Logout user | Yes |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | API health status |

## 📝 API Usage Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "gamer123",
    "email": "gamer@example.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "gamer@example.com",
    "password": "SecurePass123"
  }'
```

### Get Current User (Protected)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Refresh Token
```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## 🗄️ Database Schema

### User Model
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  avatar: String (optional),
  rating: Number (default: 0),
  totalSales: Number (default: 0),
  socials: {
    facebook: String,
    discord: String,
    twitter: String
  },
  isVerified: Boolean (default: false),
  role: String (enum: ['user', 'admin'], default: 'user'),
  lastLogin: Date,
  refreshToken: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds of 12
- **JWT Security**: Signed tokens with issuer/audience validation
- **Rate Limiting**: 100 requests per 15 minutes (5 for auth routes)
- **Input Validation**: Joi validation for all inputs
- **CORS Protection**: Configurable origins
- **Helmet**: Security headers
- **Error Handling**: Secure error responses

## 🏗️ Project Structure

```
backend/
├── controllers/
│   └── authController.js      # Authentication logic
├── middleware/
│   └── authMiddleware.js      # JWT verification middleware
├── models/
│   └── User.js               # User schema and methods
├── routes/
│   └── auth.js               # Authentication routes
├── utils/
│   └── generateToken.js      # JWT token utilities
├── validation/
│   └── authValidation.js     # Input validation schemas
├── .env.example              # Environment variables template
├── server.js                 # Express server setup
└── package.json              # Dependencies and scripts
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/gametrust |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | Access token expiration | 15m |
| `JWT_REFRESH_EXPIRE` | Refresh token expiration | 7d |

## 🚀 Deployment

### Production Checklist
- [ ] Set strong `JWT_SECRET`
- [ ] Configure production MongoDB URI
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS origins
- [ ] Set up SSL/HTTPS
- [ ] Configure reverse proxy (nginx)
- [ ] Set up monitoring and logging

### Docker Support (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing

Test the API endpoints using the provided curl examples or tools like Postman.

### Quick Test Sequence
1. Register a new user
2. Login with credentials
3. Access protected route with token
4. Refresh the token
5. Logout

## 🔮 Future Enhancements

- [ ] Email verification system
- [ ] Password reset functionality
- [ ] Social login (Google, Discord)
- [ ] Two-factor authentication
- [ ] User profile image upload
- [ ] Admin user management endpoints
- [ ] Audit logging
- [ ] API documentation with Swagger

## 📞 Support

For issues or questions, please contact the GameBox Arena development team.

---

**GameTrust Authentication Backend** - Secure, scalable, and production-ready authentication for gaming marketplaces.