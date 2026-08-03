import {
  FaCarSide,
  FaUserShield,
  FaRoute,
  FaClock,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      {/* Hero */}
      <section
        id="home"
        className="relative overflow-hidden bg-linear-to-br from-blue-50 via-white to-indigo-100"
      >
        <div className="mx-auto grid min-h-[70vh] max-w-7xl items-center gap-10 px-6 py-12 lg:grid-cols-2">

          <div>
            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              🚗 SSUET Verified Carpooling Platform
            </span>

            <h1 className="mt-6 text-5xl font-extrabold leading-tight text-slate-900 lg:text-6xl">
              Ride Together.
              <br />
              Save Money.
              <br />
              Travel Safely.
            </h1>

            <p className="mt-6 max-w-lg text-lg text-slate-600">
              Connect with verified SSUET students, share rides, reduce travel
              expenses and enjoy a safer journey to campus.
            </p>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => navigate("/login")}
                className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Get Started
              </button>

              <button
                onClick={() => scrollToSection("features")}
                className="rounded-xl border border-slate-300 px-8 py-3 font-semibold transition hover:bg-slate-100"
              >
                Learn More
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative flex h-80 w-80 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-indigo-700 shadow-2xl">
              <FaCarSide className="text-[140px] text-white" />
            </div>
          </div>

        </div>
      </section>

      {/* Stats */}
      <section className="relative z-20 mx-auto -mt-10 max-w-6xl px-6">
        <div className="grid gap-6 rounded-3xl bg-white p-8 shadow-2xl md:grid-cols-4">
          <Stat title="500+" text="Students" />
          <Stat title="150+" text="Daily Rides" />
          <Stat title="100%" text="Verified Users" />
          <Stat title="24/7" text="Availability" />
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        style={{ scrollMarginTop: "90px" }}
        className="mx-auto max-w-7xl px-6 py-24"
      >
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-slate-900">
            Why Choose GoTogether?
          </h2>

          <p className="mt-4 text-slate-500">
            Built exclusively for SSUET students.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard
            icon={<FaUserShield />}
            title="Verified Students"
            text="Every member is verified using their official SSUET email before accessing the platform."
          />

          <FeatureCard
            icon={<FaRoute />}
            title="Smart Ride Matching"
            text="Quickly discover rides that match your route, destination and travel schedule."
          />

          <FeatureCard
            icon={<FaClock />}
            title="Save Time & Money"
            text="Reduce fuel costs, avoid unnecessary travel expenses and enjoy convenient daily commuting."
          />
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        style={{ scrollMarginTop: "90px" }}
        className="bg-slate-50 py-24"
      >
        <div className="mx-auto max-w-6xl px-6">

          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold text-slate-900">
              How It Works
            </h2>

            <p className="mt-4 text-slate-500">
              Get started in three simple steps.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<FaUserShield />}
              title="Register"
              text="Create your account using your official SSUET email."
            />

            <FeatureCard
              icon={<FaRoute />}
              title="Get Verified"
              text="Complete your profile and receive admin verification."
            />

            <FeatureCard
              icon={<FaCarSide />}
              title="Share or Join"
              text="Create rides or join rides with verified students."
            />
          </div>

        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        style={{ scrollMarginTop: "90px" }}
        className="bg-blue-700 py-20 text-white"
      >
        <div className="mx-auto max-w-5xl px-6 text-center">

          <h2 className="text-4xl font-bold">
            Contact Us
          </h2>

          <p className="mt-6 text-lg text-blue-100">
            Have questions? We're here to help.
          </p>

          <div className="mt-10 space-y-2">
            <p>📧 support@ssuetgotogether.com</p>
            <p>📍 Sir Syed University of Engineering & Technology, Karachi</p>
            <p>📞 +92 300 1234567</p>
          </div>

        </div>
      </section>
    </>
  );
}

function Stat({ title, text }) {
  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold text-blue-600">{title}</h2>
      <p className="mt-2 text-slate-500">{text}</p>
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-3xl text-blue-600">
        {icon}
      </div>

      <h3 className="text-2xl font-bold">{title}</h3>

      <p className="mt-4 text-slate-500">{text}</p>
    </div>
  );
}