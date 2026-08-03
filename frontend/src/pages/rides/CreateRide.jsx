import { useForm } from "react-hook-form";
import { useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";

export default function CreateRide() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  const createRide = async (data) => {
  try {
    setLoading(true);

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
      availableSeats: data.availableSeats,
      pricePerSeat: data.pricePerSeat,

      preferences: {
        smoking: data.smoking || false,
        pets: data.pets || false,
        luggage: data.luggage ?? true,
        genderPreference: data.genderPreference || "any",
      },

      notes: data.notes,
    };

    const res = await API.post("/rides", rideData);

    if (res.data.success) {
      toast.success(res.data.message);

      reset();
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Failed to publish ride."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-lg">
      <h1 className="mb-8 text-3xl font-bold">
        Publish Ride
      </h1>

      <form
        onSubmit={handleSubmit(createRide)}
        className="grid gap-5 md:grid-cols-2"
      >
        <div>
          <div>
  <label className="mb-2 block font-medium">
    Pickup Location
  </label>

  <input
    placeholder="Enter pickup location"
    className="w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-blue-600"
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
    </div>

        <div>
  <label className="mb-2 block font-medium">
    Destination
  </label>

  <input
    placeholder="Enter Destination"
    className="w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-blue-600"
    {...register("destination", {
      required: "Destination location is required",
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
    Departure Date & Time
  </label>

  <input
    type="datetime-local"
    className="w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-blue-600"
    {...register("departureTime", {
      required: "Departure date & time is required",
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
    placeholder="Enter available seats"
    className="w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-blue-600"
    {...register("availableSeats", {
      required: "Available seats are required",
      min: {
        value: 1,
        message: "Minimum 1 seat",
      },
      max: {
        value: 7,
        message: "Maximum 7 seats",
      },
      valueAsNumber: true,
    })}
  />

  {errors.availableSeats && (
    <p className="mt-1 text-sm text-red-600">
      {errors.availableSeats.message}
    </p>
  )}
</div>
        <div>
  <label className="mb-2 block font-medium">
    Price Per Seat (PKR)
  </label>

  <input
    type="number"
    min="0"
    placeholder="Enter price per seat"
    className="w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-blue-600"
    {...register("pricePerSeat", {
      required: "Price per seat is required",
      min: {
        value: 0,
        message: "Price cannot be negative",
      },
      valueAsNumber: true,
    })}
  />

  {errors.pricePerSeat && (
    <p className="mt-1 text-sm text-red-600">
      {errors.pricePerSeat.message}
    </p>
  )}
</div>

<div className="md:col-span-2">
  <h2 className="mb-4 text-xl font-bold text-slate-800">
    Ride Preferences
  </h2>
</div>

<div className="flex items-center gap-3">
  <input
    type="checkbox"
    id="smoking"
    {...register("smoking")}
  />

  <label htmlFor="smoking">
    Smoking Allowed
  </label>
</div>

<div className="flex items-center gap-3">
  <input
    type="checkbox"
    id="pets"
    {...register("pets")}
  />

  <label htmlFor="pets">
    Pets Allowed
  </label>
</div>

<div className="flex items-center gap-3">
  <input
    type="checkbox"
    id="luggage"
    defaultChecked
    {...register("luggage")}
  />

  <label htmlFor="luggage">
    Luggage Allowed
  </label>
</div>

<div>
  <label className="mb-2 block font-medium">
    Gender Preference
  </label>

  <select
    className="w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-blue-600"
    {...register("genderPreference")}
    defaultValue="any"
  >
    <option value="any">Any</option>
    <option value="male">Male</option>
    <option value="female">Female</option>
  </select>
</div>

        <div className="md:col-span-2">
  <label className="mb-2 block font-medium">
    Additional Notes
  </label>

  <textarea
    rows={4}
    maxLength={300}
    placeholder="Any additional instructions for passengers..."
    className="w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-blue-600"
    {...register("notes", {
      maxLength: {
        value: 300,
        message: "Notes cannot exceed 300 characters",
      },
    })}
  />

  {errors.notes && (
    <p className="mt-1 text-sm text-red-600">
      {errors.notes.message}
    </p>
  )}
</div>

        <div className="md:col-span-2">
          <button
  type="submit"
  disabled={loading}
  className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
>
  {loading ? "Publishing Ride..." : "Publish Ride"}
</button>
        </div>
      </form>
    </div>
  );
}