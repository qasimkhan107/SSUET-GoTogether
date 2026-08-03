import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../../services/api";
import toast from "react-hot-toast";

export default function UserDetails() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/admin/users/${id}`);

      if (res.data.success) {
        setUser(res.data.user);
        setVehicle(res.data.vehicle);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load user."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async () => {
    try {
      const url = user.isBlocked
        ? `/admin/users/${id}/unblock`
        : `/admin/users/${id}/block`;

      const res = await API.put(url);

      toast.success(res.data.message);

      fetchUser();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Action failed."
      );
    }
  };

  const badge = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading...
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <Link
        to="/admin/users"
        className="text-blue-600 hover:underline"
      >
        ← Back to Users
      </Link>

      <div className="rounded-3xl bg-white p-8 shadow-lg">

        <h1 className="mb-8 text-3xl font-bold">
          User Details
        </h1>

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Profile */}

          <div className="rounded-2xl border p-6">

            <h2 className="mb-5 text-xl font-semibold">
              Profile
            </h2>

            <div className="space-y-3">

              <p><strong>Name:</strong> {user.name}</p>

              <p><strong>Email:</strong> {user.email}</p>

              <p><strong>Roll No:</strong> {user.rollNumber}</p>

              <p><strong>Phone:</strong> {user.phone || "-"}</p>

              <p><strong>Department:</strong> {user.department || "-"}</p>

              <p><strong>Gender:</strong> {user.gender}</p>

              <p><strong>Bio:</strong> {user.bio || "-"}</p>

              <p>
                <strong>Emergency Contact:</strong>{" "}
                {user.emergencyContact || "-"}
              </p>

            </div>

          </div>

          {/* Status */}

          <div className="rounded-2xl border p-6">

            <h2 className="mb-5 text-xl font-semibold">
              Account Status
            </h2>

            <div className="space-y-5">

              <div>
                <p className="mb-1 font-medium">
                  Role
                </p>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">
                  {user.role}
                </span>
              </div>

              <div>
                <p className="mb-1 font-medium">
                  Passenger Verification
                </p>

                <span
                  className={`rounded-full px-3 py-1 ${badge(
                    user.verification.passengerStatus
                  )}`}
                >
                  {user.verification.passengerStatus}
                </span>
              </div>

              <div>
                <p className="mb-1 font-medium">
                  Driver Verification
                </p>

                <span
                  className={`rounded-full px-3 py-1 ${badge(
                    user.verification.driverStatus
                  )}`}
                >
                  {user.verification.driverStatus}
                </span>
              </div>

              <div>
                <p className="mb-1 font-medium">
                  Account
                </p>

                <span
                  className={`rounded-full px-3 py-1 ${
                    user.isBlocked
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {user.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* Stats */}

        <div className="mt-6 grid gap-6 md:grid-cols-2">

          <div className="rounded-2xl border p-6 text-center">

            <h3 className="text-lg font-semibold">
              Rating
            </h3>

            <p className="mt-3 text-4xl font-bold text-blue-600">
              {user.rating}
            </p>

          </div>

          <div className="rounded-2xl border p-6 text-center">

            <h3 className="text-lg font-semibold">
              Total Trips
            </h3>

            <p className="mt-3 text-4xl font-bold text-blue-600">
              {user.totalTrips}
            </p>

          </div>

        </div>

        {/* Vehicle */}

        <div className="mt-6 rounded-2xl border p-6">

          <h2 className="mb-5 text-xl font-semibold">
            Vehicle Information
          </h2>

          {vehicle ? (
            <div className="grid gap-3 md:grid-cols-2">

              <p><strong>Type:</strong> {vehicle.vehicleType}</p>

              <p><strong>Brand:</strong> {vehicle.brand}</p>

              <p><strong>Model:</strong> {vehicle.model}</p>

              <p><strong>Color:</strong> {vehicle.color}</p>

              <p><strong>Registration:</strong> {vehicle.registrationNumber}</p>

              <p><strong>Fuel:</strong> {vehicle.fuelType}</p>

              <p><strong>Seats:</strong> {vehicle.seatsAvailable}</p>

            </div>
          ) : (
            <p className="text-slate-500">
              No vehicle registered.
            </p>
          )}

        </div>

        {/* Action */}

        <div className="mt-8">

          <button
            onClick={toggleBlock}
            className={`rounded-xl px-6 py-3 font-semibold text-white ${
              user.isBlocked
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {user.isBlocked ? "Unblock User" : "Block User"}
          </button>

        </div>

      </div>

    </div>
  );
}