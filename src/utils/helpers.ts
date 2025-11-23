// Utility helper functions

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatTime = (timeString: string): string => {
  return timeString;
};

export const calculateDuration = (departure: string, arrival: string): string => {
  // Simple duration calculation (you can enhance this)
  return '3h 30m';
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'confirmed':
      return 'bg-success text-success-foreground';
    case 'cancelled':
      return 'bg-destructive text-destructive-foreground';
    case 'completed':
      return 'bg-muted text-muted-foreground';
    case 'pending':
      return 'bg-warning text-warning-foreground';
    case 'paid':
      return 'bg-success text-success-foreground';
    case 'refunded':
      return 'bg-muted text-muted-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const getTomorrowDate = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const re = /^[+]?[\d\s-()]+$/;
  return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

/**
 * Safely parse amenities from bus data
 * Handles string (JSON), array, or null/undefined values
 */
export const parseAmenities = (amenities: any): string[] => {
  if (!amenities) return [];
  
  if (typeof amenities === 'string') {
    try {
      const parsed = JSON.parse(amenities);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  
  if (Array.isArray(amenities)) {
    return amenities;
  }
  
  return [];
};

/**
 * Safely parse images from bus data
 * Handles string (JSON), array, or null/undefined values
 */
export const parseImages = (images: any): string[] => {
  if (!images) return [];
  
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  
  if (Array.isArray(images)) {
    return images;
  }
  
  return [];
};

/**
 * Generate seat layout for a bus
 * Creates seats in 2 columns (A and B) with rows
 * Format: A1, A2, ..., A10, B1, B2, ..., B10
 */
export const generateSeats = (totalSeats: number, bookedSeats: string[] = []): Array<{
  seatNumber: string;
  isBooked: boolean;
  isSelected: boolean;
  row: number;
  column: number;
}> => {
  const seats: Array<{
    seatNumber: string;
    isBooked: boolean;
    isSelected: boolean;
    row: number;
    column: number;
  }> = [];
  
  const seatsPerColumn = Math.ceil(totalSeats / 2);
  
  // Left column (A)
  for (let row = 1; row <= seatsPerColumn; row++) {
    const seatNumber = `A${row}`;
    seats.push({
      seatNumber,
      isBooked: bookedSeats.includes(seatNumber),
      isSelected: false,
      row,
      column: 1,
    });
  }
  
  // Right column (B)
  for (let row = 1; row <= seatsPerColumn; row++) {
    const seatNumber = `B${row}`;
    seats.push({
      seatNumber,
      isBooked: bookedSeats.includes(seatNumber),
      isSelected: false,
      row,
      column: 2,
    });
  }
  
  return seats;
};
