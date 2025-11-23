# EasySewa - Bus Booking Web Application

## Project Structure

```
easysewa/
├── public/
│   ├── placeholder.svg         # Placeholder images
│   └── robots.txt             # SEO configuration
├── src/
│   ├── assets/                # Static assets
│   ├── components/
│   │   ├── common/           # Shared components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── DashboardSidebar.tsx
│   │   ├── booking/          # Booking-related components
│   │   │   ├── SearchWidget.tsx
│   │   │   ├── BusCard.tsx
│   │   │   └── SeatMap.tsx
│   │   └── ui/               # Shadcn UI components
│   ├── context/
│   │   └── AuthContext.tsx   # Authentication context
│   ├── data/
│   │   └── dummyData.ts      # Mock data for development
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── layouts/
│   │   ├── MainLayout.tsx    # Layout for public pages
│   │   └── DashboardLayout.tsx # Layout for authenticated pages
│   ├── lib/
│   │   └── utils.ts          # Utility functions
│   ├── pages/
│   │   ├── Home.tsx          # Landing page
│   │   ├── NotFound.tsx      # 404 page
│   │   ├── auth/             # Authentication pages
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   └── ForgotPassword.tsx
│   │   ├── user/             # User dashboard pages
│   │   │   ├── UserDashboard.tsx
│   │   │   ├── SearchResults.tsx
│   │   │   ├── SeatSelection.tsx
│   │   │   ├── BookingHistory.tsx
│   │   │   └── Profile.tsx
│   │   ├── owner/            # Bus owner pages
│   │   │   ├── OwnerDashboard.tsx
│   │   │   ├── ManageBuses.tsx
│   │   │   └── AddBus.tsx
│   │   └── admin/            # Admin panel pages
│   │       ├── AdminDashboard.tsx
│   │       ├── ManageUsers.tsx
│   │       └── ManageOwners.tsx
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   ├── utils/
│   │   └── helpers.ts        # Helper functions
│   ├── App.tsx               # Main app component with routing
│   ├── index.css             # Global styles & design system
│   └── main.tsx              # App entry point
├── index.html                # HTML template
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite configuration
```

## Features Implemented

### 1. Landing Page (Homepage)
- Hero section with gradient background
- Search widget for finding buses
- Featured routes section
- Why choose us section
- Testimonials
- Call-to-action sections
- Responsive navbar and footer

### 2. Authentication System
- Login page with demo credentials
- Signup page with role selection (User/Bus Owner)
- Forgot password flow
- Context-based authentication
- Protected routes

### 3. User Dashboard
- Overview with quick stats
- Search buses functionality
- View bus results with filters
- Detailed seat selection with interactive seat map
- Booking history
- User profile management

### 4. Bus Owner Dashboard
- Dashboard overview with stats
- Manage buses (add, edit, delete)
- Add new bus form
- View bookings and revenue
- Approval status indicator

### 5. Admin Panel
- System-wide analytics dashboard
- Manage all users
- Approve/reject bus owner applications
- View all buses and bookings
- Platform statistics

## Technology Stack

- **React 18+** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **Context API** - State management
- **React Hook Form** - Form handling
- **Sonner** - Toast notifications

## Design System

### Colors
- **Primary**: Deep Teal (`hsl(192 91% 36%)`) - Trust & professionalism
- **Secondary**: Light Blue (`hsl(199 89% 95%)`) - Backgrounds
- **Accent**: Orange (`hsl(27 96% 61%)`) - CTAs & highlights
- **Success**: Green (`hsl(142 71% 45%)`)
- **Warning**: Amber (`hsl(38 92% 50%)`)

### Key Features
- Fully responsive design (mobile, tablet, desktop)
- Dark mode support
- Semantic color tokens
- Custom gradients and shadows
- Smooth transitions and animations

## How to Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Demo Credentials

### Users:
- **Customer**: john@example.com (any password)
- **Bus Owner**: michael@example.com (any password)
- **Admin**: admin@easysewa.com (any password)

## Routes

### Public Routes
- `/` - Home page
- `/login` - Login page
- `/signup` - Signup page
- `/forgot-password` - Forgot password
- `/search` - Search results

### User Routes (Authenticated)
- `/dashboard` - User dashboard
- `/bus/:scheduleId` - Seat selection
- `/bookings` - Booking history
- `/profile` - User profile

### Owner Routes (Owner role required)
- `/owner/dashboard` - Owner dashboard
- `/owner/buses` - Manage buses
- `/owner/add-bus` - Add new bus

### Admin Routes (Admin role required)
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - Manage users
- `/admin/owners` - Manage bus owners

## Key Components

### SearchWidget
Location: `src/components/booking/SearchWidget.tsx`
- From/To city selection
- Date picker
- Passenger count
- Form validation

### SeatMap
Location: `src/components/booking/SeatMap.tsx`
- Interactive seat grid
- Visual states (available, selected, booked)
- Driver section indicator
- Responsive layout

### BusCard
Location: `src/components/booking/BusCard.tsx`
- Bus information display
- Route and timing details
- Amenities badges
- Rating display
- Price and availability

### DashboardSidebar
Location: `src/components/common/DashboardSidebar.tsx`
- Role-based navigation
- Active route highlighting
- Responsive design

## Dummy Data

All dummy data is stored in `src/data/dummyData.ts`:
- Users (customer, owner, admin)
- Buses with details
- Schedules and routes
- Bookings
- Popular routes
- Testimonials
- Analytics data

## Future Enhancements

- Payment gateway integration
- Real-time seat availability
- Email/SMS notifications
- Advanced filtering and sorting
- Bus tracking
- Reviews and ratings
- Multi-language support
- Progressive Web App (PWA)

## Notes

- This is a frontend-only implementation with mock data
- Authentication uses localStorage for demo purposes
- In production, integrate with a real backend API
- Add proper form validation and error handling
- Implement actual payment processing
- Add comprehensive testing

---

Built with ❤️ using React + TypeScript + Tailwind CSS
