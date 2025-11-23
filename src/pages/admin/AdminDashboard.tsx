import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dummyAnalytics } from '@/data/dummyData';
import { Users, Shield, Bus, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { formatCurrency } from '@/utils/helpers';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(dummyAnalytics.totalRevenue),
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success/10',
      trend: '+12.5%',
    },
    {
      title: 'Total Users',
      value: dummyAnalytics.totalUsers,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      trend: '+8.2%',
    },
    {
      title: 'Bus Owners',
      value: dummyAnalytics.totalBusOwners,
      icon: Shield,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      trend: '+5.4%',
    },
    {
      title: 'Total Buses',
      value: dummyAnalytics.totalBuses,
      icon: Bus,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      trend: '+15.3%',
    },
  ];

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
                  <p className="text-3xl font-bold">{dummyAnalytics.totalBookings}</p>
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
                  <span className="text-sm text-muted-foreground">Active Users</span>
                  <span className="font-medium">{Math.floor(dummyAnalytics.totalUsers * 0.7)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Owners</span>
                  <span className="font-medium">{Math.floor(dummyAnalytics.totalBusOwners * 0.85)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Available Buses</span>
                  <span className="font-medium">{Math.floor(dummyAnalytics.totalBuses * 0.9)}</span>
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
            <div className="space-y-4">
              {dummyAnalytics.recentBookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{booking.userName}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.busName} • {booking.from} → {booking.to}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      {formatCurrency(booking.totalAmount)}
                    </p>
                    <p className="text-sm text-muted-foreground">{booking.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
