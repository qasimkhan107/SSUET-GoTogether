import { motion } from "framer-motion";

export default function StatCard({
  title,
  value,
  icon,
  color = "bg-blue-600",
}) {
  return (
    <motion.div
      whileHover={{
        y: -5,
        scale: 1.02,
      }}
      className="rounded-3xl bg-white p-6 shadow transition"
    >
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </h2>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl text-white ${color}`}
        >
          {icon}
        </div>

      </div>
    </motion.div>
  );
}