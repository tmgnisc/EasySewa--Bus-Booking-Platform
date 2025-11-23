import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { MapPin, Clock, Armchair, CreditCard, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { loadStripe } from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

// Initialize Stripe
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
if (!stripePublishableKey) {
  console.warn('Stripe publishable key is not set. Please add VITE_STRIPE_PUBLISHABLE_KEY to your .env file in the frontend root directory.');
  console.warn('Note: After adding the key, you must restart your Vite dev server for changes to take effect.');
}
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

interface PaymentPageProps {
  bookingId: string;
  amount: number;
  schedule: any;
  bus: any;
  seats: string[];
}

const PaymentForm = ({ bookingId, amount, schedule, bus, seats }: PaymentPageProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/bookings`,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Confirm payment on backend
        try {
          await api.payment.confirm(paymentIntent.id, bookingId, token!);
          setPaymentSuccess(true);
          toast.success('Payment successful!');
          
          setTimeout(() => {
            navigate('/bookings');
          }, 2000);
        } catch (error: any) {
          console.error('Error confirming payment:', error);
          toast.error('Payment succeeded but failed to update booking');
        }
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-muted-foreground">Your booking has been confirmed.</p>
          <p className="text-sm text-muted-foreground mt-2">Redirecting to bookings...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Pay {formatCurrency(amount)}
          </>
        )}
      </Button>
    </form>
  );
};

const Payment = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    const initializePayment = async () => {
      if (!token || !user) {
        toast.error('Please login to continue');
        navigate('/login');
        return;
      }

      if (!bookingId) {
        toast.error('Invalid booking');
        navigate('/search');
        return;
      }

      setIsLoading(true);
      
      // Get booking data from location state or fetch it
      const stateData = location.state;
      let bookingInfo = null;
      let paymentAmount = 0;

      if (stateData?.booking && stateData?.amount) {
        bookingInfo = stateData.booking;
        paymentAmount = stateData.amount;
      } else {
        // Fetch booking data
        try {
          const bookingResponse = await api.booking.getById(bookingId, token);
          bookingInfo = bookingResponse.booking;
          paymentAmount = parseFloat(bookingResponse.booking.totalAmount);
        } catch (error: any) {
          console.error('Error fetching booking:', error);
          toast.error('Failed to load booking');
          navigate('/bookings');
          return;
        }
      }

      // Ensure seats is always an array
      if (bookingInfo.seats) {
        if (typeof bookingInfo.seats === 'string') {
          try {
            bookingInfo.seats = JSON.parse(bookingInfo.seats);
          } catch {
            bookingInfo.seats = [];
          }
        } else if (!Array.isArray(bookingInfo.seats)) {
          bookingInfo.seats = [];
        }
      } else {
        bookingInfo.seats = [];
      }

      setBookingData(bookingInfo);
      
      try {
        // Create payment intent
        const response = await api.payment.createIntent(
          {
            amount: paymentAmount,
            bookingId: bookingId,
            currency: 'inr',
          },
          token
        );
        
        setClientSecret(response.clientSecret);
      } catch (error: any) {
        console.error('Error creating payment intent:', error);
        toast.error('Failed to initialize payment');
        navigate('/bookings');
      } finally {
        setIsLoading(false);
      }
    };

    initializePayment();
  }, [bookingId, token, user, navigate, location]);

  if (isLoading || !clientSecret) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading payment...</p>
        </div>
      </MainLayout>
    );
  }

  if (!bookingData) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Booking not found</h1>
          <Button onClick={() => navigate('/bookings')}>Back to Bookings</Button>
        </div>
      </MainLayout>
    );
  }

  const schedule = bookingData.schedule || {};
  const bus = bookingData.bus || {};
  // Ensure seats is always an array
  const seats = Array.isArray(bookingData.seats) 
    ? bookingData.seats 
    : (typeof bookingData.seats === 'string' 
      ? JSON.parse(bookingData.seats || '[]') 
      : []);
  const amount = parseFloat(bookingData.totalAmount);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
                <CardDescription>Complete your booking by making the payment</CardDescription>
              </CardHeader>
              <CardContent>
                {stripePromise ? (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: 'stripe',
                      },
                    }}
                  >
                    <PaymentForm
                      bookingId={bookingId!}
                      amount={amount}
                      schedule={schedule}
                      bus={bus}
                      seats={seats}
                    />
                  </Elements>
                ) : (
                  <div className="py-8 text-center space-y-4">
                    <p className="text-destructive mb-4 font-semibold">Stripe is not configured.</p>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p>Please add the following to your <code className="bg-muted px-2 py-1 rounded">.env</code> file in the frontend root directory:</p>
                      <code className="block bg-muted p-3 rounded text-left">
                        VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
                      </code>
                      <p className="mt-2">After adding the key, restart your Vite dev server.</p>
                      <p className="text-xs">Current value: {import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? 'Set (but may be empty)' : 'Not found'}</p>
                    </div>
                    <Button onClick={() => navigate('/bookings')}>Back to Bookings</Button>
                  </div>
                )}
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
                    <span className="text-muted-foreground">→</span>
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
                  <div className="flex flex-wrap gap-2">
                    {seats.map((seat: string) => (
                      <Badge key={seat} variant="default">
                        {seat}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Seat Price</span>
                    <span>{formatCurrency(parseFloat(schedule.price || 0))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Number of Seats</span>
                    <span>{seats.length}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span className="text-primary">{formatCurrency(amount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Payment;

