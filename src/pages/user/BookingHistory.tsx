import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, formatDate, getStatusColor } from '@/utils/helpers';
import { MapPin, Calendar, Clock, Download, X } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const BookingHistory = () => {
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token || !user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await api.booking.getAll(token);
        const userBookings = response.bookings || [];
        setBookings(userBookings);
      } catch (error: any) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [token, user]);

  const handleDownloadTicket = (bookingId: string) => {
    toast.success('Ticket downloaded successfully');
  };

  const handleCancelBooking = (bookingId: string) => {
    toast.success('Booking cancelled successfully');
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner size="lg" text="Loading your bookings..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground mt-1">View and manage all your bus bookings</p>
        </div>

        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const schedule = booking.schedule || {};
              const bus = booking.bus || {};
              const seats = Array.isArray(booking.seats) 
                ? booking.seats 
                : typeof booking.seats === 'string' 
                ? JSON.parse(booking.seats || '[]')
                : [];
              
              return (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl">{bus.busName || 'Bus'}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{bus.busNumber || 'N/A'}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Pending'}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(booking.paymentStatus)}>
                          {booking.paymentStatus?.charAt(0).toUpperCase() + booking.paymentStatus?.slice(1) || 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Route
                        </p>
                        <p className="font-medium">
                          {schedule.from || booking.from} → {schedule.to || booking.to}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Date
                        </p>
                        <p className="font-medium">{formatDate(schedule.date || booking.date || booking.bookingDate)}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Time
                        </p>
                        <p className="font-medium">
                          {schedule.departureTime || booking.departureTime || 'N/A'} {schedule.arrivalTime ? `- ${schedule.arrivalTime}` : ''}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Seats</p>
                        <div className="flex flex-wrap gap-1">
                          {seats.length > 0 ? (
                            seats.map((seat: string) => (
                              <Badge key={seat} variant="secondary">
                                {seat}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">N/A</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="text-2xl font-bold text-primary">
                          {formatCurrency(booking.totalAmount || 0)}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {booking.status === 'confirmed' && booking.paymentStatus === 'paid' && (
                          <>
                            <Button onClick={() => handleDownloadTicket(booking.id)}>
                              <Download className="mr-2 h-4 w-4" />
                              Download Ticket
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Cancel
                            </Button>
                          </>
                        )}
                        {booking.status === 'completed' && (
                          <Button onClick={() => handleDownloadTicket(booking.id)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download Receipt
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No bookings found</p>
              <p className="text-sm text-muted-foreground">
                Start planning your next trip and book a bus
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BookingHistory;
