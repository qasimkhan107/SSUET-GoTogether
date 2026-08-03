import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/my-bookings");

      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      const res = await API.put(`/bookings/${id}/cancel`);

      toast.success(res.data.message);

      fetchBookings();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to cancel booking."
      );
    }
  };

  const submitReview = async () => {
  try {
    const res = await API.post("/reviews", {
      bookingId: selectedBooking._id,
      rating,
      review,
    });

    toast.success(res.data.message);

    setShowReviewModal(false);
    setSelectedBooking(null);
    setRating(5);
    setReview("");

    fetchBookings();

  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Failed to submit review."
    );
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
    <div className="space-y-6">

      <h1 className="text-3xl font-bold text-slate-800">
        My Bookings
      </h1>

      {bookings.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
          <h2 className="text-2xl font-semibold">
            No bookings found.
          </h2>

          <p className="mt-2 text-slate-500">
            Book a ride to see it here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">

          {bookings.map((booking) => (

            <div
              key={booking._id}
              className="rounded-3xl bg-white p-6 shadow-lg"
            >

              <div className="flex items-start justify-between">

                <div>

                  <h2 className="text-2xl font-bold">
                    {booking.ride?.pickup?.address} →{" "}
                    {booking.ride?.destination?.address}
                  </h2>

                  <p className="mt-2 text-slate-500">
                    {new Date(
                      booking.ride?.departureTime
                    ).toLocaleString()}
                  </p>

                </div>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    booking.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : booking.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : booking.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {booking.status}
                </span>

              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">

                <div>
                  <p className="text-sm text-slate-500">
                    Driver
                  </p>

                  <p className="text-lg font-semibold">
                    {booking.ride?.driver?.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Phone
                  </p>

                  <p className="text-lg font-semibold">
                    {booking.ride?.driver?.phone}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Seats
                  </p>

                  <p className="text-lg font-semibold">
                    {booking.seatsBooked}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Total Fare
                  </p>

                  <p className="text-lg font-semibold">
                    Rs.{" "}
                    {booking.seatsBooked *
                      booking.ride?.pricePerSeat}
                  </p>
                </div>

              </div>

              {booking.status === "pending" && (

                <button
                  onClick={() =>
                    cancelBooking(booking._id)
                  }
                  className="mt-6 rounded-xl bg-red-600 px-6 py-2 font-semibold text-white hover:bg-red-700"
                >
                  Cancel Booking
                </button>

              )}

              {booking.status === "completed" && (
  <button
    onClick={() => {
      setSelectedBooking(booking);
      setShowReviewModal(true);
    }}
    className="mt-6 ml-3 rounded-xl bg-yellow-500 px-6 py-2 font-semibold text-white hover:bg-yellow-600"
  >
    ⭐ Rate Driver
  </button>
)}

            </div>

          ))}

        </div>
      )}

      {showReviewModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

    <div className="w-full max-w-lg rounded-3xl bg-white p-8">

      <h2 className="mb-6 text-2xl font-bold">
        Rate Driver
      </h2>

      <label className="block mb-2 font-medium">
        Rating
      </label>

      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="mb-5 w-full rounded-xl border p-3"
      >
        <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
        <option value={4}>⭐⭐⭐⭐ (4)</option>
        <option value={3}>⭐⭐⭐ (3)</option>
        <option value={2}>⭐⭐ (2)</option>
        <option value={1}>⭐ (1)</option>
      </select>

      <label className="block mb-2 font-medium">
        Review
      </label>

      <textarea
        rows="4"
        value={review}
        onChange={(e) => setReview(e.target.value)}
        className="w-full rounded-xl border p-3"
        placeholder="Share your experience..."
      />

      <div className="mt-6 flex gap-3">

        <button
          onClick={submitReview}
          className="rounded-xl bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          Submit
        </button>

        <button
          onClick={() => setShowReviewModal(false)}
          className="rounded-xl bg-gray-500 px-6 py-2 text-white hover:bg-gray-600"
        >
          Cancel
        </button>

      </div>

    </div>

  </div>
)}

    </div>
  );
}