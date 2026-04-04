import { useState } from "react";
import { Plus, Check, Trash2, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  useWatchlistStatus,
  useWatchlistMutations,
} from "../../hooks/useWatchlist";
import { Link } from "react-router-dom";

const STATUS_OPTIONS = [
  { value: "WATCHING", label: "▶ Watching" },
  { value: "PLANNING", label: "📅 Planning" },
  { value: "COMPLETED", label: "✅ Completed" },
  { value: "ON_HOLD", label: "⏸ On Hold" },
  { value: "DROPPED", label: "🗑 Dropped" },
];

export default function WatchlistButton({ anime }) {
  const { user } = useAuth();
  const entry = useWatchlistStatus(anime.mal_id);
  const { add, updateStatus, remove } = useWatchlistMutations();
  const [hovering, setHovering] = useState(false);
  const [showDrop, setShowDrop] = useState(false);

  // Not logged in — prompt to login
  if (!user) {
    return (
      <Link
        to="/login"
        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" /> Add to Watchlist
      </Link>
    );
  }

  const isAdded = !!entry;

  const handleAdd = (status = "PLANNING") => {
    add.mutate({
      animeId: anime.mal_id,
      animeTitle: anime.title_english || anime.title,
      animeCover: anime.images?.jpg?.image_url || "",
      status,
    });
    setShowDrop(false);
  };

  const handleRemove = () => remove.mutate(anime.mal_id);

  const handleStatusChange = (status) => {
    updateStatus.mutate({ animeId: anime.mal_id, status });
    setShowDrop(false);
  };

  // ── Already in watchlist ──
  if (isAdded) {
    return (
      <div className="relative flex items-center gap-1">
        {/* Main button — green normally, red on hover */}
        <button
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onClick={handleRemove}
          disabled={remove.isPending}
          className={`flex items-center gap-2 font-semibold px-5 py-2.5 rounded-l-lg transition-all ${
            hovering
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {hovering ? (
            <>
              <Trash2 className="w-4 h-4" /> Remove
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />{" "}
              {STATUS_OPTIONS.find((s) => s.value === entry.status)?.label ||
                "In Watchlist"}
            </>
          )}
        </button>

        {/* Dropdown toggle */}
        <button
          onClick={() => setShowDrop(!showDrop)}
          className="bg-green-700 hover:bg-green-800 text-white px-2 py-2.5 rounded-r-lg transition-colors border-l border-green-500/30"
        >
          <ChevronDown className="w-4 h-4" />
        </button>

        {/* Status dropdown */}
        {showDrop && (
          <div
            className="absolute top-full left-0 mt-1 w-44 rounded-xl border border-white/10 shadow-xl z-20 overflow-hidden"
            style={{ backgroundColor: "var(--color-surface-2)" }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleStatusChange(opt.value)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-white/10 ${
                  entry.status === opt.value
                    ? "text-orange-400"
                    : "text-gray-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Not in watchlist ──
  return (
    <div className="relative flex items-center gap-1">
      <button
        onClick={() => handleAdd("PLANNING")}
        disabled={add.isPending}
        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-l-lg transition-colors"
      >
        {add.isPending ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <Plus className="w-4 h-4" /> Add to Watchlist
          </>
        )}
      </button>

      {/* Quick-add with specific status */}
      <button
        onClick={() => setShowDrop(!showDrop)}
        className="bg-orange-600 hover:bg-orange-700 text-white px-2 py-2.5 rounded-r-lg transition-colors border-l border-orange-400/30"
      >
        <ChevronDown className="w-4 h-4" />
      </button>

      {showDrop && (
        <div
          className="absolute top-full left-0 mt-1 w-44 rounded-xl border border-white/10 shadow-xl z-20 overflow-hidden"
          style={{ backgroundColor: "var(--color-surface-2)" }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleAdd(opt.value)}
              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
