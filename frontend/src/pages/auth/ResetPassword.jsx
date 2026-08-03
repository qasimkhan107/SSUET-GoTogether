import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import API from "../../services/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const strongPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
      password
    );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!strongPassword) {
      return toast.error(
        "Password must contain uppercase, lowercase, number and special character."
      );
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      setLoading(true);

      const res = await API.put("/auth/reset-password", {
        email,
        otp,
        password,
      });

      if (res.data.success) {
        toast.success("Password reset successfully.");

        navigate("/login");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to reset password."
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
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <FaLock size={28} />
          </div>

          <h2 className="mt-4 text-3xl font-bold">
            Reset Password
          </h2>

          <p className="mt-2 text-slate-500">
            Create a new secure password.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Password */}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-blue-600"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-slate-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Strength Bar */}

          <div className="h-2 rounded-full bg-slate-200">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                strongPassword
                  ? "w-full bg-green-500"
                  : password.length >= 8
                  ? "w-3/4 bg-yellow-500"
                  : password.length >= 4
                  ? "w-1/2 bg-orange-500"
                  : password.length > 0
                  ? "w-1/4 bg-red-500"
                  : "w-0"
              }`}
            />
          </div>

          <ul className="ml-5 list-disc text-xs text-slate-500 space-y-1">
            <li>Minimum 8 characters</li>
            <li>One uppercase letter</li>
            <li>One lowercase letter</li>
            <li>One number</li>
            <li>One special character</li>
          </ul>

          {/* Confirm Password */}

          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-blue-600"
              required
            />

            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-4 text-slate-500"
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}