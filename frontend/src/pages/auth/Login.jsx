import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaCarSide } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Hook called at component level

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const res = await API.post("/auth/login", data);

      if (res.data.success) {
        // Save user and token using AuthContext
        login(res.data.user, res.data.token);

        toast.success("Login Successful");

        if (res.data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left Section */}
        <div className="hidden bg-linear-to-br from-blue-700 via-blue-600 to-indigo-700 lg:flex">
          <div className="m-auto max-w-md text-center text-white">

            <div className="mb-8 flex justify-center">
              <div className="rounded-full bg-white/20 p-8 backdrop-blur-md">
                <FaCarSide className="text-7xl" />
              </div>
            </div>

            <h1 className="text-5xl font-bold">
              GoTogether
            </h1>

            <p className="mt-6 text-lg leading-8 text-blue-100">
              A secure carpooling platform exclusively for SSUET students.
            </p>

            <div className="mt-12 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg">
              <p className="text-lg italic">
                "Travel together. Save fuel. Save money. Build community."
              </p>
            </div>

          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-center px-6 py-10">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl"
          >

            <div className="mb-10 text-center">
              <h2 className="text-4xl font-bold text-slate-800">
                Welcome Back
              </h2>

              <p className="mt-3 text-slate-500">
                Login to your account
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >

              {/* Email */}
              <div>
                <label className="mb-2 block font-medium">
                  SSUET Email
                </label>

                <input
                  type="email"
                  placeholder="2023f-bse-219@ssuet.edu.pk"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
                  {...register("email", {
                    required: "Email is required",
                  })}
                />

                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block font-medium">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none transition focus:border-blue-600"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />

                  <button
                    type="button"
                    className="absolute right-4 top-4 text-xl text-slate-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember */}
              <div className="flex items-center justify-between">

                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" />
                  Remember Me
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot Password?
                </Link>

              </div>

              {/* Login */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

            </form>

            <div className="mt-8 text-center text-sm">
              Don't have an account?

              <Link
                to="/register"
                className="ml-2 font-semibold text-blue-600"
              >
                Register
              </Link>
            </div>

          </motion.div>

        </div>
      </div>
    </div>
  );
}