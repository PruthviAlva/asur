import { Link } from "react-router-dom";
import { PlayCircle, ChevronRight } from "lucide-react";
import { useContinueWatching } from "../../hooks/useWatchlist";
import { useAuth } from "../../context/AuthContext";
import ContinueWatchingCard from "./ContinueWatchingCard";

export default function ContinueWatchingRow() {
  const { user } = useAuth();
  const { data, isLoading } = useContinueWatching();

  // Don't render anything if not logged in
  if (!user) return null;

  const items = data?.data || [];

  // Don't render row if watchlist is empty
  if (!isLoading && items.length === 0) return null;

  return (
    <section className="mb-10">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-blue-500 rounded-full" />
          <PlayCircle className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-bold text-white">Continue Watching</h2>
          {items.length > 0 && (
            <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          )}
        </div>
        <Link
          to="/watchlist"
          className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Horizontal scroll row */}
      {isLoading ? (
        // Skeleton
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex-shrink-0 w-36 animate-pulse">
                <div className="aspect-[2/3] rounded-lg bg-white/5" />
                <div className="mt-2 h-3 bg-white/5 rounded w-4/5" />
                <div className="mt-1 h-3 bg-white/5 rounded w-3/5" />
              </div>
            ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {items.map((item) => (
            <ContinueWatchingCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
