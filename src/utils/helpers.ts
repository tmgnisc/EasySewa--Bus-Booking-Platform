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
 * Generate seat layout for a bus (2x2 configuration)
 * Creates seats in 2x2 layout: 2 columns on left, aisle, 2 columns on right
 * Format: Row 1: A1, A2 (left) | Aisle | B1, B2 (right)
 *         Row 2: A3, A4 (left) | Aisle | B3, B4 (right)
 * Each row has 4 seats total (2 on each side of aisle)
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
  
  // 2x2 layout: 4 seats per row
  const seatsPerRow = 4;
  const totalRows = Math.ceil(totalSeats / seatsPerRow);
  let seatCounter = 1;
  
  for (let row = 1; row <= totalRows; row++) {
    // Left side: 2 columns (A1, A2 for row 1, A3, A4 for row 2, etc.)
    for (let col = 1; col <= 2; col++) {
      if (seats.length < totalSeats) {
        const seatNumber = `A${seatCounter}`;
        seats.push({
          seatNumber,
          isBooked: bookedSeats.includes(seatNumber),
          isSelected: false,
          row,
          column: col, // Column 1 or 2 (left side)
        });
        seatCounter++;
      }
    }
    
    // Right side: 2 columns (B1, B2 for row 1, B3, B4 for row 2, etc.)
    for (let col = 1; col <= 2; col++) {
      if (seats.length < totalSeats) {
        const seatNumber = `B${seatCounter - 2}`; // B1, B2 for row 1, B3, B4 for row 2
        seats.push({
          seatNumber,
          isBooked: bookedSeats.includes(seatNumber),
          isSelected: false,
          row,
          column: col + 2, // Column 3 or 4 (right side)
        });
      }
    }
  }
  
  return seats;
};
