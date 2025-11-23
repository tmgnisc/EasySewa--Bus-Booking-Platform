import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { dummyBuses } from '@/data/dummyData';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const ManageBuses = () => {
  const { user } = useAuth();
  const ownerBuses = dummyBuses.filter((bus) => bus.ownerId === user?.id);

  const handleDelete = (busId: string) => {
    toast.success('Bus deleted successfully');
  };

  return (
    <DashboardLayout requiredRole="owner">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Buses</h1>
            <p className="text-muted-foreground mt-1">Manage your fleet of buses</p>
          </div>
          <Link to="/owner/add-bus">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Bus
            </Button>
          </Link>
        </div>

        {ownerBuses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {ownerBuses.map((bus) => (
              <Card key={bus.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{bus.busName}</h3>
                        <p className="text-sm text-muted-foreground">{bus.busNumber}</p>
                      </div>
                      <Badge variant="secondary">{bus.busType}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Seats</p>
                        <p className="font-medium">{bus.totalSeats}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rating</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-warning text-warning" />
                          <span className="font-medium">{bus.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Amenities</p>
                      <div className="flex flex-wrap gap-2">
                        {bus.amenities.map((amenity) => (
                          <Badge key={amenity} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Button variant="outline" className="flex-1">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleDelete(bus.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No buses added yet</p>
              <Link to="/owner/add-bus">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Bus
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageBuses;
