import { FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function AdminSettings() {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <h1 className="mb-8 text-4xl font-bold">
        Admin Settings
      </h1>

      <div className="rounded-3xl bg-white p-8 shadow">

        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
          <FaCog />
          Account Settings
        </h2>

        <button
          onClick={() => navigate("/admin/change-password")}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Change Password
        </button>

      </div>
    </div>
  );
}