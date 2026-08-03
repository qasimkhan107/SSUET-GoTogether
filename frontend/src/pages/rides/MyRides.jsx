import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import {
  FaChair,
  FaCar,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaEye,
  FaEdit,
  FaUsers,
  FaCheck,
  FaTrash,
} from "react-icons/fa";

export default function MyRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRide, setEditingRide] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingRideId, setBookingRideId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
  fetchMyRides();
}, []);

useEffect(() => {
  rides.forEach((ride) => {
    if (
      ride.status === "scheduled" &&
      new Date(ride.departureTime) < new Date()
    ) {
      completeRide(ride._id, true);
    }
  });
}, [rides]);

  const cancelRide = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this ride?")) {
      return;
    }

    try {
      const res = await API.delete(`/rides/${id}`);

      if (res.data.success) {
        toast.success(res.data.message);

        setRides((prev) =>
          prev.map((ride) =>
            ride._id === id ? res.data.ride : ride
          )
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to cancel ride."
      );
    }
  };

 const completeRide = async (id, auto = false) => {
  if (!auto) {
    if (!window.confirm("Mark this ride as completed?")) {
      return;
    }
  }

  try {
    const res = await API.put(`/rides/${id}/complete`);

    if (res.data.success) {

      fetchMyRides();

      toast.success(
        auto
          ? "Ride completed automatically."
          : res.data.message
      );

      setRides((prev) =>
        prev.map((ride) =>
          ride._id === id ? res.data.ride : ride
        )
      );
    }
  } catch (error) {
    console.log(error);
  }
};

  const viewRide = async (id) => {
    try {
      const res = await API.get(`/rides/${id}`);

      if (res.data.success) {
        setSelectedRide(res.data.ride);
        setShowModal(true);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to load ride details."
      );
    }
  };

  const openEditModal = (ride) => {
    setEditingRide(ride);

    reset({
      pickup: ride.pickup.address,
      destination: ride.destination.address,
      departureTime: ride.departureTime
        ? new Date(ride.departureTime)
            .toISOString()
            .slice(0, 16)
        : "",
      availableSeats: ride.availableSeats,
      pricePerSeat: ride.pricePerSeat,
      notes: ride.notes || "",
    });

    setShowEditModal(true);
  };

  const updateRide = async (data) => {
    try {
      const rideData = {
        pickup: {
          address: data.pickup,
          location: {
            coordinates: [67.0011, 24.8607],
          },
        },

        destination: {
          address: data.destination,
          location: {
            coordinates: [67.1200, 24.9200],
          },
        },

        departureTime: data.departureTime,
        availableSeats: Number(data.availableSeats),
        pricePerSeat: Number(data.pricePerSeat),
        notes: data.notes,

        preferences: editingRide.preferences,
      };

      const res = await API.put(
        `/rides/${editingRide._id}`,
        rideData
      );

      if (res.data.success) {
        toast.success(res.data.message);

        setRides((prev) =>
          prev.map((ride) =>
            ride._id === editingRide._id
              ? res.data.ride
              : ride
          )
        );

        setShowEditModal(false);
        setEditingRide(null);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update ride."
      );
    }
  };

  const fetchMyRides = async () => {
    try {
      const res = await API.get("/rides/my-rides");

      if (res.data.success) {
        setRides(res.data.rides);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load rides."
      );
    } finally {
      setLoading(false);
    }
  };

  const acceptBooking = async (id) => {
  try {
    const res = await API.put(`/bookings/${id}/accept`);

    toast.success(res.data.message);

    fetchBookings(bookingRideId);
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
};

const rejectBooking = async (id) => {
  try {
    const res = await API.put(`/bookings/${id}/reject`);

    toast.success(res.data.message);

    fetchBookings(bookingRideId);
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
};

 const fetchBookings = async (rideId) => {
  try {
    const res = await API.get(`/bookings/ride/${rideId}`);

    if (res.data.success) {
      setBookings(res.data.bookings);
      setBookingRideId(rideId);
      setShowBookings(true);
    }
  } catch (error) {
    toast.error("Failed to load bookings");
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
      <h1 className="text-3xl font-bold text-slate-800">
        My Rides
      </h1>

      {rides.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
          <h2 className="text-2xl font-semibold">
            No rides published yet.
          </h2>

          <p className="mt-2 text-slate-500">
            Publish your first ride to start carpooling.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {rides.map((ride) => (
            <div
              key={ride._id}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-xl"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                <div>
                  <h2 className="text-2xl font-bold">
                    {ride.pickup?.address || "N/A"}
                    {" → "}
                    {ride.destination?.address || "N/A"}
                  </h2>

                  <p className="mt-2 text-slate-500">
                    {ride.departureTime
                      ? new Date(
                          ride.departureTime
                        ).toLocaleString()
                      : "N/A"}
                  </p>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    ride.status === "scheduled"
                      ? "bg-green-100 text-green-700"
                      : ride.status === "completed"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {ride.status}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">

  <div className="flex items-start gap-3">
    <FaChair className="mt-1 text-2xl text-blue-500" />

    <div>
      <p className="text-sm text-slate-500">
        Available Seats
      </p>

      <p className="text-xl font-bold">
        {ride.availableSeats}
      </p>
    </div>
  </div>

  <div className="flex items-start gap-3">
    <FaMoneyBillWave className="mt-1 text-2xl text-yellow-500" />

    <div>
      <p className="text-sm text-slate-500">
        Price / Seat
      </p>

      <p className="text-xl font-bold">
        Rs. {ride.pricePerSeat}
      </p>
    </div>
  </div>

  <div className="flex items-start gap-3">
    <FaCar className="mt-1 text-2xl text-indigo-500" />

    <div>
      <p className="text-sm text-slate-500">
        Vehicle
      </p>

      <p className="text-xl font-bold">
        {ride.vehicle
          ? `${ride.vehicle.brand} ${ride.vehicle.model}`
          : "N/A"}
      </p>
    </div>
  </div>

  <div className="flex items-start gap-3">
    <FaCalendarAlt className="mt-1 text-2xl text-red-500" />

    <div>
      <p className="text-sm text-slate-500">
        Departure
      </p>

      <p className="text-lg font-semibold">
        {new Date(ride.departureTime).toLocaleString()}
      </p>
    </div>
  </div>

</div>

              <div className="mt-8 flex flex-wrap gap-4">

                <button
  onClick={() => viewRide(ride._id)}
  className="rounded-xl border border-blue-600 px-6 py-2 font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
>
  👁 View
</button>

               <button
  onClick={() => openEditModal(ride)}
  disabled={ride.status !== "scheduled"}
  className={`rounded-xl border px-6 py-2 font-semibold transition ${
    ride.status === "scheduled"
      ? "border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white"
      : "cursor-not-allowed border-gray-300 text-gray-400"
  }`}
>
  ✏ Edit
</button>

                <button
  onClick={() => fetchBookings(ride._id)}
  className="rounded-xl border border-indigo-500 px-6 py-2 font-semibold text-indigo-600 transition hover:bg-indigo-600 hover:text-white"
>
  👥 Bookings
</button>

               <button
  onClick={() => completeRide(ride._id)}
  disabled={ride.status !== "scheduled"}
  className={`rounded-xl border px-6 py-2 font-semibold transition ${
    ride.status === "scheduled"
      ? "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
      : "cursor-not-allowed border-gray-300 text-gray-400"
  }`}
>
  ✔ Complete
</button>

                <button
  onClick={() => cancelRide(ride._id)}
  disabled={ride.status !== "scheduled"}
  className={`rounded-xl border px-6 py-2 font-semibold transition ${
    ride.status === "scheduled"
      ? "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
      : "cursor-not-allowed border-gray-300 text-gray-400"
  }`}
>
  🗑 Cancel
</button>

                

              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedRide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                Ride Details
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-3xl font-bold text-slate-500 hover:text-red-600"
              >
                ×
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">

              <div>
                <p className="text-sm text-slate-500">Pickup</p>
                <p className="font-semibold">
                  {selectedRide.pickup?.address}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Destination</p>
                <p className="font-semibold">
                  {selectedRide.destination?.address}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Departure</p>
                <p className="font-semibold">
                  {new Date(selectedRide.departureTime).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Status</p>
                <p className="font-semibold capitalize">
                  {selectedRide.status}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Available Seats</p>
                <p className="font-semibold">
                  {selectedRide.availableSeats}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Price Per Seat</p>
                <p className="font-semibold">
                  Rs. {selectedRide.pricePerSeat}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Vehicle</p>
                <p className="font-semibold">
                  {selectedRide.vehicle?.brand} {selectedRide.vehicle?.model}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Registration</p>
                <p className="font-semibold">
                  {selectedRide.vehicle?.registrationNumber}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-slate-500">Notes</p>
                <p className="font-semibold">
                  {selectedRide.notes || "No additional notes"}
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

      {showEditModal && editingRide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                Edit Ride
              </h2>

              <button
                onClick={() => setShowEditModal(false)}
                className="text-3xl font-bold text-slate-500 hover:text-red-600"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSubmit(updateRide)}
              className="grid gap-5 md:grid-cols-2"
            >

              <div>
                <label className="mb-2 block font-medium">
                  Pickup Location
                </label>

                <input
                  className="w-full rounded-xl border border-slate-300 p-3"
                  {...register("pickup", {
                    required: "Pickup location is required",
                  })}
                />

                {errors.pickup && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.pickup.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  Destination
                </label>

                <input
                  className="w-full rounded-xl border border-slate-300 p-3"
                  {...register("destination", {
                    required: "Destination is required",
                  })}
                />

                {errors.destination && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.destination.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  Departure Time
                </label>

                <input
                  type="datetime-local"
                  className="w-full rounded-xl border border-slate-300 p-3"
                  {...register("departureTime", {
                    required: "Departure time is required",
                  })}
                />

                {errors.departureTime && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.departureTime.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  Available Seats
                </label>

                <input
                  type="number"
                  className="w-full rounded-xl border border-slate-300 p-3"
                  {...register("availableSeats", {
                    required: "Seats are required",
                    min: 1,
                    max: 7,
                  })}
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  Price Per Seat
                </label>

                <input
                  type="number"
                  className="w-full rounded-xl border border-slate-300 p-3"
                  {...register("pricePerSeat", {
                    required: "Price is required",
                  })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block font-medium">
                  Notes
                </label>

                <textarea
                  rows="4"
                  className="w-full rounded-xl border border-slate-300 p-3"
                  {...register("notes")}
                />
              </div>

              <div className="md:col-span-2 flex gap-4">

                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="rounded-xl bg-slate-500 px-8 py-3 font-semibold text-white hover:bg-slate-600"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {showBookings && (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

<div className="w-full max-w-2xl rounded-3xl bg-white p-8">

<h2 className="text-2xl font-bold mb-6">
Booking Requests
</h2>

{bookings.length===0 ? (

<p>No booking requests.</p>

):(

bookings.map((booking)=>(

<div
key={booking._id}
className="mb-5 rounded-xl border p-5"
>

<p><strong>Name:</strong> {booking.passenger.name}</p>

<p><strong>Roll No:</strong> {booking.passenger.rollNumber}</p>

<p><strong>Phone:</strong> {booking.passenger.phone}</p>

<p><strong>Seats:</strong> {booking.seatsBooked}</p>

<p><strong>Status:</strong> {booking.status}</p>

{booking.status === "pending" && (
  <div className="mt-4 flex gap-3">
    <button
      onClick={() => acceptBooking(booking._id)}
      className="rounded bg-green-600 px-5 py-2 text-white"
    >
      Accept
    </button>

    <button
      onClick={() => rejectBooking(booking._id)}
      className="rounded bg-red-600 px-5 py-2 text-white"
    >
      Reject
    </button>
  </div>
)}

</div>

))

)}

<button
onClick={()=>setShowBookings(false)}
className="mt-6 rounded-xl bg-red-600 px-6 py-2 text-white"
>
Close
</button>

</div>

</div>
)}

    </div>
  );
}