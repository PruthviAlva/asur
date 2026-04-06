import { Link } from "react-router-dom";
import { Star, Plus, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  useWatchlistStatus,
  useWatchlistMutations,
} from "../../hooks/useWatchlist";

export default function ScheduleCard({ anime, index }) {
  const { user } = useAuth();
  const entry = useWatchlistStatus(anime.mal_id);
  const { add } = useWatchlistMutations();
  const isAdded = !!entry;

  const title = anime.title_english || anime.title;
  const cover = anime.images?.jpg?.image_url;
  const score = anime.score;
  const episodes = anime.episodes;

  // Format broadcast time if available
  const broadcastTime = anime.broadcast?.time ? anime.broadcast.time : null;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!user || isAdded) return;
    add.mutate({
      animeId: anime.mal_id,
      animeTitle: title,
      animeCover: cover || "",
      status: "PLANNING",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="group relative"
    >
      <Link to={`/anime/${anime.mal_id}`}>
        <div
          className="flex gap-3 p-3 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all duration-200"
          style={{ backgroundColor: "var(--color-surface-2)" }}
        >
          {/* Cover */}
          <div className="relative flex-shrink-0 w-14 h-20 rounded-lg overflow-hidden bg-white/5">
            {cover ? (
              <img
                src={cover}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-white/5 animate-pulse" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <p className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors line-clamp-2 leading-tight mb-1.5">
              {title}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-2">
              {score && (
                <span className="flex items-center gap-1 text-xs text-yellow-400">
                  <Star className="w-3 h-3 fill-yellow-400" />
                  {score}
                </span>
              )}
              {episodes && (
                <span className="text-xs text-gray-500">{episodes} eps</span>
              )}
              {anime.type && (
                <span className="text-xs bg-white/5 text-gray-400 px-1.5 py-0.5 rounded">
                  {anime.type}
                </span>
              )}
            </div>

            {/* Genres */}
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {anime.genres?.slice(0, 2).map((g) => (
                <span key={g.mal_id} className="text-xs text-orange-400/70">
                  {g.name}
                </span>
              ))}
            </div>
          </div>

          {/* Right side — time + add button */}
          <div className="flex flex-col items-end justify-between flex-shrink-0">
            {/* Broadcast time */}
            {broadcastTime && (
              <span className="text-xs font-mono text-gray-400 bg-white/5 px-2 py-1 rounded-lg">
                {broadcastTime} JST
              </span>
            )}

            {/* Quick add button */}
            {user && (
              <button
                onClick={handleQuickAdd}
                title={isAdded ? "In watchlist" : "Add to watchlist"}
                className={`p-1.5 rounded-lg transition-all ${
                  isAdded
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-white/5 text-gray-500 hover:bg-orange-500/20 hover:text-orange-400 border border-white/10 hover:border-orange-500/30"
                }`}
              >
                {isAdded ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
