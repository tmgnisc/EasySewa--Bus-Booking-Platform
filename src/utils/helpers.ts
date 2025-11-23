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
 * Format: Row 1: A1, A2 (left columns 1,2) | Aisle | B1, B2 (right columns 3,4)
 *         Row 2: A3, A4 (left columns 1,2) | Aisle | B3, B4 (right columns 3,4)
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
  
  for (let row = 1; row <= totalRows; row++) {
    // Left side: 2 columns (A seats)
    // Row 1: A1 (col 1), A2 (col 2)
    // Row 2: A3 (col 1), A4 (col 2)
    const leftStart = (row - 1) * 2 + 1; // 1 for row 1, 3 for row 2
    for (let col = 1; col <= 2; col++) {
      if (seats.length < totalSeats) {
        const seatNumber = `A${leftStart + col - 1}`; // A1, A2 for row 1, A3, A4 for row 2
        seats.push({
          seatNumber,
          isBooked: bookedSeats.includes(seatNumber),
          isSelected: false,
          row,
          column: col, // Column 1 or 2 (left side)
        });
      }
    }
    
    // Right side: 2 columns (B seats)
    // Row 1: B1 (col 3), B2 (col 4)
    // Row 2: B3 (col 3), B4 (col 4)
    const rightStart = (row - 1) * 2 + 1; // 1 for row 1, 3 for row 2
    for (let col = 1; col <= 2; col++) {
      if (seats.length < totalSeats) {
        const seatNumber = `B${rightStart + col - 1}`; // B1, B2 for row 1, B3, B4 for row 2
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

/**
 * Generate and download ticket as HTML/PDF
 */
export const downloadTicket = (booking: any) => {
  const schedule = booking.schedule || {};
  const bus = booking.bus || {};
  const user = booking.user || {};
  const seats = Array.isArray(booking.seats) 
    ? booking.seats 
    : typeof booking.seats === 'string' 
    ? JSON.parse(booking.seats || '[]')
    : [];

  const ticketHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bus Ticket - EasySewa</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: Arial, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    .ticket {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .ticket-header {
      background: linear-gradient(135deg, #0ea5e9, #f97316);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .ticket-header h1 {
      font-size: 28px;
      margin-bottom: 10px;
    }
    .ticket-header p {
      font-size: 14px;
      opacity: 0.9;
    }
    .ticket-body {
      padding: 30px;
    }
    .ticket-section {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px dashed #e5e7eb;
    }
    .ticket-section:last-child {
      border-bottom: none;
    }
    .ticket-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
    }
    .ticket-label {
      font-weight: 600;
      color: #666;
      font-size: 14px;
    }
    .ticket-value {
      font-size: 16px;
      color: #333;
      font-weight: 500;
    }
    .ticket-qr {
      text-align: center;
      margin: 20px 0;
      padding: 20px;
      background: #f9fafb;
      border-radius: 8px;
    }
    .ticket-qr-placeholder {
      width: 150px;
      height: 150px;
      margin: 0 auto;
      background: #e5e7eb;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
      font-size: 12px;
    }
    .ticket-footer {
      background: #f9fafb;
      padding: 20px;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    .seats-badge {
      display: inline-block;
      background: #0ea5e9;
      color: white;
      padding: 4px 12px;
      border-radius: 4px;
      margin: 2px;
      font-size: 12px;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .ticket {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="ticket-header">
      <h1>EasySewa</h1>
      <p>Your Journey, Our Commitment</p>
    </div>
    <div class="ticket-body">
      <div class="ticket-section">
        <div class="ticket-row">
          <span class="ticket-label">Booking ID:</span>
          <span class="ticket-value">${booking.id}</span>
        </div>
        <div class="ticket-row">
          <span class="ticket-label">Passenger Name:</span>
          <span class="ticket-value">${user.name || 'N/A'}</span>
        </div>
        <div class="ticket-row">
          <span class="ticket-label">Email:</span>
          <span class="ticket-value">${user.email || 'N/A'}</span>
        </div>
        ${user.phone ? `
        <div class="ticket-row">
          <span class="ticket-label">Phone:</span>
          <span class="ticket-value">${user.phone}</span>
        </div>
        ` : ''}
      </div>

      <div class="ticket-section">
        <div class="ticket-row">
          <span class="ticket-label">Bus Name:</span>
          <span class="ticket-value">${bus.busName || 'N/A'}</span>
        </div>
        <div class="ticket-row">
          <span class="ticket-label">Bus Number:</span>
          <span class="ticket-value">${bus.busNumber || 'N/A'}</span>
        </div>
        <div class="ticket-row">
          <span class="ticket-label">Bus Type:</span>
          <span class="ticket-value">${bus.busType || 'N/A'}</span>
        </div>
      </div>

      <div class="ticket-section">
        <div class="ticket-row">
          <span class="ticket-label">From:</span>
          <span class="ticket-value">${schedule.from || booking.from || 'N/A'}</span>
        </div>
        <div class="ticket-row">
          <span class="ticket-label">To:</span>
          <span class="ticket-value">${schedule.to || booking.to || 'N/A'}</span>
        </div>
        <div class="ticket-row">
          <span class="ticket-label">Date:</span>
          <span class="ticket-value">${formatDate(schedule.date || booking.date || booking.bookingDate)}</span>
        </div>
        <div class="ticket-row">
          <span class="ticket-label">Departure Time:</span>
          <span class="ticket-value">${schedule.departureTime || booking.departureTime || 'N/A'}</span>
        </div>
        ${schedule.arrivalTime ? `
        <div class="ticket-row">
          <span class="ticket-label">Arrival Time:</span>
          <span class="ticket-value">${schedule.arrivalTime}</span>
        </div>
        ` : ''}
      </div>

      <div class="ticket-section">
        <div class="ticket-row">
          <span class="ticket-label">Seats:</span>
          <span class="ticket-value">
            ${seats.length > 0 ? seats.map((seat: string) => `<span class="seats-badge">${seat}</span>`).join(' ') : 'N/A'}
          </span>
        </div>
        <div class="ticket-row">
          <span class="ticket-label">Total Amount:</span>
          <span class="ticket-value" style="font-size: 20px; color: #0ea5e9; font-weight: bold;">${formatCurrency(booking.totalAmount || 0)}</span>
        </div>
        <div class="ticket-row">
          <span class="ticket-label">Payment Status:</span>
          <span class="ticket-value">${booking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}</span>
        </div>
        <div class="ticket-row">
          <span class="ticket-label">Booking Status:</span>
          <span class="ticket-value">${booking.status === 'confirmed' ? 'Confirmed' : booking.status || 'Pending'}</span>
        </div>
      </div>

      <div class="ticket-qr">
        <div class="ticket-qr-placeholder">
          QR Code<br/>${booking.id}
        </div>
        <p style="margin-top: 10px; font-size: 12px; color: #666;">Show this ticket at the boarding point</p>
      </div>
    </div>
    <div class="ticket-footer">
      <p>&copy; ${new Date().getFullYear()} EasySewa. All rights reserved.</p>
      <p style="margin-top: 5px;">For support, contact: support@easysewa.com</p>
    </div>
  </div>
</body>
</html>
  `;

  // Create a blob and download
  const blob = new Blob([ticketHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ticket-${booking.id}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
