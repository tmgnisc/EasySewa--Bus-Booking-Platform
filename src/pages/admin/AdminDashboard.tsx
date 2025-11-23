import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Bus, TrendingUp, DollarSign, Clock, Loader2, Eye } from 'lucide-react';
import { formatCurrency } from '@/utils/helpers';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [buses, setBuses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBuses, setIsLoadingBuses] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        // Fetch analytics
        const analyticsData = await api.admin.getAnalytics(token);
        setAnalytics(analyticsData);
        
        // Fetch buses
        const busesData = await api.bus.getAll(token);
        setBuses(busesData.buses || []);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
        setIsLoadingBuses(false);
      }
    };

    fetchData();
  }, [token]);

  const stats = analytics ? [
    {
      title: 'Total Revenue',
      value: formatCurrency(analytics.totalRevenue || 0),
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success/10',
      trend: '+12.5%',
    },
    {
      title: 'Total Users',
      value: analytics.totalUsers || 0,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      trend: '+8.2%',
    },
    {
      title: 'Bus Owners',
      value: analytics.totalBusOwners || 0,
      icon: Shield,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      trend: '+5.4%',
    },
    {
      title: 'Total Buses',
      value: analytics.totalBuses || 0,
      icon: Bus,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      trend: '+15.3%',
    },
  ] : [];

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
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of the entire EasySewa platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="h-3 w-3 text-success" />
                      <span className="text-xs text-success">{stat.trend}</span>
                    </div>
                  </div>
                  <div className={`rounded-full ${stat.bgColor} p-3`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{analytics?.totalBookings || 0}</p>
                  <p className="text-sm text-muted-foreground">All time bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Users</span>
                  <span className="font-medium">{analytics?.totalUsers || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Bus Owners</span>
                  <span className="font-medium">{analytics?.totalBusOwners || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Buses</span>
                  <span className="font-medium">{analytics?.totalBuses || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics?.recentBookings && analytics.recentBookings.length > 0 ? (
              <div className="space-y-4">
                {analytics.recentBookings.slice(0, 5).map((booking: any) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{booking.user?.name || booking.userName || 'N/A'}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.bus?.busName || booking.busName || 'N/A'} • {booking.schedule?.from || booking.from} → {booking.schedule?.to || booking.to}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">
                        {formatCurrency(booking.totalAmount || 0)}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">{booking.status || 'N/A'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No recent bookings</p>
            )}
          </CardContent>
        </Card>

        {/* All Buses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>All Buses</CardTitle>
            <Link to="/admin/buses">
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoadingBuses ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : buses.length > 0 ? (
              <div className="space-y-4">
                {buses.slice(0, 5).map((bus: any) => (
                  <div
                    key={bus.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      {bus.images && bus.images.length > 0 && (
                        <img
                          src={bus.images[0]}
                          alt={bus.busName}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      )}
                      <div>
                        <p className="font-medium">{bus.busName}</p>
                        <p className="text-sm text-muted-foreground">{bus.busNumber}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{bus.busType}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {bus.totalSeats} seats
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Owner</p>
                      <p className="font-medium text-sm">{bus.owner?.name || 'N/A'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No buses found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
