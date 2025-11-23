import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { cities } from '@/data/dummyData';
import { getTomorrowDate } from '@/utils/helpers';

export const SearchWidget = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: getTomorrowDate(),
    passengers: '1',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchParams.from && searchParams.to && searchParams.date) {
      navigate(
        `/search?from=${searchParams.from}&to=${searchParams.to}&date=${searchParams.date}&passengers=${searchParams.passengers}`
      );
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardContent className="p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* From */}
            <div className="space-y-2">
              <Label htmlFor="from" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                From
              </Label>
              <Select
                value={searchParams.from}
                onValueChange={(value) => setSearchParams({ ...searchParams, from: value })}
              >
                <SelectTrigger id="from">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* To */}
            <div className="space-y-2">
              <Label htmlFor="to" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                To
              </Label>
              <Select
                value={searchParams.to}
                onValueChange={(value) => setSearchParams({ ...searchParams, to: value })}
              >
                <SelectTrigger id="to">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.filter((city) => city !== searchParams.from).map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                min={getTomorrowDate()}
                value={searchParams.date}
                onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
              />
            </div>

            {/* Passengers */}
            <div className="space-y-2">
              <Label htmlFor="passengers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Passengers
              </Label>
              <Select
                value={searchParams.passengers}
                onValueChange={(value) => setSearchParams({ ...searchParams, passengers: value })}
              >
                <SelectTrigger id="passengers">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'Passenger' : 'Passengers'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full md:w-auto" size="lg">
            <Search className="mr-2 h-5 w-5" />
            Search Buses
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
