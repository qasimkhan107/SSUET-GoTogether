import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import toast from "react-hot-toast";

export default function Rides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRides, setTotalRides] = useState(0);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchRides();
  }, [page, search, status]);

  const fetchRides = async () => {
    try {
      if (loading) {
        setLoading(true);
      } else {
        setFetching(true);
      }

      const res = await API.get(
        `/admin/rides?page=${page}&limit=10&search=${search}&status=${status}`
      );

      if (res.data.success) {
        setRides(res.data.rides);
        setTotalPages(res.data.totalPages);
        setTotalRides(res.data.totalRides);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load rides."
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

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">

        <h1 className="text-3xl font-bold">
          Ride Management
        </h1>

        <div className="flex items-center gap-3">

          <input
            type="text"
            placeholder="Search Driver..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="w-72 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
          />

          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            className="rounded-xl border border-slate-300 px-4 py-3"
          >
            <option value="">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <div className="w-24 text-sm font-medium text-blue-600">
            {fetching ? "Loading..." : ""}
          </div>

        </div>

        <span className="rounded-xl bg-blue-100 px-4 py-2 font-semibold text-blue-700">
          Total Rides: {totalRides}
        </span>

      </div>

      {rides.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 p-10 text-center">
          No rides found.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">

            <table className="min-w-full border-collapse">

              <thead>

                <tr className="border-b bg-slate-100">

                  <th className="px-4 py-3 text-left">
                    Driver
                  </th>

                  <th className="px-4 py-3 text-left">
                    Vehicle
                  </th>

                  <th className="px-4 py-3 text-left">
                    Seats
                  </th>

                  <th className="px-4 py-3 text-left">
                    Price
                  </th>

                  <th className="px-4 py-3 text-left">
                    Status
                  </th>

                  <th className="px-4 py-3 text-center">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {rides.map((ride) => (

                  <tr
                    key={ride._id}
                    className="border-b hover:bg-slate-50"
                  >

                    <td className="px-4 py-4">
                      {ride.driver?.name}
                    </td>

                    <td className="px-4 py-4">
                      {ride.vehicle?.registrationNumber}
                    </td>

                    <td className="px-4 py-4">
                      {ride.availableSeats}
                    </td>

                    <td className="px-4 py-4">
                      Rs. {ride.pricePerSeat}
                    </td>

                    <td className="px-4 py-4 capitalize">
                      {ride.status}
                    </td>

                    <td className="px-4 py-4 text-center">

                      <Link
                        to={`/admin/rides/${ride._id}`}
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
              {Math.min(page * 10, totalRides)} of {totalRides} rides
            </span>

          </div>

          <div className="mt-8 flex justify-center gap-2">

            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="rounded-lg border px-4 py-2 disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => (

              <button
                key={index}
                onClick={() => setPage(index + 1)}
                className={`h-10 w-10 rounded-lg ${
                  page === index + 1
                    ? "bg-blue-600 text-white"
                    : "border"
                }`}
              >
                {index + 1}
              </button>

            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="rounded-lg border px-4 py-2 disabled:opacity-40"
            >
              Next
            </button>

          </div>

        </>
      )}

    </div>
  );
}