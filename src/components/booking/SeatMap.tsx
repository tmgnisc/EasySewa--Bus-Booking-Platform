import { Seat } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded border-2 border-border bg-background"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded border-2 border-primary bg-primary"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded border-2 border-muted bg-muted"></div>
          <span>Booked</span>
        </div>
      </div>

      {/* Driver Section */}
      <div className="flex justify-end mb-4">
        <div className="w-16 h-12 rounded-t-full border-2 border-muted bg-muted/50 flex items-end justify-center pb-2">
          <span className="text-xs font-medium">Driver</span>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="space-y-3 max-w-md mx-auto">
        {Object.entries(seatRows).map(([rowNum, rowSeats]) => (
          <div key={rowNum} className="flex gap-2 justify-center">
            {rowSeats
              .sort((a, b) => a.column - b.column)
              .map((seat, idx) => (
                <div key={seat.seatNumber} className="flex gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    disabled={seat.isBooked}
                    onClick={() => !seat.isBooked && onSeatSelect(seat.seatNumber)}
                    className={cn(
                      'h-12 w-12 p-0 text-xs font-semibold transition-all',
                      seat.isBooked && 'cursor-not-allowed bg-muted border-muted',
                      seat.isSelected && 'bg-primary border-primary text-primary-foreground hover:bg-primary/90',
                      !seat.isBooked && !seat.isSelected && 'hover:border-primary hover:bg-primary/10'
                    )}
                  >
                    {seat.seatNumber}
                  </Button>
                  {/* Aisle gap after 2nd column */}
                  {idx === 1 && <div className="w-4" />}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};
