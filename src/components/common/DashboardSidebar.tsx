import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  History,
  User,
  Bus,
  Calendar,
  DollarSign,
  Users,
  Settings,
  BarChart3,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export const DashboardSidebar = () => {
  const { user } = useAuth();

  const getUserLinks = () => {
    return [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/search', icon: Search, label: 'Search Buses' },
      { to: '/bookings', icon: History, label: 'My Bookings' },
      { to: '/profile', icon: User, label: 'Profile' },
    ];
  };

  const getOwnerLinks = () => {
    return [
      { to: '/owner/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/owner/buses', icon: Bus, label: 'My Buses' },
      { to: '/owner/add-bus', icon: Bus, label: 'Add Bus' },
      { to: '/owner/schedules', icon: Calendar, label: 'Schedules' },
      { to: '/owner/bookings', icon: History, label: 'Bookings' },
      { to: '/owner/revenue', icon: DollarSign, label: 'Revenue' },
      { to: '/profile', icon: User, label: 'Profile' },
    ];
  };

  const getAdminLinks = () => {
    return [
      { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/admin/users', icon: Users, label: 'Users' },
      { to: '/admin/owners', icon: Shield, label: 'Bus Owners' },
      { to: '/admin/buses', icon: Bus, label: 'All Buses' },
      { to: '/admin/bookings', icon: History, label: 'All Bookings' },
      { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
      { to: '/admin/settings', icon: Settings, label: 'Settings' },
    ];
  };

  const getLinks = () => {
    switch (user?.role) {
      case 'owner':
        return getOwnerLinks();
      case 'admin':
        return getAdminLinks();
      default:
        return getUserLinks();
    }
  };

  const links = getLinks();

  return (
    <aside className="hidden lg:block w-64 border-r bg-background">
      <nav className="flex flex-col gap-2 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
