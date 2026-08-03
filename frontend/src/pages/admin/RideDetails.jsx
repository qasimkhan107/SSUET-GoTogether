import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";
import toast from "react-hot-toast";

export default function RideDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRide();
  }, []);

  const fetchRide = async () => {
    try {
      const res = await API.get(`/admin/rides/${id}`);

      if (res.data.success) {
        setRide(res.data.ride);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load ride."
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelRide = async () => {
  if (!window.confirm("Cancel this ride?")) return;

  try {
    const res = await API.put(`/admin/rides/${id}/cancel`);

    if (res.data.success) {
      toast.success(res.data.message);
      fetchRide();
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Failed to cancel ride."
    );
  }
};

const deleteRide = async () => {
  if (
    !window.confirm(
      "Delete this ride permanently?"
    )
  )
    return;

  try {
    const res = await API.delete(
      `/admin/rides/${id}`
    );

    if (res.data.success) {
      toast.success(res.data.message);

      setTimeout(() => {
        navigate("/admin/rides");
      }, 1000);
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Failed to delete ride."
    );
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

  if (!ride) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-lg">
        Ride not found.
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg">

      <button
        onClick={() => navigate("/admin/rides")}
        className="mb-6 rounded-lg bg-slate-200 px-4 py-2 hover:bg-slate-300"
      >
        ← Back to Rides
      </button>

      <h1 className="mb-8 text-3xl font-bold">
        Ride Details
      </h1>

      <div className="grid gap-6 md:grid-cols-2">

  <div className="rounded-2xl border p-6">
    <h2 className="mb-4 text-xl font-bold">
      Ride Information
    </h2>

    <div className="space-y-3">

      <p>
        <strong>Status:</strong>{" "}
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            ride.status === "scheduled"
              ? "bg-blue-100 text-blue-700"
              : ride.status === "ongoing"
              ? "bg-yellow-100 text-yellow-700"
              : ride.status === "completed"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {ride.status}
        </span>
      </p>

      <p>
        <strong>Departure:</strong><br />
        {new Date(
          ride.departureTime
        ).toLocaleString()}
      </p>

      <p>
        <strong>Fare:</strong> PKR {ride.pricePerSeat}
      </p>

      <p>
        <strong>Seats:</strong>{" "}
        {ride.bookedSeats}/{ride.availableSeats}
      </p>

    </div>

  </div>

  <div className="rounded-2xl border p-6">

    <h2 className="mb-4 text-xl font-bold">
      Driver
    </h2>

    <div className="space-y-3">

      <p>
        <strong>Name:</strong> {ride.driver?.name}
      </p>

      <p>
        <strong>Email:</strong> {ride.driver?.email}
      </p>

      <p>
        <strong>Roll No:</strong> {ride.driver?.rollNumber}
      </p>

    </div>

  </div>

</div>

<div className="mt-8 grid gap-6 md:grid-cols-2">

  <div className="rounded-2xl border p-6">

    <h2 className="mb-3 text-xl font-bold">
      Pickup
    </h2>

    <p>{ride.pickup?.address}</p>

  </div>

  <div className="rounded-2xl border p-6">

    <h2 className="mb-3 text-xl font-bold">
      Destination
    </h2>

    <p>{ride.destination?.address}</p>

  </div>

</div>

<div className="mt-8 rounded-2xl border p-6">

  <h2 className="mb-4 text-xl font-bold">
    Vehicle
  </h2>

  <div className="grid gap-4 md:grid-cols-3">

    <p>
      <strong>Brand:</strong>{" "}
      {ride.vehicle?.brand}
    </p>

    <p>
      <strong>Model:</strong>{" "}
      {ride.vehicle?.model}
    </p>

    <p>
      <strong>Registration:</strong>{" "}
      {ride.vehicle?.registrationNumber}
    </p>

  </div>

</div>

<div className="mt-8 rounded-2xl border p-6">

  <h2 className="mb-4 text-xl font-bold">
    Ride Preferences
  </h2>

  <div className="grid gap-4 md:grid-cols-2">

    <p>
      Smoking:
      <strong>
        {" "}
        {ride.preferences?.smoking ? "Yes" : "No"}
      </strong>
    </p>

    <p>
      Pets:
      <strong>
        {" "}
        {ride.preferences?.pets ? "Yes" : "No"}
      </strong>
    </p>

    <p>
      Luggage:
      <strong>
        {" "}
        {ride.preferences?.luggage ? "Allowed" : "Not Allowed"}
      </strong>
    </p>

    <p>
      Gender Preference:
      <strong>
        {" "}
        {ride.preferences?.genderPreference}
      </strong>
    </p>

  </div>

</div>

{ride.notes && (
  <div className="mt-8 rounded-2xl border p-6">

    <h2 className="mb-4 text-xl font-bold">
      Notes
    </h2>

    <p>{ride.notes}</p>

  </div>
)}

<div className="mt-8 rounded-2xl border p-6">

  <h2 className="mb-5 text-xl font-bold">
    Passengers
  </h2>

  {ride.passengers?.length === 0 ? (
    <p className="text-slate-500">
      No passengers have booked this ride yet.
    </p>
  ) : (
    <div className="overflow-x-auto">

      <table className="min-w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="px-4 py-3 text-left">
              Name
            </th>

            <th className="px-4 py-3 text-left">
              Roll Number
            </th>

            <th className="px-4 py-3 text-left">
              Email
            </th>

            <th className="px-4 py-3 text-left">
              Phone
            </th>

          </tr>

        </thead>

        <tbody>

          {ride.passengers.map((passenger) => (

            <tr
              key={passenger._id}
              className="border-b"
            >

              <td className="px-4 py-3">
                {passenger.name}
              </td>

              <td className="px-4 py-3">
                {passenger.rollNumber}
              </td>

              <td className="px-4 py-3">
                {passenger.email}
              </td>

              <td className="px-4 py-3">
                {passenger.phone || "-"}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  )}

</div>

    </div>
  );
}