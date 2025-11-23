import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { Loader2, MapPin, Clock, Armchair, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const OwnerBookings = () => {
  const { token } = useAuth();
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

  if (isLoading) {
    return (
      <DashboardLayout requiredRole="owner">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="owner">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground mt-1">View all bookings for your buses</p>
        </div>

        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {booking.user?.name || booking.userName || 'N/A'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {booking.user?.email || booking.userEmail || 'N/A'}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge
                            variant={
                              booking.paymentStatus === 'paid'
                                ? 'default'
                                : booking.paymentStatus === 'pending'
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            {booking.paymentStatus || 'pending'}
                          </Badge>
                          <Badge
                            variant={
                              booking.status === 'confirmed'
                                ? 'default'
                                : booking.status === 'cancelled'
                                ? 'destructive'
                                : 'outline'
                            }
                          >
                            {booking.status || 'confirmed'}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>
                            <span className="font-medium">{booking.schedule?.from || booking.from || 'N/A'}</span>
                            <span className="mx-2">→</span>
                            <span className="font-medium">{booking.schedule?.to || booking.to || 'N/A'}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {formatDate(booking.schedule?.date || booking.date || '')} •{' '}
                            {booking.schedule?.departureTime || booking.departureTime || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Armchair className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Seats: {Array.isArray(booking.seats) ? booking.seats.join(', ') : booking.seats || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold text-primary">
                            {formatCurrency(parseFloat(booking.totalAmount || 0))}
                          </span>
                        </div>
                      </div>

                      {booking.bus && (
                        <div className="pt-2 border-t">
                          <p className="text-sm">
                            <span className="text-muted-foreground">Bus: </span>
                            <span className="font-medium">{booking.bus.busName}</span>
                            <span className="text-muted-foreground ml-2">({booking.bus.busNumber})</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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

export default OwnerBookings;

