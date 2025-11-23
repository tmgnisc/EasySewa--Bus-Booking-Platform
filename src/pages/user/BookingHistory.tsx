import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { dummyBookings } from '@/data/dummyData';
import { formatCurrency, formatDate, getStatusColor } from '@/utils/helpers';
import { MapPin, Calendar, Clock, Download, X } from 'lucide-react';
import { toast } from 'sonner';

const BookingHistory = () => {
  const { user } = useAuth();
  const userBookings = dummyBookings.filter((booking) => booking.userId === user?.id);

  const handleDownloadTicket = (bookingId: string) => {
    toast.success('Ticket downloaded successfully');
  };

  const handleCancelBooking = (bookingId: string) => {
    toast.success('Booking cancelled successfully');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground mt-1">View and manage all your bus bookings</p>
        </div>

        {userBookings.length > 0 ? (
          <div className="space-y-4">
            {userBookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">{booking.busName}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{booking.busNumber}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(booking.paymentStatus)}>
                        {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
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
                        {booking.from} → {booking.to}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date
                      </p>
                      <p className="font-medium">{formatDate(booking.date)}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Time
                      </p>
                      <p className="font-medium">
                        {booking.departureTime} - {booking.arrivalTime}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Seats</p>
                      <div className="flex flex-wrap gap-1">
                        {booking.seats.map((seat) => (
                          <Badge key={seat} variant="secondary">
                            {seat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(booking.totalAmount)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {booking.status === 'confirmed' && (
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
            ))}
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
