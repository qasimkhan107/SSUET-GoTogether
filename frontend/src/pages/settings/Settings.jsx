import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import Switch from "react-switch";
import {
  FaLock,
  FaBell,
  FaInfoCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

export default function Settings() {
  const [settings, setSettings] = useState({
    appNotifications: true,
    emailNotifications: true,
    showPhoneAfterAcceptance: true,
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saving, setSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await API.get("/settings");

      if (res.data.success) {
        setSettings(res.data.settings);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggle = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.checked,
    });
  };

  const saveSettings = async () => {
  try {
    setSaving(true);

    const res = await API.put("/settings", settings);

    if (res.data.success) {
      toast.success(res.data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Error");
  } finally {
    setSaving(false);
  }
};

  const handlePassword = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const changePassword = async (e) => {
    e.preventDefault();

    if (passwords.newPassword.length < 8) {
  return toast.error("Password must be at least 8 characters.");
}

if (!/[A-Z]/.test(passwords.newPassword)) {
  return toast.error(
    "Password must contain an uppercase letter."
  );
}

if (!/[a-z]/.test(passwords.newPassword)) {
  return toast.error(
    "Password must contain a lowercase letter."
  );
}

if (!/[0-9]/.test(passwords.newPassword)) {
  return toast.error(
    "Password must contain a number."
  );
}

    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const res = await API.put("/settings/change-password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      if (res.data.success) {
        toast.success(res.data.message);

        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }
  };

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          Settings
        </h1>

        <p className="text-slate-500">
          Manage your account preferences
        </p>
      </div>

      {/* Password */}

      <div className="rounded-2xl bg-white p-6 shadow">

        <div className="mb-5 flex items-center gap-3">
  <FaLock className="text-xl text-blue-600" />

  <h2 className="text-xl font-semibold">
    Change Password
  </h2>
</div>

        <form
          onSubmit={changePassword}
          className="space-y-4"
        >

          <div className="relative">
  <input
    type={showCurrent ? "text" : "password"}
    name="currentPassword"
    placeholder="Current Password"
    value={passwords.currentPassword}
    onChange={handlePassword}
    className="w-full rounded-xl border p-3 pr-12"
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

          <div className="relative">
  <input
    type={showNew ? "text" : "password"}
    name="newPassword"
    placeholder="New Password"
    value={passwords.newPassword}
    onChange={handlePassword}
    className="w-full rounded-xl border p-3 pr-12"
    required
  />

  <p className="mt-2 text-sm font-medium text-slate-600">
  Password must contain:
</p>

<ul className="mt-1 ml-5 list-disc text-sm text-slate-500 space-y-1">
  <li>Minimum 8 characters</li>
  <li>One uppercase letter (A-Z)</li>
  <li>One lowercase letter (a-z)</li>
  <li>One number (0-9)</li>
  <li>One special character (@#$%^&*)</li>
</ul>

  <button
    type="button"
    onClick={() => setShowNew(!showNew)}
    className="absolute right-4 top-4 text-slate-500"
  >
    {showNew ? <FaEyeSlash /> : <FaEye />}
  </button>
</div>

          <div className="relative">
  <input
    type={showConfirm ? "text" : "password"}
    name="confirmPassword"
    placeholder="Confirm Password"
    value={passwords.confirmPassword}
    onChange={handlePassword}
    className="w-full rounded-xl border p-3 pr-12"
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

          <button className="rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
            Change Password
          </button>

        </form>

      </div>

      {/* Preferences */}

      <div className="rounded-2xl bg-white p-6 shadow">

        <div className="mb-5 flex items-center gap-3">
  <FaBell className="text-xl text-green-600" />

  <h2 className="text-xl font-semibold">
    Preferences
  </h2>
</div>

        <div className="space-y-5">

          <label className="flex items-center justify-between">

            <span>App Notifications</span>

            <Switch
  checked={settings.appNotifications}
  onChange={(checked) =>
    setSettings({
      ...settings,
      appNotifications: checked,
    })
  }
/>

          </label>

          <label className="flex items-center justify-between">

            <span>Email Notifications</span>

            <Switch
  checked={settings.emailNotifications}
  onChange={(checked) =>
    setSettings({
      ...settings,
      emailNotifications: checked,
    })
  }
/>

          </label>

          <label className="flex items-center justify-between">

            <span>Show Phone Number After Booking Acceptance</span>

            <Switch
  checked={settings.showPhoneAfterAcceptance}
  onChange={(checked) =>
    setSettings({
      ...settings,
      showPhoneAfterAcceptance: checked,
    })
  }
/>

          </label>

          <button
  onClick={saveSettings}
  disabled={saving}
  className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
>
  {saving ? "Saving..." : "Save Settings"}
</button>

        </div>

      </div>

      {/* About */}

      <div className="rounded-2xl bg-white p-6 shadow">

        <div className="mb-4 flex items-center gap-3">
  <FaInfoCircle className="text-xl text-orange-500" />

  <h2 className="text-xl font-semibold">
    About
  </h2>
</div>

        <p className="text-slate-600">
          <strong>GoTogether</strong> Version 1.0
        </p>

        <p className="mt-2 text-slate-500">
          SSUET Ride Sharing & Carpooling Platform.
        </p>

      </div>

    </div>
  );
}