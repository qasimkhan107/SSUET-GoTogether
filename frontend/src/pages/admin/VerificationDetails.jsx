import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function VerificationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();


  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchVerification();
  }, []);

  const fetchVerification = async () => {
    try {
      const res = await API.get(`/admin/verification/${id}`);

      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to load verification."
      );
    }
  };

  if (!user) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading...
        </h2>
      </div>
    );
  }

  const approvePassenger = async () => {
  try {
    const res = await API.put(`/admin/passenger/${id}/approve`);

    if (res.data.success) {
      toast.success(res.data.message);
      setTimeout(() => {
  navigate("/admin/verifications");
}, 1000);
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Failed to approve passenger."
    );
  }
};

const rejectPassenger = async () => {
  try {
    const res = await API.put(`/admin/passenger/${id}/reject`);

    if (res.data.success) {
      toast.success(res.data.message);
      setTimeout(() => {
  navigate("/admin/verifications");
}, 1000);
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Failed to reject passenger."
    );
  }
};

const approveDriver = async () => {
  try {
    const res = await API.put(`/admin/driver/${id}/approve`);

    if (res.data.success) {
      toast.success(res.data.message);
      setTimeout(() => {
  navigate("/admin/verifications");
}, 1000);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Approval failed.");
  }
};

const rejectDriver = async () => {
  try {
    const res = await API.put(`/admin/driver/${id}/reject`);

    if (res.data.success) {
      toast.success(res.data.message);
      setTimeout(() => {
  navigate("/admin/verifications");
}, 1000);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Rejection failed.");
  }
};

  return (
    
    <div className="rounded-3xl bg-white p-8 shadow-lg">

      <Link
      to="/admin/verifications"
      className="mb-6 inline-block rounded-lg bg-slate-200 px-4 py-2 hover:bg-slate-300"
    >
      ← Back to Verifications
    </Link>

      <h1 className="mb-8 text-3xl font-bold">
        Verification Details
      </h1>

      <div className="space-y-4">

        <p>
          <strong>Name:</strong> {user.name}
        </p>

        <p>
          <strong>Roll Number:</strong> {user.rollNumber}
        </p>

        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <p>
          <strong>Department:</strong> {user.department}
        </p>

        <p>
          <strong>Phone:</strong> {user.phone}
        </p>

      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">

  <div className="rounded-xl bg-slate-100 p-4">
    <p className="text-sm text-slate-500">
      Passenger Status
    </p>

    <span
      className={`mt-2 inline-block rounded-full px-4 py-1 font-semibold ${
        user.verification.passengerStatus === "approved"
          ? "bg-green-100 text-green-700"
          : user.verification.passengerStatus === "pending"
          ? "bg-yellow-100 text-yellow-700"
          : user.verification.passengerStatus === "rejected"
          ? "bg-red-100 text-red-700"
          : "bg-slate-200 text-slate-700"
      }`}
    >
      {user.verification.passengerStatus}
    </span>
  </div>

  <div className="rounded-xl bg-slate-100 p-4">
    <p className="text-sm text-slate-500">
      Driver Status
    </p>

    <span
      className={`mt-2 inline-block rounded-full px-4 py-1 font-semibold ${
        user.verification.driverStatus === "approved"
          ? "bg-green-100 text-green-700"
          : user.verification.driverStatus === "pending"
          ? "bg-yellow-100 text-yellow-700"
          : user.verification.driverStatus === "rejected"
          ? "bg-red-100 text-red-700"
          : "bg-slate-200 text-slate-700"
      }`}
    >
      {user.verification.driverStatus}
    </span>
  </div>

</div>

      <div className="mt-10">

  <h2 className="mb-6 text-2xl font-bold">
    Submitted Documents
  </h2>

  {user.verification.universityIdCard && (
    <div className="mb-8">

      <h3 className="mb-3 font-semibold">
        University ID Card
      </h3>

      <a
  href={`http://localhost:5000/${user.verification.universityIdCard}`}
  target="_blank"
  rel="noreferrer"
>
  <img
    src={`http://localhost:5000/${user.verification.universityIdCard}`}
    alt="University ID"
    className="max-h-80 cursor-pointer rounded-xl border shadow transition hover:scale-105"
  />
</a>

    </div>
  )}

  {user.verification.cnicFront && (
    <div className="mb-8">

      <h3 className="mb-3 font-semibold">
        CNIC Front
      </h3>

     <a
  href={`http://localhost:5000/${user.verification.cnicFront}`}
  target="_blank"
  rel="noreferrer"
>
  <img
    src={`http://localhost:5000/${user.verification.cnicFront}`}
    alt="CNIC Front"
    className="max-h-80 cursor-pointer rounded-xl border shadow transition hover:scale-105"
  />
</a>

    </div>
  )}

  {user.verification.cnicBack && (
    <div>

      <h3 className="mb-3 font-semibold">
        CNIC Back
      </h3>

       <a
  href={`http://localhost:5000/${user.verification.cnicBack}`}
  target="_blank"
  rel="noreferrer"
>
  <img
    src={`http://localhost:5000/${user.verification.cnicBack}`}
    alt="CNIC Back"
    className="max-h-80 cursor-pointer rounded-xl border shadow transition hover:scale-105"
  />
</a>

    </div>
  )}

</div>

{user.verification.passengerStatus === "pending" && (
  <div className="mt-8 flex gap-4">

    <button
      onClick={approvePassenger}
      className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
    >
      Approve Passenger
    </button>

    <button
      onClick={rejectPassenger}
      className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
    >
      Reject Passenger
    </button>

  </div>
)}

{user.verification.driverStatus === "pending" && (
  <div className="mt-6 flex gap-4">

    <button
      onClick={approveDriver}
      className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
    >
      Approve Driver
    </button>

    <button
      onClick={rejectDriver}
      className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
    >
      Reject Driver
    </button>

  </div>
)}

</div>
  );
}