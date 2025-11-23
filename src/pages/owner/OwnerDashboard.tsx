import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Bus, Calendar, DollarSign, Users, Loader2, Eye } from 'lucide-react';
import { formatCurrency } from '@/utils/helpers';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const OwnerDashboard = () => {
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBuses: 0,
    activeSchedules: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        // Fetch buses
        const busesResponse = await api.bus.getByOwner(token);
        const buses = busesResponse.buses || [];
        
        // Fetch bookings
        const bookingsResponse = await api.booking.getAll(token);
        const bookings = bookingsResponse.bookings || [];
        
        // Filter bookings for owner's buses
        const busIds = buses.map((b: any) => b.id);
        const ownerBookings = bookings.filter((b: any) => busIds.includes(b.busId));
        
        // Calculate stats
        const totalRevenue = ownerBookings
          .filter((b: any) => b.paymentStatus === 'paid')
          .reduce((sum: number, b: any) => sum + parseFloat(b.totalAmount || 0), 0);
        
        setStats({
          totalBuses: buses.length,
          activeSchedules: 0, // Can be calculated if needed
          totalBookings: ownerBookings.length,
          totalRevenue,
        });
        
        setRecentBookings(ownerBookings.slice(0, 5));
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const statsData = [
    {
      title: 'Total Buses',
      value: stats.totalBuses,
      icon: Bus,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Active Schedules',
      value: stats.activeSchedules,
      icon: Calendar,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Users,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

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
          <h1 className="text-3xl font-bold">Owner Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your buses, schedules, and bookings
          </p>
        </div>

        {user?.isEmailVerified === false && (
          <Card className="border-warning bg-warning/10">
            <CardContent className="pt-6">
              <p className="font-medium">Email Verification Required</p>
              <p className="text-sm text-muted-foreground mt-1">
                Please verify your email address to continue. Check your inbox for the verification link.
              </p>
            </CardContent>
          </Card>
        )}

        {user?.isEmailVerified && user?.isApproved === false && (
          <Card className="border-warning bg-warning/10">
            <CardContent className="pt-6">
              <p className="font-medium">Account Pending Approval</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your account is under review by admin. You'll receive an email notification once approved.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  </div>
                  <div className={`rounded-full ${stat.bgColor} p-3`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Bookings</CardTitle>
            <Link to="/owner/bookings">
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{booking.user?.name || booking.userName || 'N/A'}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.bus?.busName || booking.busName || 'N/A'} • {booking.schedule?.from || booking.from || 'N/A'} → {booking.schedule?.to || booking.to || 'N/A'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={booking.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                          {booking.paymentStatus || 'pending'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">
                        {formatCurrency(parseFloat(booking.totalAmount || 0))}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {Array.isArray(booking.seats) ? booking.seats.length : 0} seat{Array.isArray(booking.seats) && booking.seats.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No bookings yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default OwnerDashboard;
