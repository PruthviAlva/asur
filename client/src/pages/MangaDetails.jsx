import { useParams, Link } from "react-router-dom";
import { useRef } from "react";
import {
  Star,
  BookOpen,
  Trophy,
  Users,
  CheckCircle,
  ArrowLeft,
  Heart,
  BookMarked,
} from "lucide-react";
import { useMangaDetails } from "../hooks/useAnime";
import LoadingSpinner from "../components/common/LoadingSpinner";
import StreamingPlatforms from "../components/anime/StreamingPlatforms";
import ChapterList from "../components/anime/ChapterList";
import AniListStats from "../components/anime/AniListStats";
import CharactersGrid from "../components/anime/CharactersGrid";
import StaffGrid from "../components/anime/StaffGrid";
import AniListRecommendations from "../components/anime/AniListRecommendations";

export default function MangaDetails() {
  const { id } = useParams();
  const { data, isLoading, isError } = useMangaDetails(id);
  const readerRef = useRef(null);

  const scrollToReader = () => {
    readerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  if (isError || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-gray-400">Failed to load manga details.</p>
        <Link to="/manga" className="text-orange-500 hover:underline">
          ← Back to Manga
        </Link>
      </div>
    );
  }

  const manga = data.data;
  const title = manga.title_english || manga.title;
  const cover = manga.images?.jpg?.large_image_url;

  const stats = [
    {
      icon: BookOpen,
      label: "Chapters",
      value: manga.chapters || "N/A",
      clickable: true,
      onClick: scrollToReader,
      tooltip: "Click to read",
    },
    { icon: BookMarked, label: "Volumes", value: manga.volumes || "N/A" },
    {
      icon: Trophy,
      label: "Rank",
      value: manga.rank ? `#${manga.rank}` : "N/A",
    },
    {
      icon: Users,
      label: "Popularity",
      value: manga.popularity ? `#${manga.popularity}` : "N/A",
    },
    { icon: CheckCircle, label: "Status", value: manga.status || "N/A" },
    { icon: Star, label: "Score", value: manga.score || "N/A" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[55vh] overflow-hidden">
        <img
          src={cover}
          alt={title}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />

        <div className="absolute inset-0 flex items-end pb-8 px-4 md:px-8">
          <div className="max-w-7xl w-full mx-auto">
            <Link
              to="/manga"
              className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-3 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Manga
            </Link>

            <div className="flex flex-wrap gap-2 mb-2">
              {manga.genres?.slice(0, 4).map((g) => (
                <span
                  key={g.mal_id}
                  className="text-xs px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30"
                >
                  {g.name}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-4">
              {manga.score && (
                <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                  <Star className="w-4 h-4 fill-yellow-400" /> {manga.score}
                </span>
              )}
              {manga.type && (
                <span className="bg-white/10 px-2 py-0.5 rounded">
                  {manga.type}
                </span>
              )}
              {manga.status && <span>{manga.status}</span>}
              {manga.authors?.[0] && (
                <span className="text-orange-400">{manga.authors[0].name}</span>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={scrollToReader}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                <BookOpen className="w-4 h-4" /> Start Reading
              </button>
              <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors">
                <Heart className="w-4 h-4" /> Favorite
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-10">
        {/* Synopsis */}
        <section>
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <div className="w-1 h-5 bg-orange-500 rounded-full" />
            Synopsis
          </h2>
          <p className="text-gray-400 leading-relaxed max-w-4xl">
            {manga.synopsis || "No synopsis available."}
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

        {/* Reading Platforms */}
        <StreamingPlatforms title={title} type="manga" />

        <AniListStats malId={id} type="MANGA" />
        <CharactersGrid malId={id} type="MANGA" />
        <StaffGrid malId={id} type="MANGA" />
        <AniListRecommendations malId={id} type="MANGA" />

        {/* Reader placeholder */}
        <section ref={readerRef}>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-1 h-5 bg-orange-500 rounded-full" />
            Read Online
          </h2>
          <ChapterList mangaTitle={title} malId={id} />
        </section>
      </div>
    </div>
  );
}

// Reuse StatCard (same as AnimeDetails)
function StatCard({ icon: Icon, label, value, clickable, onClick, tooltip }) {
  const base = `rounded-xl p-4 flex flex-col items-center gap-2 text-center border transition-all duration-200`;
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
          <p className="text-xs text-orange-500/70 mt-0.5">▶ Read</p>
        )}
      </div>
    </div>
  );
}
