import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { useRecommendations } from "../../hooks/useAniList";

export default function AniListRecommendations({ malId, type = "ANIME" }) {
  const { data, isLoading } = useRecommendations(malId, type);

  const recs =
    data?.Media?.recommendations?.nodes?.filter(
      (n) => n.mediaRecommendation?.idMal,
    ) || [];

  if (isLoading || !recs.length) return null;

  return (
    <section>
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <div className="w-1 h-5 bg-orange-500 rounded-full" />
        Recommended For You
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {recs.slice(0, 10).map(({ rating, mediaRecommendation: rec }) => {
          const href = `/${rec.type?.toLowerCase() || "anime"}/${rec.idMal}`;
          const title = rec.title?.english || rec.title?.romaji;

          return (
            <Link key={rec.idMal} to={href} className="group">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-white/5 mb-2">
                <img
                  src={rec.coverImage?.large}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {/* Score overlay */}
                {rec.averageScore && (
                  <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/70 backdrop-blur-sm rounded px-1.5 py-0.5">
                    <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-xs">
                      {rec.averageScore}%
                    </span>
                  </div>
                )}
                {/* Rating badge */}
                {rating > 0 && (
                  <div className="absolute bottom-2 left-2 bg-orange-500/80 text-white text-xs px-1.5 py-0.5 rounded">
                    👍 {rating}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400 group-hover:text-white transition-colors line-clamp-2 leading-tight">
                {title}
              </p>
              {rec.genres?.slice(0, 2).map((g) => (
                <span key={g} className="text-xs text-orange-400/60 mr-1">
                  {g}
                </span>
              ))}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
