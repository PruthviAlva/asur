import { Link } from "react-router-dom";
import { Trash2, Minus, Plus } from "lucide-react";
import {
  useWatchlist,
  useWatchlistMutations,
  useContinueWatching,
} from "../hooks/useWatchlist";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/common/LoadingSpinner";

const STATUS_OPTIONS = [
  { value: "WATCHING", label: "Watching" },
  { value: "PLANNING", label: "Planning" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ON_HOLD", label: "On Hold" },
  { value: "DROPPED", label: "Dropped" },
];

const statusColors = {
  WATCHING: "text-blue-400   bg-blue-500/10   border-blue-500/30",
  PLANNING: "text-gray-400   bg-white/5       border-white/10",
  COMPLETED: "text-green-400  bg-green-500/10  border-green-500/30",
  ON_HOLD: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  DROPPED: "text-red-400    bg-red-500/10    border-red-500/30",
};

export default function WatchlistPage() {
  const { user } = useAuth();
  const { data, isLoading } = useWatchlist();
  const { updateStatus, remove } = useWatchlistMutations();
  const { updateProgress } = useContinueWatching();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-gray-400">Sign in to view your watchlist.</p>
        <Link
          to="/login"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (isLoading) return <LoadingSpinner fullScreen />;

  const items = data?.data || [];

  // Group items by status for summary counts
  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s.value] = items.filter((i) => i.status === s.value).length;
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* ── Page Header ───────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white mb-1">My Watchlist</h1>
        <p className="text-gray-500 text-sm">{items.length} anime saved</p>
      </div>

      {/* ── Status Summary Pills ──────────────────── */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {STATUS_OPTIONS.map(
            (s) =>
              counts[s.value] > 0 && (
                <span
                  key={s.value}
                  className={`text-xs px-3 py-1 rounded-full border font-medium ${statusColors[s.value]}`}
                >
                  {s.label}: {counts[s.value]}
                </span>
              ),
          )}
        </div>
      )}

      {/* ── Empty State ───────────────────────────── */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-600">
          <p className="text-lg">Your watchlist is empty.</p>
          <Link
            to="/anime"
            className="text-orange-500 hover:text-orange-400 transition-colors"
          >
            Browse Anime →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((item) => (
            <WatchlistCard
              key={item.id}
              item={item}
              onStatusChange={(status) =>
                updateStatus.mutate({ animeId: item.animeId, status })
              }
              onRemove={() => remove.mutate(item.animeId)}
              onProgressChange={(progress) =>
                updateProgress.mutate({ animeId: item.animeId, progress })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Watchlist Card ────────────────────────────────
function WatchlistCard({ item, onStatusChange, onRemove, onProgressChange }) {
  return (
    <div className="group relative rounded-xl overflow-hidden border border-white/5 bg-white/5 hover:border-white/10 transition-all">
      {/* Cover image */}
      <Link to={`/anime/${item.animeId}`}>
        <div className="aspect-[2/3] overflow-hidden relative">
          <img
            src={item.animeCover}
            alt={item.animeTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Progress bar at bottom of image — only for WATCHING */}
          {item.status === "WATCHING" && (
            <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{
                  width: `${Math.min(100, ((item.progress || 0) / 12) * 100)}%`,
                }}
              />
            </div>
          )}
        </div>
      </Link>

      {/* Remove button — top right, visible on hover */}
      <button
        onClick={onRemove}
        title="Remove from watchlist"
        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {/* Info section */}
      <div className="p-2 space-y-1.5">
        {/* Title */}
        <Link to={`/anime/${item.animeId}`}>
          <p className="text-xs font-medium text-gray-300 hover:text-white transition-colors line-clamp-2 leading-tight">
            {item.animeTitle}
          </p>
        </Link>

        {/* Status selector */}
        <select
          value={item.status}
          onChange={(e) => onStatusChange(e.target.value)}
          className={`w-full text-xs px-2 py-1 rounded-lg border outline-none cursor-pointer font-medium ${statusColors[item.status]}`}
          style={{ backgroundColor: "transparent" }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              style={{ backgroundColor: "#1a1a1a", color: "#e5e7eb" }}
            >
              {opt.label}
            </option>
          ))}
        </select>

        {/* Episode progress — only shown when WATCHING */}
        {item.status === "WATCHING" && (
          <div className="flex items-center gap-1">
            {/* Decrease episode */}
            <button
              onClick={() =>
                onProgressChange(Math.max(0, (item.progress || 0) - 1))
              }
              disabled={!item.progress || item.progress <= 0}
              className="p-1 rounded bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>

            {/* Current episode */}
            <span className="text-xs text-gray-400 flex-1 text-center">
              Ep {item.progress || 0}
            </span>

            {/* Increase episode */}
            <button
              onClick={() => onProgressChange((item.progress || 0) + 1)}
              className="p-1 rounded bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
