import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { dummyBuses, dummySchedules, dummyBookings } from '@/data/dummyData';
import { Bus, Calendar, DollarSign, Users } from 'lucide-react';
import { formatCurrency } from '@/utils/helpers';

const OwnerDashboard = () => {
  const { user } = useAuth();
  
  const ownerBuses = dummyBuses.filter((bus) => bus.ownerId === user?.id);
  const ownerSchedules = dummySchedules.filter((schedule) =>
    ownerBuses.some((bus) => bus.id === schedule.busId)
  );
  const ownerBookings = dummyBookings.filter((booking) =>
    ownerBuses.some((bus) => bus.id === booking.busId)
  );
  const totalRevenue = ownerBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);

  const stats = [
    {
      title: 'Total Buses',
      value: ownerBuses.length,
      icon: Bus,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Active Schedules',
      value: ownerSchedules.length,
      icon: Calendar,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Total Bookings',
      value: ownerBookings.length,
      icon: Users,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

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
          {stats.map((stat) => (
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
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {ownerBookings.length > 0 ? (
              <div className="space-y-4">
                {ownerBookings.slice(0, 5).map((booking) => (
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
                      <p className="text-sm text-muted-foreground">
                        {booking.seats.length} seat{booking.seats.length > 1 ? 's' : ''}
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
