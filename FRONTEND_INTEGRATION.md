# Frontend-Backend Integration Guide

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory (same level as `package.json`) with:

```env
VITE_API_URL=http://localhost:5000/api
```

**Note:** The API URL defaults to `http://localhost:5000/api` if not set.

### 2. Start Backend Server

```bash
cd server
npm install
npm run dev
```

The server should run on `http://localhost:5000`

### 3. Start Frontend

```bash
npm install
npm run dev
```

The frontend should run on `http://localhost:5173` (or port 8080 as configured)

## Signup Integration

### Customer Signup
- Regular form submission
- No file uploads required
- Email verification sent automatically

### Bus Owner Signup
- Requires two image uploads:
  - **Bus Photo**: Photo of the bus
  - **Bus Document**: License/Registration document
- Images are uploaded to Cloudinary
- Account requires admin approval
- Approval email sent when admin approves

### Features Implemented
✅ Dynamic signup with backend API
✅ File upload for bus owners (bus photo + document)
✅ Image preview before upload
✅ Form validation
✅ Error handling
✅ Success messages
✅ Automatic redirect based on role

## API Integration

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/verify-email?token=xxx` - Verify email

### Request Format

**Register (Customer):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "role": "user"
}
```

**Register (Bus Owner):**
- Use `multipart/form-data`
- Include `busPhoto` and `busDocument` as files

**Login:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

## Next Steps

1. ✅ Signup integration (Customer & Bus Owner)
2. ⏳ Login integration
3. ⏳ Email verification page
4. ⏳ Bus management integration
5. ⏳ Booking integration
6. ⏳ Payment integration

