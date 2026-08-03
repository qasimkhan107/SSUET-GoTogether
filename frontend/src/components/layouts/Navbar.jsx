import { FaCarSide } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    if (window.location.pathname !== "/") {
      navigate("/");

      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
        });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <button
          onClick={() => scrollToSection("home")}
          className="flex items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white shadow-lg">
            <FaCarSide />
          </div>

          <div className="text-left">
            <h1 className="text-2xl font-extrabold text-slate-900">
              GoTogether
            </h1>

            <p className="text-xs text-slate-500">
              SSUET Verified Carpooling
            </p>
          </div>
        </button>

        {/* Navigation */}
        <nav className="hidden items-center gap-10 font-medium text-slate-600 lg:flex">

          <button
            onClick={() => scrollToSection("home")}
            className="transition hover:text-blue-600"
          >
            Home
          </button>

          <button
            onClick={() => scrollToSection("features")}
            className="transition hover:text-blue-600"
          >
            Features
          </button>

          <button
            onClick={() => scrollToSection("how-it-works")}
            className="transition hover:text-blue-600"
          >
            How it Works
          </button>

          <button
            onClick={() => scrollToSection("contact")}
            className="transition hover:text-blue-600"
          >
            Contact
          </button>

        </nav>

        {/* Buttons */}
        <div className="flex items-center gap-4">

          <button
            onClick={() => navigate("/login")}
            className="rounded-xl border border-slate-300 px-5 py-2.5 font-medium transition hover:bg-slate-100"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white shadow-lg transition hover:bg-blue-700"
          >
            Register
          </button>

        </div>

      </div>
    </header>
  );
}