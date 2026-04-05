import { Link } from "react-router-dom";
import { Play, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { useContinueWatching } from "../../hooks/useWatchlist";

export default function ContinueWatchingCard({ item }) {
  const { updateProgress } = useContinueWatching();

  const handleProgress = (e, delta) => {
    // Stop click from navigating to details page
    e.preventDefault();
    e.stopPropagation();
    const newProgress = Math.max(0, (item.progress || 0) + delta);
    updateProgress.mutate({ animeId: item.animeId, progress: newProgress });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ duration: 0.2 }}
      className="relative group flex-shrink-0 w-36"
    >
      <Link to={`/anime/${item.animeId}`} className="block">
        {/* Cover image */}
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-white/5">
          <img
            src={item.animeCover}
            alt={item.animeTitle}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200" />

          {/* Play button — center on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-orange-500 rounded-full p-2.5 shadow-lg shadow-orange-500/50">
              <Play className="w-4 h-4 text-white fill-white" />
            </div>
          </div>

          {/* Progress bar — bottom of image */}
          <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20">
            <div
              className="h-full bg-orange-500 transition-all duration-300"
              style={{
                width: `${
                  item.progress > 0
                    ? Math.min(100, (item.progress / 12) * 100) // rough estimate
                    : 5
                }%`,
              }}
            />
          </div>

          {/* Episode badge — top left */}
          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 rounded-md">
            Ep {item.progress || 0}
          </div>

          {/* WATCHING badge */}
          <div className="absolute top-2 right-2 bg-blue-500/80 text-white text-xs px-1.5 py-0.5 rounded-md font-medium">
            ▶
          </div>
        </div>

        {/* Title */}
        <p className="mt-2 text-xs font-medium text-gray-300 group-hover:text-white transition-colors line-clamp-2 leading-tight px-0.5">
          {item.animeTitle}
        </p>
      </Link>

      {/* Progress controls — shown on hover below title */}
      <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => handleProgress(e, -1)}
          disabled={item.progress <= 0}
          className="flex-1 flex items-center justify-center py-1 rounded bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="text-xs text-gray-500 px-1 flex-shrink-0">
          ep {item.progress || 0}
        </span>
        <button
          onClick={(e) => handleProgress(e, +1)}
          className="flex-1 flex items-center justify-center py-1 rounded bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}
