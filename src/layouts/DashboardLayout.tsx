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
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
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
