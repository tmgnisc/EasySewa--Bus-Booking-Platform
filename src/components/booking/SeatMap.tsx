import { Seat } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Car } from 'lucide-react';

interface SeatMapProps {
  seats: Seat[];
  onSeatSelect: (seatNumber: string) => void;
}

export const SeatMap = ({ seats, onSeatSelect }: SeatMapProps) => {
  // Group seats by row
  const seatRows: { [key: number]: Seat[] } = {};
  seats.forEach((seat) => {
    if (!seatRows[seat.row]) {
      seatRows[seat.row] = [];
    }
    seatRows[seat.row].push(seat);
  });

  // Sort rows
  const sortedRows = Object.keys(seatRows)
    .map(Number)
    .sort((a, b) => a - b);

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

      {/* Driver Indicator - Top Right */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Car className="h-6 w-6" />
          <span className="text-sm font-medium">Driver</span>
        </div>
      </div>

      {/* Seat Grid - 2x2 Layout with Aisle */}
      <div className="max-w-3xl mx-auto">
        <div className="space-y-3">
          {sortedRows.map((rowNum) => {
            const rowSeats = seatRows[rowNum].sort((a, b) => a.column - b.column);
            // Left side seats (column 1, 2)
            const leftSeats = rowSeats.filter((s) => s.column <= 2);
            // Right side seats (column 3, 4)
            const rightSeats = rowSeats.filter((s) => s.column > 2);

            return (
              <div key={rowNum} className="grid grid-cols-[1fr_1fr_auto_1fr_1fr] gap-2 items-center">
                {/* Left Side - 2 Columns */}
                <div className="flex gap-2">
                  {leftSeats.map((seat) => (
                    <Button
                      key={seat.seatNumber}
                      variant="outline"
                      size="lg"
                      disabled={seat.isBooked}
                      onClick={() => !seat.isBooked && onSeatSelect(seat.seatNumber)}
                      className={cn(
                        'h-12 w-full p-0 text-sm font-semibold transition-all',
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
                <div className="w-6 flex items-center justify-center">
                  <div className="h-8 w-0.5 bg-muted"></div>
                </div>

                {/* Right Side - 2 Columns */}
                <div className="flex gap-2">
                  {rightSeats.map((seat) => (
                    <Button
                      key={seat.seatNumber}
                      variant="outline"
                      size="lg"
                      disabled={seat.isBooked}
                      onClick={() => !seat.isBooked && onSeatSelect(seat.seatNumber)}
                      className={cn(
                        'h-12 w-full p-0 text-sm font-semibold transition-all',
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
            );
          })}
        </div>
      </div>
    </div>
  );
};
