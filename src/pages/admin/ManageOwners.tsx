import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dummyUsers } from '@/data/dummyData';
import { Search, Mail, Phone, Check, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const ManageOwners = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const owners = dummyUsers.filter((user) => user.role === 'owner');

  const filteredOwners = owners.filter(
    (owner) =>
      owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = (ownerId: string) => {
    toast.success('Bus owner approved successfully');
  };

  const handleReject = (ownerId: string) => {
    toast.success('Bus owner rejected');
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

        <div className="grid gap-4">
          {filteredOwners.map((owner) => (
            <Card key={owner.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{owner.name}</h3>
                      {owner.isApproved ? (
                        <Badge variant="default" className="bg-success">
                          Approved
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-warning text-warning-foreground">
                          Pending
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
                      <div>Registered: {owner.createdAt}</div>
                    </div>
                  </div>
                  {!owner.isApproved && (
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-success hover:bg-success/90"
                        onClick={() => handleApprove(owner.id)}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleReject(owner.id)}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
