import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Plus, Edit, Trash2, Star, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const ManageBuses = () => {
  const { user, token } = useAuth();
  const [buses, setBuses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBuses = async () => {
      if (!token) return;

      try {
        const response = await api.bus.getByOwner(token);
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

  const handleDelete = async (busId: string) => {
    if (!token) return;

    setDeletingId(busId);
    try {
      await api.bus.delete(busId, token);
      toast.success('Bus deleted successfully');
      // Remove from local state
      setBuses(buses.filter(bus => bus.id !== busId));
    } catch (error: any) {
      console.error('Error deleting bus:', error);
      toast.error(error.message || 'Failed to delete bus');
    } finally {
      setDeletingId(null);
    }
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

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : buses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {buses.map((bus) => (
              <Card key={bus.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {bus.images && bus.images.length > 0 && (
                      <div className="aspect-video rounded-md overflow-hidden mb-4">
                        <img
                          src={bus.images[0]}
                          alt={bus.busName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
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
                          <span className="font-medium">{bus.rating || '0.0'}</span>
                        </div>
                      </div>
                    </div>

                    {bus.amenities && bus.amenities.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Amenities</p>
                        <div className="flex flex-wrap gap-2">
                          {bus.amenities.map((amenity: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4 border-t">
                      <Button variant="outline" className="flex-1" disabled>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            className="flex-1"
                            disabled={deletingId === bus.id}
                          >
                            {deletingId === bus.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="mr-2 h-4 w-4" />
                            )}
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the bus and all its schedules. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(bus.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
