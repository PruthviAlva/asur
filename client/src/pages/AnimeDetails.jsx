import { useParams, Link } from "react-router-dom";
import { useRef } from "react";
import {
  Star,
  Tv,
  Trophy,
  Users,
  Clock,
  CheckCircle,
  Play,
  ArrowLeft,
  Heart,
} from "lucide-react";
import { useAnimeDetails } from "../hooks/useAnime";
import LoadingSpinner from "../components/common/LoadingSpinner";
import StreamingPlatforms from "../components/anime/StreamingPlatforms";
import YoutubePlayer from "../components/anime/YoutubePlayer";
import RelatedAnime from "../components/anime/RelatedAnime";
import WatchlistButton from "../components/anime/WatchlistButton";
import FavoriteButton from "../components/anime/FavoriteButton";

export default function AnimeDetails() {
  const { id } = useParams();
  const { data, isLoading, isError } = useAnimeDetails(id);

  // Ref to scroll to player when Episodes card is clicked
  const playerRef = useRef(null);
  const scrollToPlayer = () => {
    playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  if (isError || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-gray-400">Failed to load anime details.</p>
        <Link to="/anime" className="text-orange-500 hover:underline">
          ← Back to Anime
        </Link>
      </div>
    );
  }

  const anime = data.data;
  const title = anime.title_english || anime.title;
  const backdrop = anime.images?.jpg?.large_image_url;
  const trailer = anime.trailer;

  // Stat cards config — Episodes is clickable
  const stats = [
    {
      icon: Tv,
      label: "Episodes",
      value: anime.episodes || "N/A",
      clickable: true,
      onClick: scrollToPlayer,
      tooltip: "Click to watch",
    },
    {
      icon: Trophy,
      label: "Rank",
      value: anime.rank ? `#${anime.rank}` : "N/A",
      clickable: false,
    },
    {
      icon: Users,
      label: "Popularity",
      value: anime.popularity ? `#${anime.popularity}` : "N/A",
      clickable: false,
    },
    {
      icon: Clock,
      label: "Duration",
      value: anime.duration?.replace(" per ep", "") || "N/A",
      clickable: false,
    },
    {
      icon: CheckCircle,
      label: "Status",
      value: anime.status || "N/A",
      clickable: false,
    },
    {
      icon: Star,
      label: "Score",
      value: anime.score || "N/A",
      clickable: false,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* ── Hero Banner ───────────────────────────── */}
      <div className="relative h-[55vh] overflow-hidden">
        {/* Backdrop image */}
        <img
          src={backdrop}
          alt={title}
          className="w-full h-full object-cover object-top"
        />
        {/* Gradients for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-end pb-8 px-4 md:px-8">
          <div className="max-w-7xl w-full mx-auto flex gap-6 items-end">
            {/* Cover poster */}
            <div className="hidden md:block flex-shrink-0 w-36 rounded-xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src={backdrop}
                alt={title}
                className="w-full aspect-[2/3] object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {/* Back link */}
              <Link
                to="/anime"
                className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-3 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Anime
              </Link>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-2">
                {anime.genres?.slice(0, 4).map((g) => (
                  <span
                    key={g.mal_id}
                    className="text-xs px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  >
                    {g.name}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2">
                {title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-4">
                {anime.score && (
                  <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                    <Star className="w-4 h-4 fill-yellow-400" />
                    {anime.score}
                  </span>
                )}
                {anime.type && (
                  <span className="bg-white/10 px-2 py-0.5 rounded">
                    {anime.type}
                  </span>
                )}
                {anime.status && <span>{anime.status}</span>}
                {anime.season && (
                  <span className="capitalize">
                    {anime.season} {anime.year}
                  </span>
                )}
                {anime.studios?.[0] && (
                  <span className="text-orange-400">
                    {anime.studios[0].name}
                  </span>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={scrollToPlayer}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
                >
                  <Play className="w-4 h-4 fill-white" /> Watch Now
                </button>
                <WatchlistButton anime={anime} />
                <FavoriteButton anime={anime} type="ANIME" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ──────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-10">
        {/* Synopsis */}
        <section>
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <div className="w-1 h-5 bg-orange-500 rounded-full" />
            Synopsis
          </h2>
          <p className="text-gray-400 leading-relaxed max-w-4xl">
            {anime.synopsis || "No synopsis available."}
          </p>
        </section>

        {/* Stat Cards */}
        <section>
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <div className="w-1 h-5 bg-orange-500 rounded-full" />
            Details
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </section>

        {/* Streaming Platforms */}
        <StreamingPlatforms title={title} type="anime" />

        {/* YouTube Player */}
        <div ref={playerRef}>
          <YoutubePlayer anime={anime} />
        </div>

        {/* Related Anime */}
        <RelatedAnime animeId={id} relations={anime.relations} />
      </div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────
function StatCard({ icon: Icon, label, value, clickable, onClick, tooltip }) {
  const base = `
    rounded-xl p-4 flex flex-col items-center gap-2 text-center
    border transition-all duration-200
  `;
  const style = clickable
    ? `${base} border-orange-500/40 bg-orange-500/10 hover:bg-orange-500/20 cursor-pointer group`
    : `${base} border-white/5 bg-white/5`;

  return (
    <div
      className={style}
      onClick={clickable ? onClick : undefined}
      title={tooltip}
    >
      <Icon
        className={`w-5 h-5 ${clickable ? "text-orange-400 group-hover:scale-110 transition-transform" : "text-gray-500"}`}
      />
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <p
          className={`text-base font-bold ${clickable ? "text-orange-400" : "text-white"}`}
        >
          {value}
        </p>
        {clickable && (
          <p className="text-xs text-orange-500/70 mt-0.5">▶ Watch</p>
        )}
      </div>
    </div>
  );
}
