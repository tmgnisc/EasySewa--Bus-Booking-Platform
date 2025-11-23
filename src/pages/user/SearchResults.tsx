import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { BusCard } from '@/components/booking/BusCard';
import { SearchWidget } from '@/components/booking/SearchWidget';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { formatCurrency, parseImages, parseAmenities } from '@/utils/helpers';
import { api } from '@/lib/api';
import { Filter } from 'lucide-react';
import { toast } from 'sonner';

interface ScheduleWithBus {
  id: string;
  busId: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  price: number;
  duration: string;
  availableSeats: number;
  bus: {
    id: string;
    busName: string;
    busNumber: string;
    busType: string;
    rating: number;
    amenities: any;
    images: any;
  };
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [schedules, setSchedules] = useState<ScheduleWithBus[]>([]);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedBusTypes, setSelectedBusTypes] = useState<string[]>([]);

  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';
  const busId = searchParams.get('busId') || '';

  useEffect(() => {
    const fetchSchedules = async () => {
      setIsLoading(true);
      try {
        let response;
        
        // If busId is provided, fetch schedules for that specific bus
        if (busId) {
          response = await api.schedule.getByBus(busId);
        } 
        // Otherwise, fetch by route (from, to, date)
        else if (from && to && date) {
          response = await api.schedule.getAll({ from, to, date });
        } else {
          setIsLoading(false);
          return;
        }
        
        // Normalize bus data in schedules
        const normalizedSchedules = (response.schedules || []).map((schedule: any) => ({
          ...schedule,
          bus: schedule.bus ? {
            ...schedule.bus,
            images: parseImages(schedule.bus.images),
            amenities: parseAmenities(schedule.bus.amenities),
          } : null,
        }));

        setSchedules(normalizedSchedules);
        
        // Update price range based on available schedules
        if (normalizedSchedules.length > 0) {
          const prices = normalizedSchedules.map((s: ScheduleWithBus) => s.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          setPriceRange([Math.max(0, minPrice - 100), maxPrice + 100]);
        }
      } catch (error: any) {
        console.error('Error fetching schedules:', error);
        toast.error('Failed to load bus schedules');
        setSchedules([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, [from, to, date, busId]);

  const filteredSchedules = schedules.filter((schedule) => {
    const matchesPrice = schedule.price >= priceRange[0] && schedule.price <= priceRange[1];
    const matchesBusType =
      selectedBusTypes.length === 0 || 
      (schedule.bus && selectedBusTypes.includes(schedule.bus.busType));

    return matchesPrice && matchesBusType;
  });

  const busTypes = ['AC', 'Non-AC', 'Sleeper', 'Semi-Sleeper'];

  const handleBusTypeToggle = (busType: string) => {
    setSelectedBusTypes((prev) =>
      prev.includes(busType) ? prev.filter((t) => t !== busType) : [...prev, busType]
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Search Widget - Hide when viewing by busId */}
        {!busId && (
          <div className="mb-8">
            <SearchWidget />
          </div>
        )}

        {/* Results Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {busId 
              ? 'Bus Schedules' 
              : from && to 
                ? `${from} → ${to}` 
                : 'Search Buses'}
          </h1>
          <p className="text-muted-foreground">
            {busId 
              ? `${filteredSchedules.length} schedule${filteredSchedules.length !== 1 ? 's' : ''} available`
              : from && to && date
                ? `${filteredSchedules.length} bus${filteredSchedules.length !== 1 ? 'es' : ''} found for ${date}`
                : 'Enter your search criteria to find buses'}
          </p>
        </div>

        {isLoading ? (
          <LoadingSpinner text="Searching buses..." />
        ) : (
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Price Range */}
                  <div className="space-y-3">
                    <Label>Price Range</Label>
                    <Slider
                      min={0}
                      max={2000}
                      step={100}
                      value={priceRange}
                      onValueChange={setPriceRange}
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span>{formatCurrency(priceRange[0])}</span>
                      <span>{formatCurrency(priceRange[1])}</span>
                    </div>
                  </div>

                  {/* Bus Type */}
                  <div className="space-y-3">
                    <Label>Bus Type</Label>
                    <div className="space-y-2">
                      {busTypes.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={selectedBusTypes.includes(type)}
                            onCheckedChange={() => handleBusTypeToggle(type)}
                          />
                          <Label htmlFor={type} className="text-sm font-normal cursor-pointer">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* Results List */}
            <div className="lg:col-span-3 space-y-4">
              {filteredSchedules.length > 0 ? (
                filteredSchedules.map((schedule) => {
                  if (!schedule.bus) return null;
                  return <BusCard key={schedule.id} schedule={schedule} bus={schedule.bus} />;
                })
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">
                      {schedules.length === 0 
                        ? busId
                          ? 'No schedules available for this bus'
                          : from && to && date
                            ? 'No buses found for this route and date'
                            : 'Please enter search criteria to find buses'
                        : 'No schedules found matching your filter criteria'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {busId 
                        ? 'This bus may not have any scheduled trips yet'
                        : 'Try adjusting your filters or search for a different route'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SearchResults;
