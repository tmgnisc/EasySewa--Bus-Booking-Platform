// Core Type Definitions for BusEase Application

export type UserRole = 'user' | 'owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  isApproved?: boolean; // For bus owners
}

export interface Bus {
  id: string;
  ownerId: string;
  ownerName: string;
  busNumber: string;
  busName: string;
  busType: 'AC' | 'Non-AC' | 'Sleeper' | 'Semi-Sleeper';
  totalSeats: number;
  amenities: string[];
  rating: number;
  images: string[];
}

export interface Schedule {
  id: string;
  busId: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  price: number;
  availableSeats: number;
  duration: string;
}

export interface Seat {
  seatNumber: string;
  isBooked: boolean;
  isSelected: boolean;
  type: 'regular' | 'sleeper';
  row: number;
  column: number;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  scheduleId: string;
  busId: string;
  busName: string;
  busNumber: string;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  seats: string[];
  totalAmount: number;
  bookingDate: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
}

export interface Route {
  id: string;
  from: string;
  to: string;
  popularityScore: number;
  image: string;
}

export interface Testimonial {
  id: string;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SearchParams {
  from: string;
  to: string;
  date: string;
  passengers: number;
}

export interface Analytics {
  totalRevenue: number;
  totalBookings: number;
  totalUsers: number;
  totalBusOwners: number;
  totalBuses: number;
  recentBookings: Booking[];
}
