import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

// Pages
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";

// User Pages
import UserDashboard from "./pages/user/UserDashboard";
import SearchResults from "./pages/user/SearchResults";
import SeatSelection from "./pages/user/SeatSelection";
import BookingHistory from "./pages/user/BookingHistory";
import Profile from "./pages/user/Profile";
import Payment from "./pages/user/Payment";

// Owner Pages
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import ManageBuses from "./pages/owner/ManageBuses";
import AddBus from "./pages/owner/AddBus";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageOwners from "./pages/admin/ManageOwners";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            
            {/* User Routes */}
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/bus/:scheduleId" element={<SeatSelection />} />
            <Route path="/payment/:bookingId" element={<Payment />} />
            <Route path="/bookings" element={<BookingHistory />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Owner Routes */}
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            <Route path="/owner/buses" element={<ManageBuses />} />
            <Route path="/owner/add-bus" element={<AddBus />} />
            <Route path="/owner/schedules" element={<OwnerDashboard />} />
            <Route path="/owner/bookings" element={<OwnerDashboard />} />
            <Route path="/owner/revenue" element={<OwnerDashboard />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/owners" element={<ManageOwners />} />
            <Route path="/admin/buses" element={<AdminDashboard />} />
            <Route path="/admin/bookings" element={<AdminDashboard />} />
            <Route path="/admin/analytics" element={<AdminDashboard />} />
            <Route path="/admin/settings" element={<AdminDashboard />} />
            
            {/* 404 - Catch All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
