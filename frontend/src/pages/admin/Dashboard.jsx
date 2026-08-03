import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/admin/dashboard");

      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to load dashboard."
      );
    }
  };

  if (!stats) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading...
        </h2>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        Admin Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="text-slate-500">Total Users</h3>
          <p className="mt-2 text-3xl font-bold">
            {stats.totalUsers}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="text-slate-500">Total Rides</h3>
          <p className="mt-2 text-3xl font-bold">
            {stats.totalRides}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="text-slate-500">Total Bookings</h3>
          <p className="mt-2 text-3xl font-bold">
            {stats.totalBookings}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="text-slate-500">Pending Verifications</h3>
          <p className="mt-2 text-3xl font-bold">
            {stats.pendingDrivers + stats.pendingPassengers}
          </p>
        </div>

      </div>
    </div>
  );
}