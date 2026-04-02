import { Link } from "react-router-dom";
import { Star, Play, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function AnimeCard({ anime, type = "anime", rank = null }) {
  // Jikan returns slightly different shapes for anime vs manga
  const id = anime.mal_id;
  const title = anime.title_english || anime.title;
  const cover =
    anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
  const score = anime.score;
  const episodes = type === "anime" ? anime.episodes : anime.chapters;
  const status = anime.status;
  const href = `/${type}/${id}`;

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative group"
    >
      <Link to={href} className="block">
        {/* Rank number — shown in Top 10 row */}
        {rank && (
          <div
            className="absolute -left-3 -bottom-2 z-10 font-black select-none leading-none"
            style={{
              fontSize: "5rem",
              color: "transparent",
              WebkitTextStroke: "2px rgba(249,115,22,0.6)", // orange outline only
              lineHeight: 1,
            }}
          >
            {rank}
          </div>
        )}

        {/* Card image */}
        <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-surface-2">
          <img
            src={cover}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* Gradient overlay — always visible at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent" />

          {/* Score badge — top right */}
          {score && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-md px-1.5 py-0.5">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-semibold text-white">{score}</span>
            </div>
          )}

          {/* Type badge — top left */}
          <div className="absolute top-2 left-2 bg-orange-500/90 rounded-md px-1.5 py-0.5">
            <span className="text-xs font-bold text-white uppercase">
              {anime.type || type}
            </span>
          </div>

          {/* Play button overlay — appears on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-orange-500 rounded-full p-3 shadow-lg shadow-orange-500/50">
              {type === "anime" ? (
                <Play className="w-5 h-5 text-white fill-white" />
              ) : (
                <BookOpen className="w-5 h-5 text-white" />
              )}
            </div>
          </div>

          {/* Episode/chapter count — bottom left */}
          {episodes && (
            <div className="absolute bottom-2 left-2 text-xs text-gray-300">
              {type === "anime" ? `${episodes} eps` : `${episodes} ch`}
            </div>
          )}
        </div>

        {/* Title below card */}
        <div className="mt-2 px-1">
          <p className="text-sm font-medium text-gray-200 line-clamp-2 leading-tight group-hover:text-orange-400 transition-colors">
            {title}
          </p>
          {status && <p className="text-xs text-gray-500 mt-0.5">{status}</p>}
        </div>
      </Link>
    </motion.div>
  );
}
