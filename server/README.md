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

# Email Configuration (for OTP and notifications)
EMAIL_USER=sstream2023@gmail.com
EMAIL_PASS=ncrdgffgapmjvhgs

# Cloudinary Configuration (for image storage)
CLOUDINARY_CLOUD_NAME=dafjqlfj7
CLOUDINARY_API_KEY=357399486623525
CLOUDINARY_API_SECRET=AVtrjJXjvXpp-pNYo3euX7p1iBs
CLOUDINARY_UPLOAD_PRESET=finalyearproject
CLOUDINARY_ASSET_FOLDER=fyp

# Stripe Configuration (for payments)
STRIPE_SECRET_KEY=sk_test_51Qw2xZGd5XQJoYaEDmnW2AjyqHOjBirZ9fARisAoSBr01flrls7MGvaW8N9yAHeti1VppAIut3StwvqPdUOWG3Pr00eifdgshP
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51Qw2xZGd5XQJoYaEAVWezOChviWUhg4FORS7VZjBwXNYcjwUzctSNpnzLFfsxuLgKQIRzFXGbIAOTwA4BF7a7wOv00k983tPDB
```

### 3. Database Setup

Make sure you have:
- MySQL server running
- Database `easysewa` created in phpMyAdmin
- Correct database credentials in `.env` file

### 4. Create Super Admin

Run the seed script to create a super admin:

```bash
npm run seed-admin
```

This will create:
- Email: `admin@easysewa.com`
- Password: `admin123`
- **⚠️ Change the password after first login!**

### 5. Run the Server

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
- `POST /api/auth/register` - Register new user (multipart/form-data for owner images)
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify-email?token=xxx` - Verify email address
- `GET /api/auth/me` - Get current user (requires auth)

### Buses
- `GET /api/buses` - Get all buses
- `GET /api/buses/:id` - Get single bus
- `GET /api/buses/owner/list` - Get buses by owner (auth required)
- `POST /api/buses` - Create bus (owner/admin, auth required)
- `PUT /api/buses/:id` - Update bus (owner/admin, auth required)
- `DELETE /api/buses/:id` - Delete bus (owner/admin, auth required)

### Schedules
- `GET /api/schedules` - Get all schedules (query: from, to, date)
- `GET /api/schedules/:id` - Get single schedule
- `GET /api/schedules/bus/:busId` - Get schedules by bus
- `POST /api/schedules` - Create schedule (owner/admin, auth required)
- `PUT /api/schedules/:id` - Update schedule (owner/admin, auth required)
- `DELETE /api/schedules/:id` - Delete schedule (owner/admin, auth required)

### Bookings
- `GET /api/bookings` - Get all bookings (filtered by role, auth required)
- `GET /api/bookings/:id` - Get single booking (auth required)
- `POST /api/bookings` - Create booking (user/admin, auth required)
- `PUT /api/bookings/:id/status` - Update booking status (auth required)
- `PUT /api/bookings/:id/cancel` - Cancel booking (auth required)

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/owners` - Get all bus owners (admin only)
- `PUT /api/admin/owners/:id/approve` - Approve/reject owner (admin only)
- `GET /api/admin/analytics` - Get dashboard analytics (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)

### Payments
- `POST /api/payments/create-intent` - Create Stripe payment intent (auth required)
- `POST /api/payments/confirm` - Confirm payment (auth required)
- `POST /api/payments/webhook` - Stripe webhook handler

### Health Check
- `GET /health` - Server health check

## Features

### Bus Owner Registration
- Bus owners must upload:
  - Bus photo (image file)
  - Bus document (image file)
- Images are stored in Cloudinary
- Account requires admin approval
- Approval email sent automatically

### Email Verification
- All users (except admin) receive verification email
- Click link in email to verify
- Token expires in 24 hours

### Payment Integration
- Stripe payment processing
- Payment intents for secure payments
- Webhook support for payment status updates

## Project Structure

```
server/
├── config/
│   └── database.js       # Database configuration
├── controllers/
│   ├── authController.js  # Authentication
│   ├── busController.js  # Bus management
│   ├── scheduleController.js # Schedule management
│   ├── bookingController.js  # Booking management
│   ├── adminController.js    # Admin operations
│   └── paymentController.js  # Payment processing
├── middleware/
│   ├── auth.js           # Authentication middleware
│   └── upload.js         # File upload middleware
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
│   ├── busRoutes.js
│   ├── scheduleRoutes.js
│   ├── bookingRoutes.js
│   ├── adminRoutes.js
│   ├── paymentRoutes.js
│   └── index.js
├── services/
│   ├── emailService.js   # Email sending service
│   └── cloudinaryService.js # Image upload service
├── scripts/
│   ├── syncDatabase.js   # Database sync script
│   └── seedSuperAdmin.js # Super admin seed script
├── server.js             # Main server file
├── package.json
└── .env                  # Environment variables (create this)
```

## Notes

- Tables are automatically created when the server starts
- JWT tokens expire after 7 days
- Passwords are hashed using bcrypt
- CORS is enabled for frontend communication
- Image uploads limited to 5MB per file
- Bus owner accounts require admin approval
- Email verification required for all users (except admin)
