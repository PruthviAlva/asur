import { Link } from "react-router-dom";
import { Trash2, ExternalLink } from "lucide-react";
import { useWatchlist, useWatchlistMutations } from "../hooks/useWatchlist";
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

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-gray-400">Sign in to view your watchlist.</p>
        <Link
          to="/login"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (isLoading) return <LoadingSpinner fullScreen />;

  const items = data?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white mb-1">My Watchlist</h1>
        <p className="text-gray-500 text-sm">{items.length} anime saved</p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-600">
          <p className="text-lg">Your watchlist is empty.</p>
          <Link to="/anime" className="text-orange-500 hover:text-orange-400">
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
            />
          ))}
        </div>
      )}
    </div>
  );
}

function WatchlistCard({ item, onStatusChange, onRemove }) {
  return (
    <div className="group relative rounded-xl overflow-hidden border border-white/5 bg-white/5 hover:border-white/10 transition-all">
      {/* Cover */}
      <Link to={`/anime/${item.animeId}`}>
        <div className="aspect-[2/3] overflow-hidden">
          <img
            src={item.animeCover}
            alt={item.animeTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
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

      {/* Info + status selector */}
      <div className="p-2">
        <Link to={`/anime/${item.animeId}`}>
          <p className="text-xs font-medium text-gray-300 hover:text-white line-clamp-2 leading-tight mb-2">
            {item.animeTitle}
          </p>
        </Link>

        {/* Inline status selector */}
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
      </div>
    </div>
  );
}
