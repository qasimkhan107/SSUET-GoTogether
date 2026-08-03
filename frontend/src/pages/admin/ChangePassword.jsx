import { useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";
import API from "../../services/api";

export default function ChangePassword() {
  const [loading, setLoading] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const password = form.newPassword;

  const rules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special:
      /[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  };

  const passedRules =
    Object.values(rules).filter(Boolean).length;

  const strength =
    passedRules <= 2
      ? "Weak"
      : passedRules <= 4
      ? "Medium"
      : "Strong";

  const strengthColor =
    strength === "Weak"
      ? "bg-red-500"
      : strength === "Medium"
      ? "bg-yellow-500"
      : "bg-green-500";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
        form.newPassword
      )
    ) {
      return toast.error(
        "Password must contain uppercase, lowercase, number and special character."
      );
    }

    try {
      setLoading(true);

      const res = await API.put("/auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      toast.success(res.data.message);

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  const Rule = ({ ok, text }) => (
    <div
      className={`flex items-center gap-2 ${
        ok ? "text-green-600" : "text-slate-500"
      }`}
    >
      {ok ? <FaCheckCircle /> : <FaTimesCircle />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="p-8">
      <h1 className="mb-8 text-4xl font-bold">
        Change Password
      </h1>

      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow">

        <div className="mb-8 flex items-center gap-3">
          <FaLock className="text-2xl text-blue-600" />

          <h2 className="text-2xl font-bold">
            Update Password
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Current Password */}
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              name="currentPassword"
              placeholder="Current Password"
              value={form.currentPassword}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 focus:border-blue-600 focus:outline-none"
              required
            />

            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-4 top-4 text-slate-500"
            >
              {showCurrent ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* New Password */}
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              name="newPassword"
              placeholder="New Password"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 focus:border-blue-600 focus:outline-none"
              required
            />

            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 top-4 text-slate-500"
            >
              {showNew ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Password Strength */}
          <div>
            <div className="mb-2 flex justify-between text-sm font-medium">
              <span>Password Strength</span>

              <span>
                {password ? strength : "Not Entered"}
              </span>
            </div>

            <div className="h-2 rounded-full bg-slate-200">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  password ? strengthColor : "bg-slate-300"
                }`}
                style={{
                  width: password
                    ? `${(passedRules / 5) * 100}%`
                    : "0%",
                }}
              />
            </div>
          </div>

          {/* Password Requirements */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <h3 className="mb-3 font-semibold text-slate-800">
              Password Requirements
            </h3>

            <div className="space-y-2 text-sm">
              <Rule
                ok={rules.length}
                text="At least 8 characters"
              />

              <Rule
                ok={rules.upper}
                text="One uppercase letter (A-Z)"
              />

              <Rule
                ok={rules.lower}
                text="One lowercase letter (a-z)"
              />

              <Rule
                ok={rules.number}
                text="One number (0-9)"
              />

              <Rule
                ok={rules.special}
                text="One special character (@, #, $, %, etc.)"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 focus:border-blue-600 focus:outline-none"
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
            {loading
              ? "Updating..."
              : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}