import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { SeatMap } from '@/components/booking/SeatMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { dummySchedules, dummyBuses, generateSeats } from '@/data/dummyData';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { MapPin, Clock, Armchair, CreditCard, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Seat } from '@/types';

const SeatSelection = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();

  const schedule = dummySchedules.find((s) => s.id === scheduleId);
  const bus = schedule ? dummyBuses.find((b) => b.id === schedule.busId) : null;

  const [seats, setSeats] = useState<Seat[]>(
    bus ? generateSeats(bus.totalSeats, ['A1', 'A2', 'B3', 'C4']) : []
  );

  const selectedSeats = seats.filter((seat) => seat.isSelected);
  const totalAmount = schedule ? selectedSeats.length * schedule.price : 0;

  const handleSeatSelect = (seatNumber: string) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seat.seatNumber === seatNumber ? { ...seat, isSelected: !seat.isSelected } : seat
      )
    );
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    toast.success(`Booking confirmed for seats: ${selectedSeats.map((s) => s.seatNumber).join(', ')}`);
    navigate('/bookings');
  };

  if (!schedule || !bus) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Schedule not found</h1>
          <Button onClick={() => navigate('/search')}>Back to Search</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Results
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Seat Selection */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Select Your Seats</CardTitle>
              </CardHeader>
              <CardContent>
                <SeatMap seats={seats} onSeatSelect={handleSeatSelect} />
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Bus Details */}
                <div>
                  <h3 className="font-semibold text-lg">{bus.busName}</h3>
                  <p className="text-sm text-muted-foreground">{bus.busNumber}</p>
                  <Badge variant="secondary" className="mt-2">
                    {bus.busType}
                  </Badge>
                </div>

                <Separator />

                {/* Route Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{schedule.from}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{schedule.to}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {formatDate(schedule.date)} • {schedule.departureTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>Duration: {schedule.duration}</span>
                  </div>
                </div>

                <Separator />

                {/* Selected Seats */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Armchair className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Selected Seats</span>
                  </div>
                  {selectedSeats.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.map((seat) => (
                        <Badge key={seat.seatNumber} variant="default">
                          {seat.seatNumber}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No seats selected</p>
                  )}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Seat Price</span>
                    <span>{formatCurrency(schedule.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Number of Seats</span>
                    <span>{selectedSeats.length}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span className="text-primary">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleProceedToPayment}
                  disabled={selectedSeats.length === 0}
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Proceed to Payment
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By proceeding, you agree to our terms and conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SeatSelection;
