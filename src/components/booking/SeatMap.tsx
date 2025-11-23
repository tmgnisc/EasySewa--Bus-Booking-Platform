import { Seat } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SteeringWheel } from 'lucide-react';

interface SeatMapProps {
  seats: Seat[];
  onSeatSelect: (seatNumber: string) => void;
}

export const SeatMap = ({ seats, onSeatSelect }: SeatMapProps) => {
  // Group seats by row and column
  const leftColumnSeats = seats.filter((seat) => seat.column === 1).sort((a, b) => a.row - b.row);
  const rightColumnSeats = seats.filter((seat) => seat.column === 2).sort((a, b) => a.row - b.row);
  const maxRows = Math.max(leftColumnSeats.length, rightColumnSeats.length);

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded border-2 border-border bg-background"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded border-2 border-green-500 bg-green-500"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded border-2 border-muted bg-muted"></div>
          <span>Booked</span>
        </div>
      </div>

      {/* Steering Wheel (Front of Bus) - Top Right */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <SteeringWheel className="h-6 w-6" />
          <span className="text-sm font-medium">Front</span>
        </div>
      </div>

      {/* Seat Grid - 2 Columns with Aisle */}
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4">
          {/* Left Column */}
          <div className="space-y-2">
            {leftColumnSeats.map((seat) => (
              <Button
                key={seat.seatNumber}
                variant="outline"
                size="lg"
                disabled={seat.isBooked}
                onClick={() => !seat.isBooked && onSeatSelect(seat.seatNumber)}
                className={cn(
                  'w-full h-12 p-0 text-sm font-semibold transition-all',
                  seat.isBooked && 'cursor-not-allowed bg-muted border-muted text-muted-foreground',
                  seat.isSelected && 'bg-green-500 border-green-500 text-white hover:bg-green-600',
                  !seat.isBooked && !seat.isSelected && 'hover:border-primary hover:bg-primary/10'
                )}
              >
                {seat.seatNumber}
              </Button>
            ))}
          </div>

          {/* Aisle */}
          <div className="w-8 flex items-center justify-center">
            <div className="h-full w-0.5 bg-muted"></div>
          </div>

          {/* Right Column */}
          <div className="space-y-2">
            {rightColumnSeats.map((seat) => (
              <Button
                key={seat.seatNumber}
                variant="outline"
                size="lg"
                disabled={seat.isBooked}
                onClick={() => !seat.isBooked && onSeatSelect(seat.seatNumber)}
                className={cn(
                  'w-full h-12 p-0 text-sm font-semibold transition-all',
                  seat.isBooked && 'cursor-not-allowed bg-muted border-muted text-muted-foreground',
                  seat.isSelected && 'bg-green-500 border-green-500 text-white hover:bg-green-600',
                  !seat.isBooked && !seat.isSelected && 'hover:border-primary hover:bg-primary/10'
                )}
              >
                {seat.seatNumber}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
