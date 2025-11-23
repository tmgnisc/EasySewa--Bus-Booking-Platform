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
