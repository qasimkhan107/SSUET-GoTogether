import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";

export default function FindRide() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const res = await API.get("/rides");

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

const bookRide = async () => {
  try {
    const res = await API.post("/bookings", {
      rideId: selectedRide._id,
      seatsBooked: 1,
      pickupNote: "",
    });

    if (res.data.success) {
      toast.success(res.data.message);
      setShowModal(false);
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Failed to book ride."
    );
  }
};

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading rides...
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold text-slate-800">
        Find Ride
      </h1>

      {rides.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
          <h2 className="text-2xl font-semibold">
            No rides available.
          </h2>
        </div>
      ) : (
        <div className="grid gap-6">
          {rides.map((ride) => (
            <div
              key={ride._id}
              className="rounded-3xl bg-white p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold">
                {ride.pickup?.address} → {ride.destination?.address}
              </h2>

              <p className="mt-2 text-slate-500">
                {new Date(ride.departureTime).toLocaleString()}
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-3">

                <div>
                  <p className="text-sm text-slate-500">
                    Driver
                  </p>

                  <p className="font-semibold">
                    {ride.driver?.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Seats
                  </p>

                  <p className="font-semibold">
                    {ride.availableSeats}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Price
                  </p>

                  <p className="font-semibold">
                    Rs. {ride.pricePerSeat}
                  </p>
                </div>

              </div>

              <div className="mt-6">
               <button
  onClick={() => viewRide(ride._id)}
  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
>
  View Ride
</button>
              </div>

            </div>
          ))}
        </div>
      )}

{showModal && selectedRide && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-2xl">

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

      <div className="grid gap-5 md:grid-cols-2">

        <div>
          <p className="text-sm text-slate-500">Driver</p>
          <p className="font-semibold">
            {selectedRide.driver?.name}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Roll Number</p>
          <p className="font-semibold">
            {selectedRide.driver?.rollNumber}
          </p>
        </div>

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
          <p className="text-sm text-slate-500">Seats</p>
          <p className="font-semibold">
            {selectedRide.availableSeats}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Price</p>
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

      <div className="mt-8 flex justify-end gap-4">

        <button
  onClick={bookRide}
  className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
>
  Book Ride
</button>

        <button
          onClick={() => setShowModal(false)}
          className="rounded-xl bg-slate-500 px-6 py-3 font-semibold text-white hover:bg-slate-600"
        >
          Close
        </button>

      </div>

    </div>
  </div>
)}


    </div>
  );
}