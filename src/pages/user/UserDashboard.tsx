import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Search, History, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate, parseAmenities } from '@/utils/helpers';
import { api } from '@/lib/api';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const UserDashboard = () => {
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [token, user]);

  const upcomingBookings = bookings.filter((booking) => 
    booking.status === 'confirmed' && booking.paymentStatus === 'paid'
  );

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
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground mt-1">Manage your bookings and plan your next trip</p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-primary/50 hover:border-primary transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Quick Action</p>
                  <h3 className="text-lg font-bold mt-1">Search Buses</h3>
                  <p className="text-sm text-muted-foreground mt-1">Find your next journey</p>
                  <Link to="/search">
                    <Button className="mt-4" size="sm">
                      Search Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="rounded-full bg-primary/10 p-3">
                  <Search className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                  <h3 className="text-3xl font-bold mt-1">{bookings.length}</h3>
                  <Link to="/bookings">
                    <Button variant="link" className="px-0 mt-2" size="sm">
                      View All
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="rounded-full bg-accent/10 p-3">
                  <History className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Upcoming Trips</p>
                  <h3 className="text-3xl font-bold mt-1">{upcomingBookings.length}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Active bookings</p>
                </div>
                <div className="rounded-full bg-success/10 p-3">
                  <Clock className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Bookings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Bookings</CardTitle>
              <Link to="/bookings">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.slice(0, 3).map((booking) => {
                  const seats = Array.isArray(booking.seats) 
                    ? booking.seats 
                    : typeof booking.seats === 'string' 
                    ? JSON.parse(booking.seats || '[]')
                    : [];
                  const schedule = booking.schedule || {};
                  const bus = booking.bus || {};
                  
                  return (
                    <div
                      key={booking.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <h4 className="font-semibold">{bus.busName || 'Bus'}</h4>
                        <p className="text-sm text-muted-foreground">
                          {schedule.from || booking.from} → {schedule.to || booking.to}
                        </p>
                        <p className="text-sm">
                          {formatDate(schedule.date || booking.date)} • {schedule.departureTime || booking.departureTime}
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0 flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Seats</p>
                          <p className="font-semibold">{seats.join(', ') || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Amount</p>
                          <p className="font-bold text-primary">{formatCurrency(booking.totalAmount || 0)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No upcoming bookings</p>
                <Link to="/search">
                  <Button>
                    <Search className="mr-2 h-4 w-4" />
                    Search Buses
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
