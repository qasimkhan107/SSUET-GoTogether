import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaUserPlus, FaCarSide } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import API from "../../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const strongPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
    password || ""
  );

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      if (!strongPassword) {
  toast.error(
    "Password must contain uppercase, lowercase, number, special character and be at least 8 characters."
  );
  return;
}

      delete data.confirmPassword;

      const res = await API.post("/auth/register", data);

      if (res.data.success) {
        toast.success("Registration Successful!");

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left */}

        <div className="hidden lg:flex items-center justify-center bg-linear-to-br from-blue-700 via-blue-600 to-indigo-700">

          <div className="max-w-md text-center text-white">

            <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-white/20 backdrop-blur">
              <FaCarSide className="text-6xl" />
            </div>

            <h1 className="text-5xl font-bold">
              Join GoTogether
            </h1>

            <p className="mt-6 text-lg text-blue-100 leading-8">
              Create your account and start sharing rides safely with verified SSUET students.
            </p>

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center justify-center px-6 py-12">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-xl rounded-3xl bg-white p-10 shadow-2xl"
          >

            <div className="mb-8 text-center">

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <FaUserPlus size={28} />
              </div>

              <h2 className="text-4xl font-bold">
                Create Account
              </h2>

              <p className="mt-2 text-slate-500">
                Register with your SSUET email
              </p>

            </div>

            

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >

            

              <input
                placeholder="Full Name"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
                {...register("name", {
                  required: "Name is required",
                })}
              />

              {errors.name && (
                <p className="text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}

              <input
                placeholder="2023F-BSE-220"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
                {...register("rollNumber", {
                  required: "Roll Number is required",
                  pattern: {
                  value: /^\d{4}F-[A-Z]{2,5}-\d{3}$/i,
                  message: "Invalid Roll Number",
                },
              })}
              />

              {errors.rollNumber && (
                <p className="text-sm text-red-600 mt-1">
                {errors.rollNumber.message}
                </p>
              )}

              <input
                type="email"
                placeholder="2023f-bse-220@ssuet.edu.pk"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\d{4}F-[A-Z]{2,5}-\d{3}@ssuet\.edu\.pk$/i,
                    message: "Enter a valid SSUET email",
                  },
                })}
              />

              {errors.email && (
                <p className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
              )}

              <input
                placeholder="03XXXXXXXXX"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
                {...register("phone", {
                  required: "Phone Number is required",
                  pattern: {
                    value: /^03\d{9}$/,
                    message: "Enter a valid Pakistani phone number",
                  },
                })}
              />

              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.phone.message}
                </p>
              )}

           {/* Hidden role field */}
<input
  type="hidden"
  value="student"
  {...register("role")}
/>

{/* Account Type Info */}
<div className="rounded-xl border border-blue-200 bg-blue-50 p-4">

  <h3 className="font-semibold text-blue-700">
    Account Type
  </h3>

  <p className="mt-2 text-sm text-slate-700">
    All users register as <strong>Students</strong>.
    After registration, you can apply for passenger or driver verification to access ride features.
  </p>

</div>

              <div className="relative">

  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none transition focus:border-blue-600"
    {...register("password", {
  required: "Password is required",
  pattern: {
    value:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
    message:
      "Password must be at least 8 characters and include uppercase, lowercase, number and special character.",
  },
})}
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-4 text-slate-500"
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </button>

</div>

{errors.password && (
  <p className="mt-1 text-sm text-red-600">
    {errors.password.message}
  </p>
)}

<div className="mt-2">

  <div className="h-2 rounded-full bg-slate-200">

  <div
    className={`h-2 rounded-full transition-all duration-300 ${
      strongPassword
        ? "w-full bg-green-500"
        : password?.length >= 8
        ? "w-3/4 bg-yellow-500"
        : password?.length >= 4
        ? "w-1/2 bg-orange-500"
        : password?.length > 0
        ? "w-1/4 bg-red-500"
        : "w-0"
    }`}
  />

</div>

  <p className="mt-2 text-xs text-slate-500">
  Password must contain:
</p>

<ul className="mt-2 space-y-1 text-xs">

  <li className={password?.length >= 8 ? "text-green-600" : "text-slate-500"}>
    ✔ Minimum 8 characters
  </li>

  <li className={/[A-Z]/.test(password || "") ? "text-green-600" : "text-slate-500"}>
    ✔ One uppercase letter
  </li>

  <li className={/[a-z]/.test(password || "") ? "text-green-600" : "text-slate-500"}>
    ✔ One lowercase letter
  </li>

  <li className={/[0-9]/.test(password || "") ? "text-green-600" : "text-slate-500"}>
    ✔ One number
  </li>

  <li
    className={
      /[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]/.test(password || "")
        ? "text-green-600"
        : "text-slate-500"
    }
  >
    ✔ One special character
  </li>

</ul>

</div>

              <div className="relative">

                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full rounded-xl border px-4 py-3 pr-12"
                  {...register("confirmPassword", {
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-4"
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>

              </div>

              {errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}

              <button
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

            </form>

            <p className="mt-8 text-center text-sm">

              Already have an account?

              <Link
                to="/login"
                className="ml-2 font-semibold text-blue-600"
              >
                Login
              </Link>

            </p>

          </motion.div>

        </div>

      </div>
    </div>
  );
}