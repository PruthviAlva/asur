import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, Plus, Star, Calendar, Tv } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HeroBanner({ animeList = [] }) {
  const [current, setCurrent] = useState(0);

  // Auto-rotate every 6 seconds
  useEffect(() => {
    if (animeList.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % animeList.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [animeList.length]);

  if (animeList.length === 0) {
    // Skeleton state
    return (
      <div className="relative h-[70vh] bg-white/5 animate-pulse rounded-xl mb-10" />
    );
  }

  const anime = animeList[current];
  const backdrop = anime.images?.jpg?.large_image_url;
  const title = anime.title_english || anime.title;
  const synopsis = anime.synopsis?.slice(0, 200);

  return (
    <div className="relative h-[70vh] rounded-xl overflow-hidden mb-10">
      {/* Background image with crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={backdrop}
            alt={title}
            className="w-full h-full object-cover object-top"
          />
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12 max-w-2xl">
        {/* Currently Airing badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
            ● AIRING
          </span>
          {anime.score && (
            <span className="flex items-center gap-1 bg-white/10 text-white text-xs px-2 py-1 rounded">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              {anime.score}
            </span>
          )}
        </div>

        {/* Title */}
        <motion.h1
          key={`title-${current}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight"
        >
          {title}
        </motion.h1>

        {/* Meta info */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
          {anime.episodes && (
            <span className="flex items-center gap-1">
              <Tv className="w-4 h-4" /> {anime.episodes} Episodes
            </span>
          )}
          {anime.season && (
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {anime.season} {anime.year}
            </span>
          )}
          {anime.genres?.slice(0, 3).map((g) => (
            <span key={g.mal_id} className="text-orange-400">
              {g.name}
            </span>
          ))}
        </div>

        {/* Synopsis */}
        <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-lg line-clamp-3">
          {synopsis}
          {synopsis?.length === 200 ? "..." : ""}
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-3">
          <Link
            to={`/anime/${anime.mal_id}`}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            <Play className="w-4 h-4 fill-white" /> Watch Now
          </Link>
          <Link
            to={`/anime/${anime.mal_id}`}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors backdrop-blur-sm"
          >
            <Plus className="w-4 h-4" /> Add to List
          </Link>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 right-8 flex gap-2 z-10">
        {animeList.slice(0, 5).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all rounded-full ${
              i === current
                ? "w-6 h-2 bg-orange-500"
                : "w-2 h-2 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
