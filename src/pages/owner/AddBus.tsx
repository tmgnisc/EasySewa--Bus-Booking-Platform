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
import { Bus, Save } from 'lucide-react';

const AddBus = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    busName: '',
    busNumber: '',
    busType: 'AC' as 'AC' | 'Non-AC' | 'Sleeper' | 'Semi-Sleeper',
    totalSeats: '',
    amenities: [] as string[],
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate
    if (!formData.busName || !formData.busNumber || !formData.totalSeats) {
      toast.error('Please fill all required fields');
      return;
    }

    toast.success('Bus added successfully!');
    navigate('/owner/buses');
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

              <div className="flex gap-2 pt-4">
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Add Bus
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
