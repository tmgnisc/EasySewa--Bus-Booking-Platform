import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Loader2, MapPin, Calendar, Clock, User, Bus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { formatCurrency, formatDate, getStatusColor } from '@/utils/helpers';

const ManageBookings = () => {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) return;

      try {
        const response = await api.booking.getAll(token);
        setBookings(response.bookings || []);
      } catch (error: any) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.bus?.busName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.schedule?.from?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.schedule?.to?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <DashboardLayout requiredRole="admin">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">All Bookings</h1>
            <p className="text-muted-foreground mt-1">
              View and manage all bookings on the platform
            </p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredBookings.length > 0 ? (
          <div className="grid gap-4">
            {filteredBookings.map((booking) => {
              const schedule = booking.schedule || {};
              const bus = booking.bus || {};
              const user = booking.user || {};
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
                          <User className="h-4 w-4" />
                          Passenger
                        </p>
                        <p className="font-medium">{user.name || 'N/A'}</p>
                        <p className="text-xs text-muted-foreground">{user.email || 'N/A'}</p>
                        {user.phone && (
                          <p className="text-xs text-muted-foreground">{user.phone}</p>
                        )}
                      </div>

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
                          Date & Time
                        </p>
                        <p className="font-medium">
                          {formatDate(schedule.date || booking.date || booking.bookingDate)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {schedule.departureTime || booking.departureTime || 'N/A'}
                          {schedule.arrivalTime ? ` - ${schedule.arrivalTime}` : ''}
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
                        <p className="text-xs text-muted-foreground mt-1">
                          Booking ID: {booking.id}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Booked on: {formatDate(booking.bookingDate || booking.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Bus className="h-3 w-3" />
                          {bus.busType || 'N/A'}
                        </Badge>
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
              <p className="text-muted-foreground">No bookings found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageBookings;

