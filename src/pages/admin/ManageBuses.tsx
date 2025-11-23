import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Bus, Loader2, MapPin, Users, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { formatCurrency, parseImages, parseAmenities } from '@/utils/helpers';

const ManageBuses = () => {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [buses, setBuses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBuses = async () => {
      if (!token) return;

      try {
        const response = await api.bus.getAll(token);
        setBuses(response.buses || []);
      } catch (error: any) {
        console.error('Error fetching buses:', error);
        toast.error('Failed to load buses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuses();
  }, [token]);

  const filteredBuses = buses.filter(
    (bus) =>
      bus.busName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.busNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.owner?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <DashboardLayout requiredRole="admin">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">All Buses</h1>
            <p className="text-muted-foreground mt-1">
              View and manage all buses on the platform
            </p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search buses..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredBuses.length > 0 ? (
          <div className="grid gap-4">
            {filteredBuses.map((bus) => {
              const imagesArray = parseImages(bus.images);
              const amenitiesArray = parseAmenities(bus.amenities);

              return (
                <Card key={bus.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Bus Image */}
                      <div className="flex-shrink-0">
                        {imagesArray.length > 0 ? (
                          <img
                            src={imagesArray[0]}
                            alt={bus.busName}
                            className="w-32 h-32 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/128x128?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
                            <Bus className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Bus Details */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <div className="flex items-center gap-3 flex-wrap mb-2">
                            <h3 className="text-xl font-semibold">{bus.busName}</h3>
                            <Badge variant="secondary">{bus.busType}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {bus.busNumber}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{bus.totalSeats} seats</span>
                            </div>
                            {bus.rating > 0 && (
                              <div className="flex items-center gap-1">
                                <span>⭐</span>
                                <span>{parseFloat(bus.rating).toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Owner Info */}
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Owner:</span>
                          <span className="font-medium">{bus.owner?.name || 'N/A'}</span>
                          <span className="text-muted-foreground">({bus.owner?.email || 'N/A'})</span>
                        </div>

                        {/* Amenities */}
                        {amenitiesArray.length > 0 && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Amenities:</p>
                            <div className="flex flex-wrap gap-2">
                              {amenitiesArray.map((amenity, idx) => (
                                <Badge key={idx} variant="outline">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Additional Images */}
                        {imagesArray.length > 1 && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">More Images:</p>
                            <div className="flex gap-2 flex-wrap">
                              {imagesArray.slice(1, 4).map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt={`${bus.busName} ${idx + 2}`}
                                  className="w-20 h-20 object-cover rounded-md"
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/80x80?text=No+Image';
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No buses found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageBuses;

