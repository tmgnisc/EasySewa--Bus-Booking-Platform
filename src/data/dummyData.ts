// Dummy Data for EasySewa Application
import { User, Bus, Schedule, Booking, Route, Testimonial, Analytics } from '@/types';

export const dummyUsers: User[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    role: 'user',
    createdAt: '2024-01-15',
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1234567891',
    role: 'user',
    createdAt: '2024-02-10',
  },
  {
    id: 'owner-1',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    phone: '+1234567892',
    role: 'owner',
    createdAt: '2024-01-05',
    isApproved: true,
  },
  {
    id: 'owner-2',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    phone: '+1234567893',
    role: 'owner',
    createdAt: '2024-03-01',
    isApproved: false,
  },
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@easysewa.com',
    phone: '+1234567894',
    role: 'admin',
    createdAt: '2023-12-01',
  },
];

export const dummyBuses: Bus[] = [
  {
    id: 'bus-1',
    ownerId: 'owner-1',
    ownerName: 'Michael Johnson',
    busNumber: 'MH-12-AB-1234',
    busName: 'Luxury Express',
    busType: 'AC',
    totalSeats: 40,
    amenities: ['WiFi', 'Charging Port', 'Water Bottle', 'Blanket'],
    rating: 4.5,
    images: ['/placeholder.svg'],
  },
  {
    id: 'bus-2',
    ownerId: 'owner-1',
    ownerName: 'Michael Johnson',
    busNumber: 'MH-12-CD-5678',
    busName: 'Comfort Sleeper',
    busType: 'Sleeper',
    totalSeats: 30,
    amenities: ['WiFi', 'Charging Port', 'Pillow', 'Blanket'],
    rating: 4.7,
    images: ['/placeholder.svg'],
  },
  {
    id: 'bus-3',
    ownerId: 'owner-1',
    ownerName: 'Michael Johnson',
    busNumber: 'DL-01-EF-9012',
    busName: 'Metro Express',
    busType: 'Semi-Sleeper',
    totalSeats: 35,
    amenities: ['Charging Port', 'Water Bottle'],
    rating: 4.2,
    images: ['/placeholder.svg'],
  },
];

export const dummySchedules: Schedule[] = [
  {
    id: 'schedule-1',
    busId: 'bus-1',
    from: 'Mumbai',
    to: 'Pune',
    departureTime: '08:00 AM',
    arrivalTime: '11:30 AM',
    date: '2024-12-20',
    price: 500,
    availableSeats: 25,
    duration: '3h 30m',
  },
  {
    id: 'schedule-2',
    busId: 'bus-2',
    from: 'Mumbai',
    to: 'Pune',
    departureTime: '10:30 PM',
    arrivalTime: '05:00 AM',
    date: '2024-12-20',
    price: 800,
    availableSeats: 18,
    duration: '6h 30m',
  },
  {
    id: 'schedule-3',
    busId: 'bus-3',
    from: 'Delhi',
    to: 'Agra',
    departureTime: '06:00 AM',
    arrivalTime: '09:30 AM',
    date: '2024-12-21',
    price: 400,
    availableSeats: 30,
    duration: '3h 30m',
  },
  {
    id: 'schedule-4',
    busId: 'bus-1',
    from: 'Bangalore',
    to: 'Chennai',
    departureTime: '11:00 PM',
    arrivalTime: '06:00 AM',
    date: '2024-12-22',
    price: 900,
    availableSeats: 15,
    duration: '7h',
  },
];

export const dummyBookings: Booking[] = [
  {
    id: 'booking-1',
    userId: 'user-1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    userPhone: '+1234567890',
    scheduleId: 'schedule-1',
    busId: 'bus-1',
    busName: 'Luxury Express',
    busNumber: 'MH-12-AB-1234',
    from: 'Mumbai',
    to: 'Pune',
    date: '2024-12-20',
    departureTime: '08:00 AM',
    arrivalTime: '11:30 AM',
    seats: ['A1', 'A2'],
    totalAmount: 1000,
    bookingDate: '2024-11-15',
    status: 'confirmed',
    paymentStatus: 'paid',
  },
  {
    id: 'booking-2',
    userId: 'user-2',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    userPhone: '+1234567891',
    scheduleId: 'schedule-2',
    busId: 'bus-2',
    busName: 'Comfort Sleeper',
    busNumber: 'MH-12-CD-5678',
    from: 'Mumbai',
    to: 'Pune',
    date: '2024-12-20',
    departureTime: '10:30 PM',
    arrivalTime: '05:00 AM',
    seats: ['L1'],
    totalAmount: 800,
    bookingDate: '2024-11-16',
    status: 'confirmed',
    paymentStatus: 'paid',
  },
];

export const dummyRoutes: Route[] = [
  {
    id: 'route-1',
    from: 'Mumbai',
    to: 'Pune',
    popularityScore: 95,
    image: '/placeholder.svg',
  },
  {
    id: 'route-2',
    from: 'Delhi',
    to: 'Agra',
    popularityScore: 88,
    image: '/placeholder.svg',
  },
  {
    id: 'route-3',
    from: 'Bangalore',
    to: 'Chennai',
    popularityScore: 82,
    image: '/placeholder.svg',
  },
  {
    id: 'route-4',
    from: 'Kolkata',
    to: 'Darjeeling',
    popularityScore: 75,
    image: '/placeholder.svg',
  },
];

export const dummyTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    userName: 'Rahul Kumar',
    userImage: '/placeholder.svg',
    rating: 5,
    comment: 'Excellent service! The bus was clean, comfortable, and arrived on time. Highly recommend EasySewa for hassle-free travel.',
    date: '2024-10-15',
  },
  {
    id: 'test-2',
    userName: 'Priya Sharma',
    userImage: '/placeholder.svg',
    rating: 4,
    comment: 'Great experience overall. Easy booking process and friendly staff. Will definitely use again for my next trip.',
    date: '2024-10-20',
  },
  {
    id: 'test-3',
    userName: 'Amit Patel',
    userImage: '/placeholder.svg',
    rating: 5,
    comment: 'Best bus booking platform! Saved me time and money. The seat selection feature is amazing.',
    date: '2024-11-01',
  },
];

export const dummyAnalytics: Analytics = {
  totalRevenue: 125000,
  totalBookings: 342,
  totalUsers: 1250,
  totalBusOwners: 45,
  totalBuses: 156,
  recentBookings: dummyBookings,
};

// Helper function to generate seats
export const generateSeats = (totalSeats: number, bookedSeats: string[] = []) => {
  const seats = [];
  const rows = Math.ceil(totalSeats / 4);
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < 4; col++) {
      const seatNumber = `${String.fromCharCode(65 + row)}${col + 1}`;
      if (seats.length < totalSeats) {
        seats.push({
          seatNumber,
          isBooked: bookedSeats.includes(seatNumber),
          isSelected: false,
          type: 'regular' as const,
          row,
          column: col,
        });
      }
    }
  }
  
  return seats;
};

// Cities list for search
export const cities = [
  'Mumbai',
  'Pune',
  'Delhi',
  'Agra',
  'Bangalore',
  'Chennai',
  'Kolkata',
  'Darjeeling',
  'Jaipur',
  'Hyderabad',
  'Ahmedabad',
  'Surat',
  'Goa',
  'Kochi',
  'Mysore',
];
