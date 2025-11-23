import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Mail, Phone, Check, X, Loader2, Trash2, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
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

const ManageOwners = () => {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [owners, setOwners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOwners = async () => {
      if (!token) return;

      try {
        const response = await api.admin.getOwners(token);
        setOwners(response.owners || []);
      } catch (error: any) {
        console.error('Error fetching owners:', error);
        toast.error('Failed to load bus owners');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwners();
  }, [token]);

  const filteredOwners = owners.filter(
    (owner) =>
      owner.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = async (ownerId: string, isApproved: boolean) => {
    if (!token) return;

    setProcessingId(ownerId);
    try {
      const response = await api.admin.updateOwnerStatus(token, ownerId, isApproved);
      toast.success(response.message || (isApproved ? 'Owner approved successfully' : 'Owner approval revoked'));
      
      // Update local state
      setOwners(owners.map(owner => 
        owner.id === ownerId 
          ? { ...owner, isApproved } 
          : owner
      ));
    } catch (error: any) {
      console.error('Error updating owner status:', error);
      toast.error(error.message || 'Failed to update owner status');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (ownerId: string) => {
    if (!token) return;

    setProcessingId(ownerId);
    try {
      await api.admin.deleteUser(token, ownerId);
      toast.success('Owner deleted successfully');
      
      // Remove from local state
      setOwners(owners.filter(owner => owner.id !== ownerId));
    } catch (error: any) {
      console.error('Error deleting owner:', error);
      toast.error(error.message || 'Failed to delete owner');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Manage Bus Owners</h1>
            <p className="text-muted-foreground mt-1">
              Approve or reject bus owner applications
            </p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search owners..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredOwners.map((owner) => (
              <Card key={owner.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold">{owner.name}</h3>
                        {owner.isEmailVerified ? (
                          <Badge variant="default" className="bg-success">
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-warning text-warning-foreground">
                            Not Verified
                          </Badge>
                        )}
                        {owner.isApproved ? (
                          <Badge variant="default" className="bg-success">
                            Approved
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-warning text-warning-foreground">
                            Pending Approval
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {owner.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {owner.phone}
                        </div>
                        <div>Registered: {new Date(owner.createdAt).toLocaleDateString()}</div>
                        {(owner.busPhoto || owner.busDocument) && (
                          <div className="flex gap-4 mt-2">
                            {owner.busPhoto && (
                              <a
                                href={owner.busPhoto}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-primary hover:underline"
                              >
                                <ImageIcon className="h-4 w-4" />
                                Bus Photo
                              </a>
                            )}
                            {owner.busDocument && (
                              <a
                                href={owner.busDocument}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-primary hover:underline"
                              >
                                <ImageIcon className="h-4 w-4" />
                                Bus Document
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!owner.isApproved && owner.isEmailVerified && (
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-success hover:bg-success/90"
                          onClick={() => handleApprove(owner.id, true)}
                          disabled={processingId === owner.id}
                        >
                          {processingId === owner.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="mr-2 h-4 w-4" />
                          )}
                          Approve
                        </Button>
                      )}
                      {owner.isApproved && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApprove(owner.id, false)}
                          disabled={processingId === owner.id}
                        >
                          {processingId === owner.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <X className="mr-2 h-4 w-4" />
                          )}
                          Revoke
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={processingId === owner.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the bus owner account. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(owner.id)}
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
        )}

        {filteredOwners.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No bus owners found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageOwners;
