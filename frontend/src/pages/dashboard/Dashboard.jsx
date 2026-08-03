import {
  FaCarSide,
  FaTicketAlt,
  FaCheckCircle,
  FaStar,
  FaPlus,
  FaSearch,
  FaCar,
  FaUserCheck,
  FaArrowRight,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import RideStatusChart from "../../components/dashboard/RideStatusChart";

export default function Dashboard() {

  const [stats, setStats] = useState(null);
  const [upcomingRide, setUpcomingRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  fetchDashboard();
}, []);

const fetchDashboard = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    const endpoint =
  user?.verification?.driverStatus === "approved"
    ? "/dashboard/driver"
    : "/dashboard/passenger";

    const res = await API.get(endpoint);

    if (res.data.success) {
      setStats(res.data.stats);
      
    }

    const rideRes = await API.get("/dashboard/upcoming");

if (rideRes.data.success) {
  setUpcomingRide(rideRes.data.ride);
}

const activityRes = await API.get("/dashboard/activity");

if (activityRes.data.success) {
  setActivities(activityRes.data.activities);
}

  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Failed to load dashboard."
    );
  } finally {
    setLoading(false);
  }
};

  if (loading) {
  return (
    <div className="flex h-[70vh] items-center justify-center">
      <h2 className="text-xl font-semibold">
        Loading Dashboard...
      </h2>
    </div>
  );
}

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Welcome Back 👋
          </h1>

          <p className="mt-2 text-slate-500">
            Here's what's happening with your account today.
          </p>
        </div>

        <button
  onClick={() => navigate("/rides/create")}
  className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow transition hover:bg-blue-700"
>
  + Publish Ride
</button>

      </div>

      {/* Statistics */}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

  <StatCard
    title="Published Rides"
    value={
      stats?.totalRides ??
      stats?.totalBookings ??
      0
    }
    color="bg-blue-500"
    icon={<FaCarSide />}
  />

  <StatCard
    title="Scheduled"
    value={
      stats?.scheduledRides ??
      stats?.acceptedBookings ??
      0
    }
    color="bg-green-500"
    icon={<FaTicketAlt />}
  />

  <StatCard
    title="Completed"
    value={
      stats?.completedRides ??
      stats?.completedTrips ??
      0
    }
    color="bg-purple-500"
    icon={<FaCheckCircle />}
  />

  <StatCard
    title={
      stats?.totalPassengers !== undefined
        ? "Passengers"
        : "Spent"
    }
    value={
      stats?.totalPassengers ??
      `Rs ${stats?.totalSpent ?? 0}`
    }
    color="bg-yellow-500"
    icon={<FaStar />}
  />

</div>

<div className="grid gap-6 lg:grid-cols-2">

  <RideStatusChart
    completed={
      stats?.completedRides ??
      stats?.completedTrips ??
      0
    }
    scheduled={
      stats?.scheduledRides ??
      stats?.acceptedBookings ??
      0
    }
    cancelled={
      stats?.cancelledRides ??
      stats?.cancelledBookings ??
      0
    }
  />

</div>

      {/* Quick Actions */}

      <div>

        <h2 className="mb-5 text-xl font-bold text-slate-800">
          Quick Actions
        </h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

         <ActionCard
    icon={<FaPlus />}
    title="Publish Ride"
    text="Offer seats for your next trip."
    onClick={() => navigate("/rides/create")}
/>

<ActionCard
    icon={<FaSearch />}
    title="Find Ride"
    text="Search rides posted by students."
    onClick={() => navigate("/rides")}
/>

<ActionCard
    icon={<FaCar />}
    title="My Vehicle"
    text="Manage your registered vehicle."
    onClick={() => navigate("/vehicle")}
/>

<ActionCard
    icon={<FaUserCheck />}
    title="Verification"
    text="Complete your verification."
    onClick={() => navigate("/verification")}
/>

        </div>

      </div>

      {/* Bottom Section */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Upcoming Ride */}

        <div className="rounded-3xl bg-white p-6 shadow-lg">

  <div className="mb-5 flex items-center justify-between">

    <h2 className="text-xl font-bold">
      Upcoming Ride
    </h2>

    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
      {upcomingRide ? upcomingRide.status : "No Ride"}
    </span>

  </div>

  {upcomingRide ? (

    <div className="space-y-5">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            Pickup
          </p>

          <h3 className="font-semibold">
            {upcomingRide.pickup.address}
          </h3>

          <p className="text-sm text-slate-500 mt-2">
  Driver:
  <span className="font-semibold ml-1">
    {upcomingRide.driver?.name}
  </span>
</p>

<p className="text-sm text-slate-500">
  {upcomingRide.driver?.rollNumber}
</p>

        </div>

        <FaArrowRight className="text-slate-400" />

        <div className="text-right">

          <p className="text-sm text-slate-500">
            Destination
          </p>

          <h3 className="font-semibold">
            {upcomingRide.destination.address}
          </h3>

        </div>

      </div>

      <hr />

      <div className="flex justify-between">

        <div>

          <p className="text-sm text-slate-500">
            Date
          </p>

          <h3 className="font-semibold">
            {new Date(
              upcomingRide.departureTime
            ).toLocaleDateString()}
          </h3>

        </div>

        <div>

          <p className="text-sm text-slate-500">
            Time
          </p>

          <h3 className="font-semibold">
            {new Date(
              upcomingRide.departureTime
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </h3>

        </div>

      </div>

    </div>

  ) : (

    <div className="py-10 text-center text-slate-500">

      No upcoming ride found.

    </div>

  )}

</div>

        {/* Recent Activity */}

        <div className="rounded-3xl bg-white p-6 shadow-lg">

          <h2 className="mb-5 text-xl font-bold">
            Recent Activity
          </h2>

          <div className="space-y-4">

            {activities.length > 0 ? (
  activities.map((activity, index) => (
    <Activity
      key={index}
      title={activity.title}
      time={new Date(activity.time).toLocaleString()}
    />
  ))
) : (
  <p className="text-center text-slate-500">
    No recent activity.
  </p>
)}
          </div>

        </div>

      </div>

    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>

        </div>

        <div className={`${color} rounded-2xl p-4 text-2xl text-white`}>
          {icon}
        </div>

      </div>

    </div>
  );
}

function ActionCard({ icon, title, text, onClick }) {
  return (
    <button
  onClick={onClick}
  className="rounded-3xl bg-white p-6 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
>

      <div className="mb-4 inline-flex rounded-2xl bg-blue-100 p-4 text-2xl text-blue-600">
        {icon}
      </div>

      <h3 className="text-lg font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {text}
      </p>

    </button>
  );
}

function Activity({ title, time }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border p-4">

      <div>

        <h3 className="font-semibold">
          {title}
        </h3>

        <p className="text-sm text-slate-500">
          {time}
        </p>

      </div>

    </div>
  );
}