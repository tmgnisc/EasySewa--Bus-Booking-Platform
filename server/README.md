# EasySewa Backend Server

Express.js backend server with MySQL database using Sequelize ORM.

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Create .env File

Create a `.env` file in the `server` folder with the following content:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=easysewa
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (Change this to a random string in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### 3. Database Setup

Make sure you have:
- MySQL server running
- Database `easysewa` created in phpMyAdmin
- Correct database credentials in `.env` file

### 4. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

**Sync database manually (optional):**
```bash
npm run sync-db
```

## Database Tables

The following tables will be automatically created when you start the server:

- `users` - User accounts (user, owner, admin)
- `buses` - Bus information
- `schedules` - Bus schedules/routes
- `bookings` - User bookings
- `routes` - Popular routes
- `testimonials` - Customer testimonials

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Health Check
- `GET /health` - Server health check

## Project Structure

```
server/
├── config/
│   └── database.js       # Database configuration
├── controllers/
│   └── authController.js # Authentication controllers
├── middleware/
│   └── auth.js           # Authentication middleware
├── models/
│   ├── User.js
│   ├── Bus.js
│   ├── Schedule.js
│   ├── Booking.js
│   ├── Route.js
│   ├── Testimonial.js
│   └── index.js          # Model exports and sync
├── routes/
│   ├── authRoutes.js
│   └── index.js
├── scripts/
│   └── syncDatabase.js   # Database sync script
├── server.js             # Main server file
├── package.json
└── .env                  # Environment variables (create this)
```

## Notes

- Tables are automatically created when the server starts
- JWT tokens expire after 7 days
- Passwords are hashed using bcrypt
- CORS is enabled for frontend communication

