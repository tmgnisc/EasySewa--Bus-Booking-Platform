import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { SeatMap } from '@/components/booking/SeatMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate, generateSeats, parseImages, parseAmenities } from '@/utils/helpers';
import { MapPin, Clock, Armchair, CreditCard, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Seat } from '@/types';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const SeatSelection = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [schedule, setSchedule] = useState<any>(null);
  const [bus, setBus] = useState<any>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!scheduleId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch schedule with bus data
        const scheduleResponse = await api.schedule.getById(scheduleId);
        const scheduleData = scheduleResponse.schedule;
        setSchedule(scheduleData);
        
        if (scheduleData.bus) {
          const busData = {
            ...scheduleData.bus,
            images: parseImages(scheduleData.bus.images),
            amenities: parseAmenities(scheduleData.bus.amenities),
          };
          setBus(busData);
        }

        // Fetch booked seats
        const seatsResponse = await api.booking.getBookedSeats(scheduleId);
        const booked = seatsResponse.bookedSeats || [];
        setBookedSeats(booked);

        // Generate seats
        if (scheduleData.bus) {
          const generatedSeats = generateSeats(scheduleData.bus.totalSeats, booked);
          setSeats(generatedSeats);
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load schedule data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [scheduleId]);

  const selectedSeats = seats.filter((seat) => seat.isSelected);
  const totalAmount = schedule ? selectedSeats.length * parseFloat(schedule.price) : 0;

  const handleSeatSelect = (seatNumber: string) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seat.seatNumber === seatNumber ? { ...seat, isSelected: !seat.isSelected } : seat
      )
    );
  };

  const handleProceedToPayment = async () => {
    if (!token || !user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    if (!scheduleId) {
      toast.error('Invalid schedule');
      return;
    }

    try {
      const seatNumbers = selectedSeats.map((s) => s.seatNumber);
      await api.booking.create(
        {
          scheduleId,
          seats: seatNumbers,
        },
        token
      );

      toast.success(`Booking confirmed for seats: ${seatNumbers.join(', ')}`);
      navigate('/bookings');
    } catch (error: any) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Failed to create booking');
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading seat map...</p>
        </div>
      </MainLayout>
    );
  }

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
