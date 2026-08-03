import { useAuth } from "../../context/AuthContext";
import { FaUserShield } from "react-icons/fa";

export default function AdminProfile() {
  const { user } = useAuth();

  return (
    <div className="p-8">

      <h1 className="mb-8 text-4xl font-bold">
        Admin Profile
      </h1>

      <div className="rounded-3xl bg-white p-8 shadow">

        <div className="mb-8 flex items-center gap-6">

          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-4xl font-bold text-white">
            {user?.name?.charAt(0)}
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              {user?.name}
            </h2>

            <p className="text-slate-500">
              {user?.role}
            </p>
          </div>

        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <div>
            <p className="text-sm text-slate-500">
              Name
            </p>

            <h3 className="text-lg font-semibold">
              {user?.name}
            </h3>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Email
            </p>

            <h3 className="text-lg font-semibold">
              {user?.email}
            </h3>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Role
            </p>

            <h3 className="text-lg font-semibold capitalize">
              {user?.role}
            </h3>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Status
            </p>

            <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
              Active
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}