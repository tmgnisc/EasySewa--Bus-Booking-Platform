import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Star, Armchair, Wifi, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Schedule, Bus } from '@/types';
import { formatCurrency, parseAmenities, parseImages } from '@/utils/helpers';

interface BusCardProps {
  schedule: Schedule;
  bus: Bus;
}

export const BusCard = ({ schedule, bus }: BusCardProps) => {
  const navigate = useNavigate();

  const handleViewSeats = () => {
    navigate(`/bus/${schedule.id}`);
  };

  // Normalize bus data
  const imagesArray = parseImages(bus.images);
  const amenitiesArray = parseAmenities(bus.amenities);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Bus Info */}
          <div className="flex-1 space-y-3">
            {imagesArray.length > 0 && (
              <div className="aspect-video rounded-md overflow-hidden mb-3">
                <img
                  src={imagesArray[0]}
                  alt={bus.busName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x225?text=Bus+Image';
                  }}
                />
              </div>
            )}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{bus.busName}</h3>
                <p className="text-sm text-muted-foreground">{bus.busNumber}</p>
              </div>
              <Badge variant="secondary">{bus.busType}</Badge>
            </div>

            {/* Route & Time */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{schedule.from}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{schedule.departureTime}</span>
              </div>
              <span className="text-muted-foreground">→</span>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{schedule.to}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{schedule.arrivalTime}</span>
              </div>
            </div>

            {/* Duration & Rating */}
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">Duration: {schedule.duration}</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-medium">{bus.rating}</span>
              </div>
            </div>

            {/* Amenities */}
            {amenitiesArray.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {amenitiesArray.slice(0, 3).map((amenity) => (
                  <Badge key={amenity} variant="outline" className="text-xs">
                    {amenity === 'WiFi' && <Wifi className="mr-1 h-3 w-3" />}
                    {amenity === 'Charging Port' && <Zap className="mr-1 h-3 w-3" />}
                    {amenity}
                  </Badge>
                ))}
                {amenitiesArray.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{amenitiesArray.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Price & CTA */}
          <div className="flex flex-row items-center justify-between gap-4 lg:flex-col lg:items-end lg:justify-center">
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{formatCurrency(schedule.price)}</p>
              <p className="text-xs text-muted-foreground">per seat</p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground text-right">
                <Armchair className="inline h-4 w-4 mr-1" />
                {schedule.availableSeats} seats available
              </p>
              <Button onClick={handleViewSeats} size="lg">
                View Seats
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
