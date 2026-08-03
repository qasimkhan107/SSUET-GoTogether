import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import toast from "react-hot-toast";
import API from "../../services/api";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/auth/forgot-password", {
        email,
      });

      if (res.data.success) {
        toast.success("OTP sent successfully!");

        navigate("/verify-otp", {
          state: { email },
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-5">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
      >

        <div className="mb-8 text-center">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <FaEnvelope size={26} />
          </div>

          <h1 className="text-3xl font-bold">
            Forgot Password
          </h1>

          <p className="mt-2 text-slate-500">
            Enter your registered email to receive a password reset OTP.
          </p>

        </div>

        <form
          onSubmit={submitHandler}
          className="space-y-5"
        >

          <div>

            <label className="mb-2 block font-medium">
              Email Address
            </label>

            <input
              type="email"
              placeholder="2023f-bse-220@ssuet.edu.pk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
              required
            />

          </div>

          <button
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            <FaPaperPlane />

            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

        </form>

        <div className="mt-8 text-center">

          <Link
            to="/login"
            className="inline-flex items-center gap-2 font-semibold text-blue-600 hover:underline"
          >
            <FaArrowLeft />
            Back to Login
          </Link>

        </div>

      </motion.div>

    </div>
  );
}