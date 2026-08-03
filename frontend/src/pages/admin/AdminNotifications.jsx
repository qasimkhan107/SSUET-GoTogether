import { useEffect, useState } from "react";
import { FaBell, FaUserClock } from "react-icons/fa";
import { Link } from "react-router-dom";
import API from "../../services/api";
import toast from "react-hot-toast";

export default function AdminNotifications() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  const fetchPendingVerifications = async () => {
    try {
      const res = await API.get("/admin/verifications");

      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FaBell className="text-blue-600" />
          Notifications
        </h1>

        <p className="text-slate-500 mt-2">
          Pending verification requests
        </p>
      </div>

      {users.length === 0 ? (

        <div className="rounded-2xl bg-white p-10 shadow text-center">
          <FaBell className="mx-auto text-5xl text-green-600 mb-4" />

          <h2 className="text-2xl font-semibold">
            No Pending Requests
          </h2>

          <p className="text-slate-500 mt-2">
            You're all caught up.
          </p>
        </div>

      ) : (

        <div className="space-y-4">

          {users.map((user) => (

            <div
              key={user._id}
              className="rounded-2xl bg-white p-6 shadow"
            >
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">

                  <div className="rounded-full bg-yellow-100 p-4">
                    <FaUserClock className="text-xl text-yellow-600" />
                  </div>

                  <div>

                    <h2 className="text-lg font-bold">
                      {user.name}
                    </h2>

                    <p className="text-slate-500">
                      {user.rollNumber}
                    </p>

                    <div className="mt-2 flex gap-2">

                      {user.verification.driverStatus === "pending" && (
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
                          Driver Pending
                        </span>
                      )}

                      {user.verification.passengerStatus === "pending" && (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                          Passenger Pending
                        </span>
                      )}

                    </div>

                  </div>

                </div>

                <Link
                  to={`/admin/verification/${user._id}`}
                  className="rounded-xl bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
                >
                  Review
                </Link>

              </div>
            </div>

          ))}

        </div>

      )}

    </div>
  );
}