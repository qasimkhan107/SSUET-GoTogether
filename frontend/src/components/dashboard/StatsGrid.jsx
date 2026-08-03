import {
  FaCar,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaUsers,
  FaMoneyBillWave,
} from "react-icons/fa";

import StatCard from "./StatCard";

export default function StatsGrid({ stats, driver }) {
  if (!stats) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

      <StatCard
        title={driver ? "Total Rides" : "Total Bookings"}
        value={driver ? stats.totalRides : stats.totalBookings}
        icon={<FaCar />}
        color="bg-blue-600"
      />

      <StatCard
        title="Completed"
        value={driver ? stats.completedRides : stats.completedTrips}
        icon={<FaCheckCircle />}
        color="bg-green-600"
      />

      <StatCard
        title={driver ? "Scheduled" : "Pending"}
        value={driver ? stats.scheduledRides : stats.pendingBookings}
        icon={<FaClock />}
        color="bg-yellow-500"
      />

      <StatCard
        title="Cancelled"
        value={
          driver
            ? stats.cancelledRides
            : stats.cancelledBookings
        }
        icon={<FaTimesCircle />}
        color="bg-red-600"
      />

      {driver ? (
        <>
          <StatCard
            title="Passengers"
            value={stats.totalPassengers}
            icon={<FaUsers />}
            color="bg-indigo-600"
          />

          <StatCard
            title="Earnings"
            value={`PKR ${stats.totalEarnings}`}
            icon={<FaMoneyBillWave />}
            color="bg-emerald-600"
          />
        </>
      ) : (
        <>
          <StatCard
            title="Accepted"
            value={stats.acceptedBookings}
            icon={<FaCheckCircle />}
            color="bg-cyan-600"
          />

          <StatCard
            title="Total Spent"
            value={`PKR ${stats.totalSpent}`}
            icon={<FaMoneyBillWave />}
            color="bg-emerald-600"
          />
        </>
      )}

    </div>
  );
}