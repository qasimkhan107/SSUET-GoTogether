import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import API from "../../services/api";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  // Email received from ForgotPassword page
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      return toast.error("Please enter a valid 6-digit OTP.");
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/verify-otp", {
        email,
        otp,
      });

      if (res.data.success) {
        toast.success("OTP Verified Successfully!");

        navigate("/reset-password", {
          state: {
            email,
            otp,
          },
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <FaShieldAlt size={28} />
          </div>

          <h2 className="mt-4 text-3xl font-bold">
            Verify OTP
          </h2>

          <p className="mt-2 text-slate-500">
            Enter the 6-digit code sent to your email.
          </p>
        </div>

        <form
          onSubmit={handleVerify}
          className="space-y-5"
        >
          <input
            type="text"
            maxLength={6}
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-center text-2xl tracking-[10px] outline-none focus:border-blue-600"
            required
          />

          <button
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}