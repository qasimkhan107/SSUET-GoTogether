import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminLayout from "../layouts/AdminLayout";

import AdminDashboard from "../pages/admin/Dashboard";
import Verifications from "../pages/admin/Verifications";
import VerificationDetails from "../pages/admin/VerificationDetails";
import Users from "../pages/admin/Users";
import UserDetails from "../pages/admin/UserDetails";
import AdminProfile from "../pages/admin/Profile";
import AdminSettings from "../pages/admin/Settings";
import ChangePassword from "../pages/admin/ChangePassword";
import Rides from "../pages/admin/Rides";
import RideDetails from "../pages/admin/RideDetails";
import AdminNotifications from "../pages/admin/AdminNotifications";

import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyOTP from "../pages/auth/VerifyOTP";
import ResetPassword from "../pages/auth/ResetPassword";

import Dashboard from "../pages/dashboard/Dashboard";
import Profile from "../pages/profile/Profile";
import Vehicle from "../pages/vehicle/Vehicle";
import Verification from "../pages/verification/Verification";

import CreateRide from "../pages/rides/CreateRide";
import MyRides from "../pages/rides/MyRides";
import FindRide from "../pages/rides/FindRide";
import Settings from "../pages/settings/Settings";


import MyBookings from "../pages/bookings/MyBookings";
import Notifications from "../pages/notifications/Notifications";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Student Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/vehicle" element={<Vehicle />} />
        <Route path="/verification" element={<Verification />} />

        <Route path="/rides" element={<FindRide />} />
        <Route path="/rides/create" element={<CreateRide />} />
        <Route path="/my-rides" element={<MyRides />} />
        <Route path="/my-bookings" element={<MyBookings />}/>
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Admin Routes */}
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/verifications"
          element={<Verifications />}
        />

        <Route
          path="/admin/verification/:id"
          element={<VerificationDetails />}
        />

        <Route
          path="/admin/notifications"
          element={<AdminNotifications />}
        />

        <Route
          path="/admin/users"
          element={<Users />}
        />

        <Route
          path="/admin/users/:id"
          element={<UserDetails />}
        />

        <Route
          path="/admin/rides"
          element={<Rides />}
        />

        <Route
          path="/admin/rides/:id"
          element={<RideDetails />}
        />

        <Route
  path="/admin/profile"
  element={<AdminProfile />}
/>

<Route
  path="/admin/settings"
  element={<AdminSettings />}
/>

<Route
  path="/admin/change-password"
  element={<ChangePassword />}
/>

      </Route>
    </Routes>
  );
}