import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import toast from "react-hot-toast";

export default function Verifications() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      const res = await API.get("/admin/verifications");

      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load verifications."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <h2 className="text-xl font-semibold">Loading...</h2>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        Pending Verifications
      </h1>

      {users.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow">
          <h2 className="text-xl font-semibold">
            No pending verification requests.
          </h2>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Roll Number</th>
                <th className="p-4 text-left">Department</th>
                <th className="p-4 text-left">Passenger</th>
                <th className="p-4 text-left">Driver</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.rollNumber}</td>
                  <td className="p-4">{user.department}</td>
                  <td className="p-4 capitalize">
                    {user.verification.passengerStatus}
                  </td>
                  <td className="p-4 capitalize">
                    {user.verification.driverStatus}
                  </td>
                  <td className="p-4 text-center">
                    <Link
                      to={`/admin/verification/${user._id}`}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}