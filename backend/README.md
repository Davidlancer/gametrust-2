# GameTrust Auth Backend - TypeScript

A modern, modular authentication backend built with TypeScript, Express, and Prisma.

## 🚀 Features

- **TypeScript**: Full type safety and modern JavaScript features
- **Modular Architecture**: Clean separation of concerns with module-based structure
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Input Validation**: Comprehensive request validation using Joi
- **Rate Limiting**: Protection against brute force attacks
- **Security**: Helmet, CORS, and other security best practices
- **Database**: Prisma ORM with PostgreSQL/MySQL support

## 📁 Project Structure

```
src/
├── config/                 # Configuration management
│   └── index.ts           # App configuration
├── modules/               # Feature modules
│   └── auth/              # Authentication module
│       ├── controllers/   # Route handlers
│       │   └── auth.controller.ts
│       ├── middleware/    # Auth-specific middleware
│       │   ├── auth.middleware.ts
│       │   └── validation.middleware.ts
│       ├── models/        # Data models
│       │   └── auth.model.ts
│       ├── routes/        # Route definitions
│       │   └── auth.routes.ts
│       ├── utils/         # Auth utilities
│       │   └── auth.utils.ts
│       ├── validation/    # Input validation schemas
│       │   └── auth.validation.ts
│       └── index.ts       # Module exports
├── types/                 # TypeScript type definitions
│   └── index.ts
└── server.ts              # Main application entry point
```

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Configure your database connection in `.env`:
```env
DATABASE_URL="your-database-url"
JWT_SECRET="your-jwt-secret"
JWT_EXPIRE="15m"
JWT_REFRESH_EXPIRE="7d"
NODE_ENV="development"
```

4. Generate Prisma client:
```bash
npx prisma generate
```

5. Run database migrations:
```bash
npx prisma db push
```

## 🚀 Development

### Available Scripts

- `npm run dev` - Start development server with ts-node
- `npm run dev:watch` - Start development server with file watching
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run clean` - Remove compiled files

### Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000` (or your configured PORT).

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (protected)

### Health Check

- `GET /api/health` - API health status

## 🏗️ Architecture

### Modular Design

The application follows a modular architecture where each feature (like authentication) is contained within its own module. This provides:

- **Separation of Concerns**: Each module handles its own logic
- **Scalability**: Easy to add new modules
- **Maintainability**: Clear code organization
- **Reusability**: Modules can be easily reused or extracted

### File Naming Convention

The project uses descriptive file naming:

- `*.controller.ts` - Route handlers and business logic
- `*.middleware.ts` - Express middleware functions
- `*.model.ts` - Data models and database operations
- `*.routes.ts` - Route definitions
- `*.utils.ts` - Utility functions
- `*.validation.ts` - Input validation schemas

### TypeScript Benefits

- **Type Safety**: Catch errors at compile time
- **IntelliSense**: Better IDE support and autocomplete
- **Refactoring**: Safer code refactoring
- **Documentation**: Types serve as documentation
- **Modern Features**: Latest JavaScript features with backward compatibility

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: Prevent brute force attacks
- **JWT**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Joi schema validation
- **SQL Injection Protection**: Prisma ORM prevents SQL injection

## 🧪 Testing

To run tests (when implemented):

```bash
npm test
```

## 📦 Production Build

1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

## 🔧 Configuration

The application uses a centralized configuration system in `src/config/index.ts`. All environment variables are validated and typed.

## 📝 Migration from JavaScript

This backend has been migrated from JavaScript to TypeScript with the following improvements:

1. **Full Type Safety**: All functions, variables, and API responses are typed
2. **Modular Architecture**: Code organized into feature-based modules
3. **Better Error Handling**: Typed error responses and proper error handling
4. **Modern Development**: Latest TypeScript features and best practices
5. **Improved Maintainability**: Clear code structure and documentation

## 🤝 Contributing

1. Follow the existing code structure and naming conventions
2. Add proper TypeScript types for all new code
3. Update tests when adding new features
4. Follow the modular architecture pattern

## 📄 License

MIT License - see LICENSE file for details.