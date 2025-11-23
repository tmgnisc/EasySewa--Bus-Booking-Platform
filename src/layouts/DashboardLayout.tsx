import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';
import { DashboardSidebar } from '@/components/common/DashboardSidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  requiredRole?: 'user' | 'owner' | 'admin';
}

export const DashboardLayout = ({ children, requiredRole }: DashboardLayoutProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Check if owner is verified and approved
  if (requiredRole === 'owner' && user?.role === 'owner') {
    if (!user.isEmailVerified) {
      return (
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <div className="flex flex-1 items-center justify-center p-6">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold mb-2">Email Verification Required</h2>
              <p className="text-muted-foreground mb-4">
                Please verify your email address to access the owner dashboard. Check your inbox for the verification link.
              </p>
            </div>
          </div>
        </div>
      );
    }
    if (!user.isApproved) {
      return (
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <div className="flex flex-1 items-center justify-center p-6">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold mb-2">Account Pending Approval</h2>
              <p className="text-muted-foreground mb-4">
                Your account is under review by admin. You'll receive an email notification once approved.
              </p>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-6 lg:p-8 bg-muted/30">
          <div className="container mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
