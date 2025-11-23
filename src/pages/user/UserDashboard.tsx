import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { dummyBookings } from '@/data/dummyData';
import { Search, History, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '@/utils/helpers';

const UserDashboard = () => {
  const { user } = useAuth();
  
  const userBookings = dummyBookings.filter((booking) => booking.userId === user?.id);
  const upcomingBookings = userBookings.filter((booking) => booking.status === 'confirmed');

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
                  <h3 className="text-3xl font-bold mt-1">{userBookings.length}</h3>
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
                {upcomingBookings.slice(0, 3).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <h4 className="font-semibold">{booking.busName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {booking.from} → {booking.to}
                      </p>
                      <p className="text-sm">
                        {formatDate(booking.date)} • {booking.departureTime}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Seats</p>
                        <p className="font-semibold">{booking.seats.join(', ')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-bold text-primary">{formatCurrency(booking.totalAmount)}</p>
                      </div>
                    </div>
                  </div>
                ))}
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
