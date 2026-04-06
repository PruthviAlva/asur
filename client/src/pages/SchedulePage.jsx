import { useState } from "react";
import { Calendar, Tv, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFullSchedule } from "../hooks/useSchedule";
import ScheduleCard from "../components/anime/ScheduleCard";
import LoadingSpinner from "../components/common/LoadingSpinner";

const DAYS = [
  { key: "monday", label: "Monday", short: "Mon" },
  { key: "tuesday", label: "Tuesday", short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday", label: "Thursday", short: "Thu" },
  { key: "friday", label: "Friday", short: "Fri" },
  { key: "saturday", label: "Saturday", short: "Sat" },
  { key: "sunday", label: "Sunday", short: "Sun" },
];

// Get today's day key
const getTodayKey = () => {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return days[new Date().getDay()];
};

export default function SchedulePage() {
  const todayKey = getTodayKey();
  const [activeDay, setActiveDay] = useState(todayKey);

  const { data: schedule, isLoading } = useFullSchedule();

  const activeAnime = schedule?.[activeDay] || [];
  const todayAnime = schedule?.[todayKey] || [];

  // Navigate days with arrows
  const currentIndex = DAYS.findIndex((d) => d.key === activeDay);
  const goPrev = () => {
    const prev = DAYS[(currentIndex - 1 + 7) % 7];
    setActiveDay(prev.key);
  };
  const goNext = () => {
    const next = DAYS[(currentIndex + 1) % 7];
    setActiveDay(next.key);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* ── Page Header ───────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Calendar className="w-6 h-6 text-orange-500" />
          <h1 className="text-2xl font-black text-white">Airing Schedule</h1>
        </div>
        <p className="text-gray-500 text-sm">
          Weekly anime broadcast schedule — all times in JST
        </p>
      </div>

      {/* ── Today's Summary Banner ────────────────── */}
      {!isLoading && todayAnime.length > 0 && (
        <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0">
              <Tv className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold">
                {todayAnime.length} anime airing today
              </p>
              <p className="text-gray-500 text-sm">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveDay(todayKey)}
            className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
              activeDay === todayKey
                ? "bg-orange-500 text-white"
                : "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
            }`}
          >
            View Today →
          </button>
        </div>
      )}

      {/* ── Day Selector ──────────────────────────── */}
      <div className="flex items-center gap-2 mb-6">
        {/* Prev arrow */}
        <button
          onClick={goPrev}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Day tabs */}
        <div className="flex gap-1 flex-1 overflow-x-auto scrollbar-hide">
          {DAYS.map((day) => {
            const isToday = day.key === todayKey;
            const isActive = day.key === activeDay;
            const count = schedule?.[day.key]?.length || 0;

            return (
              <button
                key={day.key}
                onClick={() => setActiveDay(day.key)}
                className={`relative flex-shrink-0 flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                    : isToday
                      ? "bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500/20"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {/* Today indicator dot */}
                {isToday && !isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
                )}
                <span className="hidden sm:block">{day.label}</span>
                <span className="sm:hidden">{day.short}</span>
                {/* Anime count badge */}
                {!isLoading && count > 0 && (
                  <span
                    className={`text-xs ${isActive ? "text-orange-100" : "text-gray-600"}`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Next arrow */}
        <button
          onClick={goNext}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* ── Content Area ──────────────────────────── */}
      {isLoading ? (
        <LoadingSpinner fullScreen />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
          >
            {/* Day header */}
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-bold text-white capitalize">
                {activeDay}
                {activeDay === todayKey && (
                  <span className="ml-2 text-xs font-normal text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                    Today
                  </span>
                )}
              </h2>
              <span className="text-gray-500 text-sm">
                {activeAnime.length} anime airing
              </span>
            </div>

            {/* Anime grid */}
            {activeAnime.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-600">
                <Calendar className="w-12 h-12 mb-3 opacity-30" />
                <p>No schedule data for {activeDay}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeAnime.map((anime, i) => (
                  <ScheduleCard key={anime.mal_id} anime={anime} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
