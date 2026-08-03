import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import API from "../../services/api";
import toast from "react-hot-toast";

export default function Vehicle() {
  const [vehicle, setVehicle] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const deleteVehicle = async () => {
    if (!window.confirm("Are you sure you want to delete your vehicle?")) {
      return;
    }

    try {
      const res = await API.delete(`/vehicles/${vehicle._id}`);

      if (res.data.success) {
        toast.success(res.data.message);
        setVehicle(null);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete vehicle."
      );
    }
  };

  const addVehicle = async (data) => {
    try {
      const res = await API.post("/vehicles", data);

      if (res.data.success) {
        toast.success(res.data.message);
        setVehicle(res.data.vehicle);
        reset();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add vehicle."
      );
    }
  };

  const updateVehicle = async (data) => {
  try {
    const res = await API.put(
      `/vehicles/${vehicle._id}`,
      data
    );

    if (res.data.success) {
      toast.success(res.data.message);

      setVehicle(res.data.vehicle);

      setEditing(false);

      reset();
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Failed to update vehicle."
    );
  }
};

  useEffect(() => {
    fetchVehicle();
  }, []);

  const fetchVehicle = async () => {
    try {
      const res = await API.get("/vehicles/me");

      if (res.data.success) {
        setVehicle(res.data.vehicle);
      }
    } catch (error) {
      // 404 means no vehicle yet
      if (error.response?.status !== 404) {
        toast.error(
          error.response?.data?.message || "Failed to load vehicle."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <h2 className="text-xl font-semibold">Loading Vehicle...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">My Vehicle</h1>

      {vehicle && !editing ? (
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold">Vehicle Details</h2>

          <div className="space-y-3">
            <p>
              <strong>Type:</strong> {vehicle.vehicleType}
            </p>
            <p>
              <strong>Brand:</strong> {vehicle.brand}
            </p>
            <p>
              <strong>Model:</strong> {vehicle.model}
            </p>
            <p>
              <strong>Color:</strong> {vehicle.color}
            </p>
            <p>
              <strong>Registration:</strong> {vehicle.registrationNumber}
            </p>
            <p>
              <strong>Seats:</strong> {vehicle.seatsAvailable}
            </p>
            <p>
              <strong>Fuel:</strong> {vehicle.fuelType}
            </p>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => {
                reset({
                  vehicleType: vehicle.vehicleType,
                  brand: vehicle.brand,
                  model: vehicle.model,
                  color: vehicle.color,
                  registrationNumber: vehicle.registrationNumber,
                  seatsAvailable: vehicle.seatsAvailable,
                  fuelType: vehicle.fuelType,
                });

                setEditing(true);
              }}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Edit Vehicle
            </button>

            <button
              onClick={deleteVehicle}
              className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
            >
              Delete Vehicle
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold">Register Your Vehicle</h2>

          <form onSubmit={handleSubmit(
            editing ? updateVehicle : addVehicle
            )}
              className="grid gap-5 md:grid-cols-2"
          >
            <select
              className="rounded-xl border p-3"
              {...register("vehicleType", {
                required: "Vehicle type is required",
              })}
            >
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
            </select>

            {errors.vehicleType && (
              <p className="text-sm text-red-600">
                {errors.vehicleType.message}
              </p>
            )}

            <input
              placeholder="Brand"
              className="rounded-xl border p-3"
              {...register("brand", {
                required: "Brand is required",
              })}
            />

            {errors.brand && (
              <p className="text-sm text-red-600">{errors.brand.message}</p>
            )}

            <input
              placeholder="Model"
              className="rounded-xl border p-3"
              {...register("model", {
                required: "Model is required",
              })}
            />

            {errors.model && (
              <p className="text-sm text-red-600">{errors.model.message}</p>
            )}

            <input
              placeholder="Color"
              className="rounded-xl border p-3"
              {...register("color", {
                required: "Color is required",
              })}
            />

            {errors.color && (
              <p className="text-sm text-red-600">{errors.color.message}</p>
            )}

            <input
              placeholder="Registration Number"
              className="rounded-xl border p-3"
              {...register("registrationNumber", {
                required: "Registration Number is required",
              })}
            />

            {errors.registrationNumber && (
              <p className="text-sm text-red-600">
                {errors.registrationNumber.message}
              </p>
            )}

            <input
              type="number"
              min="1"
              max="7"
              placeholder="Seats"
              className="rounded-xl border p-3"
              {...register("seatsAvailable", {
                required: "Seats are required",
                valueAsNumber: true,
              })}
            />

            {errors.seatsAvailable && (
              <p className="text-sm text-red-600">
                {errors.seatsAvailable.message}
              </p>
            )}

            <select
              className="rounded-xl border p-3"
              {...register("fuelType")}
            >
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
            </select>

            <div className="md:col-span-2">
              <button type="submit"
                className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
              >
               {editing ? "Update Vehicle" : "Add Vehicle"}
              </button>

              {editing && (
              <button type="button"
                onClick={() => {
                  setEditing(false);
                  reset();
                }}
                className="ml-4 rounded-xl bg-slate-500 px-8 py-3 font-semibold text-white hover:bg-slate-600"
              >
                Cancel
              </button>
              )}

            </div>
          </form>
        </div>
      )}
    </div>
  );
}