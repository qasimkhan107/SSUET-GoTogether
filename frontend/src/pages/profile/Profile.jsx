import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  console.log("Profile component rendered");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNumber: "",
    phone: "",
    department: "",
    gender: "",
    bio: "",
    emergencyContact: "",
    isVerified: false,
    totalTrips: 0,
    rating: 0,
    isProfileComplete: false,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/profile");

      if (res.data.success) {
        setFormData(res.data.user);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.put(
        "/auth/profile",
        formData
      );

      if (res.data.success) {
        toast.success("Profile updated successfully.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Profile update failed."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading Profile...
        </h2>
      </div>
    );
  }

 return (
  <div className="max-w-5xl mx-auto space-y-8">

    {/* Header */}

    <div className="rounded-3xl bg-white p-8 shadow-lg">

      <div className="flex flex-col items-center gap-6 md:flex-row">

        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-blue-100 text-4xl font-bold text-blue-600">
          {formData.name?.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1">

          <h1 className="text-3xl font-bold text-slate-800">
            {formData.name}
          </h1>

          <p className="mt-2 text-slate-500">
            {formData.email}
          </p>

          <p className="text-slate-500">
            {formData.rollNumber}
          </p>

        </div>

      </div>

    </div>

    {/* Edit Form */}

    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-white p-8 shadow-lg"
    >

      <h2 className="mb-6 text-2xl font-bold">
        Personal Information
      </h2>

      <div className="grid gap-6 md:grid-cols-2">

        <div>

          <label className="mb-2 block font-medium">
            Full Name
          </label>

          <input
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Phone
          </label>

          <input
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Department
          </label>

          <input
            name="department"
            value={formData.department || ""}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Gender
          </label>

          <select
            name="gender"
            value={formData.gender || ""}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

        </div>

      </div>

      <div className="mt-6">

        <label className="mb-2 block font-medium">
          Bio
        </label>

        <textarea
          name="bio"
          rows="4"
          value={formData.bio || ""}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
        />

      </div>

      <div className="mt-6">

        <label className="mb-2 block font-medium">
          Emergency Contact
        </label>

        <input
          name="emergencyContact"
          value={formData.emergencyContact || ""}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
        />

      </div>

      <div className="mt-8">

        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Save Changes
        </button>

      </div>

    </form>

  </div>
);
}