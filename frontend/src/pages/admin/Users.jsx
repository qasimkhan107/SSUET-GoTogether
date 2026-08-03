import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import toast from "react-hot-toast";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    try {
      if (loading) {
        setLoading(true);
      } else {
        setFetching(true);
      }

      const res = await API.get(
        `/admin/users?page=${page}&limit=10&search=${search}`
      );

      if (res.data.success) {
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages);
        setTotalUsers(res.data.totalUsers);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
      setFetching(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading...
        </h2>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg">

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <h1 className="text-3xl font-bold">
          Users
        </h1>

        <div className="relative w-full max-w-md">

          <input
            type="text"
            placeholder="Search by Name, Email or Roll Number..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="w-full rounded-xl border border-slate-300 py-3 pl-4 pr-12 outline-none focus:border-blue-600"
          />

          {fetching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
            </div>
          )}

        </div>

        <span className="rounded-xl bg-blue-100 px-4 py-2 font-semibold text-blue-700 whitespace-nowrap">
          Total Users: {totalUsers}
        </span>

      </div>

      {users.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 p-8 text-center">
          No users found.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">

            <table className="min-w-full border-collapse">

              <thead>
                <tr className="border-b bg-slate-100">
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Roll No</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b hover:bg-slate-50"
                  >
                    <td className="px-4 py-4">{user.name}</td>

                    <td className="px-4 py-4">
                      {user.rollNumber}
                    </td>

                    <td className="px-4 py-4 capitalize">
                      {user.role}
                    </td>

                    <td className="px-4 py-4">
                      {user.isBlocked ? (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
                          Blocked
                        </span>
                      ) : (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-600">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <Link
                        to={`/admin/users/${user._id}`}
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

          <div className="mt-6 flex items-center justify-between text-sm text-slate-600">

            <span>
              Showing {(page - 1) * 10 + 1} to{" "}
              {Math.min(page * 10, totalUsers)} of {totalUsers} users
            </span>

          </div>

          <div className="mt-8 flex items-center justify-center gap-2">

            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="rounded-lg border px-4 py-2 hover:bg-slate-100 disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index + 1)}
                  className={`h-10 w-10 rounded-lg font-semibold ${
                    page === index + 1
                      ? "bg-blue-600 text-white"
                      : "border hover:bg-slate-100"
                  }`}
                >
                  {index + 1}
                </button>
              )
            )}

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="rounded-lg border px-4 py-2 hover:bg-slate-100 disabled:opacity-40"
            >
              Next
            </button>

          </div>

        </>
      )}

    </div>
  );
}