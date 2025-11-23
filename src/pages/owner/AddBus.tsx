import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Bus, Save, Loader2, Upload, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { cities } from '@/data/dummyData';

const AddBus = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [busImages, setBusImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    busName: '',
    busNumber: '',
    busType: 'AC' as 'AC' | 'Non-AC' | 'Sleeper' | 'Semi-Sleeper',
    totalSeats: '',
    amenities: [] as string[],
    // Route fields
    from: '',
    to: '',
    // Timing fields
    departureTime: '',
    arrivalTime: '',
    date: '',
    price: '',
    duration: '',
  });

  const amenitiesList = ['WiFi', 'Charging Port', 'Water Bottle', 'Blanket', 'Pillow', 'Reading Light'];

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file types and size
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Add to state
    setBusImages([...busImages, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setBusImages(busImages.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const calculateDuration = (departure: string, arrival: string) => {
    if (!departure || !arrival) return '';
    
    const [depHour, depMin] = departure.split(':').map(Number);
    const [arrHour, arrMin] = arrival.split(':').map(Number);
    
    let totalMinutes = (arrHour * 60 + arrMin) - (depHour * 60 + depMin);
    if (totalMinutes < 0) totalMinutes += 24 * 60; // Handle next day
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  };

  const handleTimeChange = (field: 'departureTime' | 'arrivalTime', value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // Auto-calculate duration
      if (updated.departureTime && updated.arrivalTime) {
        updated.duration = calculateDuration(updated.departureTime, updated.arrivalTime);
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Please login to add a bus');
      navigate('/login');
      return;
    }

    // Validate required fields
    if (!formData.busName || !formData.busNumber || !formData.totalSeats) {
      toast.error('Please fill all required bus fields');
      return;
    }

    if (!formData.from || !formData.to) {
      toast.error('Please select route (from and to locations)');
      return;
    }

    if (!formData.departureTime || !formData.arrivalTime || !formData.date || !formData.price) {
      toast.error('Please fill all route timing and pricing fields');
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData for bus creation
      const busFormData = new FormData();
      busFormData.append('busName', formData.busName);
      busFormData.append('busNumber', formData.busNumber);
      busFormData.append('busType', formData.busType);
      busFormData.append('totalSeats', formData.totalSeats);
      busFormData.append('amenities', JSON.stringify(formData.amenities));

      // Add images
      busImages.forEach((image) => {
        busFormData.append('images', image);
      });

      // Create bus first
      const busResponse = await api.bus.create(busFormData, token);
      const busId = busResponse.bus.id;

      // Create schedule for the bus
      const scheduleData = {
        busId,
        from: formData.from,
        to: formData.to,
        departureTime: formData.departureTime,
        arrivalTime: formData.arrivalTime,
        date: formData.date,
        price: parseFloat(formData.price),
        duration: formData.duration || calculateDuration(formData.departureTime, formData.arrivalTime),
      };

      await api.schedule.create(scheduleData, token);

      toast.success('Bus and schedule added successfully!');
      navigate('/owner/buses');
    } catch (error: any) {
      console.error('Error adding bus:', error);
      toast.error(error.message || 'Failed to add bus. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout requiredRole="owner">
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Add New Bus</h1>
          <p className="text-muted-foreground mt-1">Add a new bus to your fleet</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bus Details</CardTitle>
            <CardDescription>Fill in the information about your bus</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="busName">Bus Name *</Label>
                <Input
                  id="busName"
                  placeholder="e.g., Luxury Express"
                  value={formData.busName}
                  onChange={(e) => setFormData({ ...formData, busName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="busNumber">Bus Number *</Label>
                <Input
                  id="busNumber"
                  placeholder="e.g., MH-12-AB-1234"
                  value={formData.busNumber}
                  onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="busType">Bus Type *</Label>
                <Select
                  value={formData.busType}
                  onValueChange={(value: any) => setFormData({ ...formData, busType: value })}
                >
                  <SelectTrigger id="busType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AC">AC</SelectItem>
                    <SelectItem value="Non-AC">Non-AC</SelectItem>
                    <SelectItem value="Sleeper">Sleeper</SelectItem>
                    <SelectItem value="Semi-Sleeper">Semi-Sleeper</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalSeats">Total Seats *</Label>
                <Input
                  id="totalSeats"
                  type="number"
                  min="1"
                  max="60"
                  placeholder="e.g., 40"
                  value={formData.totalSeats}
                  onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 gap-3">
                  {amenitiesList.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onCheckedChange={() => handleAmenityToggle(amenity)}
                      />
                      <Label htmlFor={amenity} className="text-sm font-normal cursor-pointer">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="busImages">Bus Images (Optional)</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-4">
                  <input
                    id="busImages"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <label
                    htmlFor="busImages"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload bus images
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      PNG, JPG up to 5MB each
                    </span>
                  </label>
                </div>
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Bus preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Route Section */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-semibold">Route Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from">From *</Label>
                    <Select
                      value={formData.from}
                      onValueChange={(value) => setFormData({ ...formData, from: value })}
                    >
                      <SelectTrigger id="from">
                        <SelectValue placeholder="Select origin" />
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

                  <div className="space-y-2">
                    <Label htmlFor="to">To *</Label>
                    <Select
                      value={formData.to}
                      onValueChange={(value) => setFormData({ ...formData, to: value })}
                    >
                      <SelectTrigger id="to">
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.filter(city => city !== formData.from).map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="departureTime">Departure Time *</Label>
                    <Input
                      id="departureTime"
                      type="time"
                      value={formData.departureTime}
                      onChange={(e) => handleTimeChange('departureTime', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="arrivalTime">Arrival Time *</Label>
                    <Input
                      id="arrivalTime"
                      type="time"
                      value={formData.arrivalTime}
                      onChange={(e) => handleTimeChange('arrivalTime', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      placeholder="Auto-calculated"
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price per Seat (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g., 500"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Bus...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Add Bus
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/owner/buses')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AddBus;
