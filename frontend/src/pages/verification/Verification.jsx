import { useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";

export default function Verification() {
  const [type, setType] = useState("passenger");
  const [universityIdCard, setUniversityIdCard] = useState(null);
  const [driverUniversityIdCard, setDriverUniversityIdCard] = useState(null);
  const [cnicFront, setCnicFront] = useState(null);
  const [cnicBack, setCnicBack] = useState(null);

  const submitPassengerVerification = async () => {
    if (!universityIdCard) {
      return toast.error("Please select your University ID Card.");
    }

    try {
      const formData = new FormData();

      formData.append(
        "universityIdCard",
        universityIdCard
      );

      const res = await API.post(
        "/verification/passenger",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setUniversityIdCard(null);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Verification submission failed."
      );
    }
  };

  const submitDriverVerification = async () => {
    if (
      !driverUniversityIdCard ||
      !cnicFront ||
      !cnicBack
    ) {
      return toast.error("Please upload all required documents.");
    }

    try {
      const formData = new FormData();

      formData.append(
        "universityIdCard",
        driverUniversityIdCard
      );

      formData.append(
        "cnicFront",
        cnicFront
      );

      formData.append(
        "cnicBack",
        cnicBack
      );

      const res = await API.post(
        "/verification/driver",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);

        setDriverUniversityIdCard(null);
        setCnicFront(null);
        setCnicBack(null);
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Driver verification failed."
      );
    }
  };

  return (
    <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-lg">

      <h1 className="mb-8 text-3xl font-bold">
        Account Verification
      </h1>

      <div className="mb-8 flex gap-4">

        <button
          onClick={() => setType("passenger")}
          className={`rounded-xl px-6 py-3 font-semibold ${
            type === "passenger"
              ? "bg-blue-600 text-white"
              : "bg-slate-200"
          }`}
        >
          Passenger Verification
        </button>

        <button
          onClick={() => setType("driver")}
          className={`rounded-xl px-6 py-3 font-semibold ${
            type === "driver"
              ? "bg-blue-600 text-white"
              : "bg-slate-200"
          }`}
        >
          Driver Verification
        </button>

      </div>

      {type === "passenger" ? (
        <div className="rounded-2xl border p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Passenger Verification
          </h2>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setUniversityIdCard(e.target.files[0])
            }
            className="mb-6 w-full rounded-xl border p-3"
          />

          <button
            onClick={submitPassengerVerification}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Submit Verification
          </button>

        </div>
      ) : (
        <div className="rounded-2xl border p-6">

          <h2 className="mb-6 text-xl font-semibold">
            Driver Verification
          </h2>

          <label className="mb-2 block font-medium">
            University ID Card
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setDriverUniversityIdCard(e.target.files[0])
            }
            className="mb-6 w-full rounded-xl border p-3"
          />

          <label className="mb-2 block font-medium">
            CNIC Front
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setCnicFront(e.target.files[0])
            }
            className="mb-6 w-full rounded-xl border p-3"
          />

          <label className="mb-2 block font-medium">
            CNIC Back
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setCnicBack(e.target.files[0])
            }
            className="mb-6 w-full rounded-xl border p-3"
          />

          <button
            onClick={submitDriverVerification}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Submit Driver Verification
          </button>

        </div>
      )}

    </div>
  );
}