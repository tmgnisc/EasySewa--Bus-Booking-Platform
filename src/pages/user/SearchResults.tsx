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
import { dummySchedules, dummyBuses } from '@/data/dummyData';
import { formatCurrency } from '@/utils/helpers';
import { Filter } from 'lucide-react';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedBusTypes, setSelectedBusTypes] = useState<string[]>([]);

  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 800);
  }, [searchParams]);

  const filteredSchedules = dummySchedules.filter((schedule) => {
    const matchesRoute = schedule.from === from && schedule.to === to;
    const matchesDate = schedule.date === date;
    const bus = dummyBuses.find((b) => b.id === schedule.busId);
    const matchesPrice = schedule.price >= priceRange[0] && schedule.price <= priceRange[1];
    const matchesBusType =
      selectedBusTypes.length === 0 || (bus && selectedBusTypes.includes(bus.busType));

    return matchesRoute && matchesDate && matchesPrice && matchesBusType;
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
        {/* Search Widget */}
        <div className="mb-8">
          <SearchWidget />
        </div>

        {/* Results Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {from} → {to}
          </h1>
          <p className="text-muted-foreground">
            {filteredSchedules.length} bus{filteredSchedules.length !== 1 ? 'es' : ''} found for {date}
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
                  const bus = dummyBuses.find((b) => b.id === schedule.busId)!;
                  return <BusCard key={schedule.id} schedule={schedule} bus={bus} />;
                })
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">
                      No buses found matching your criteria
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your filters or search for a different route
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
