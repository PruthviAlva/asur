import { useAniListMedia } from "../../hooks/useAniList";
import { TrendingUp, Heart, Users, ExternalLink } from "lucide-react";

export default function AniListStats({ malId, type = "ANIME" }) {
  const { data, isLoading } = useAniListMedia(malId, type);

  if (isLoading) {
    return (
      <div className="flex gap-3 animate-pulse">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="h-16 flex-1 rounded-xl bg-white/5" />
          ))}
      </div>
    );
  }

  const media = data?.Media;
  if (!media) return null;

  // Next episode countdown
  const nextEp = media.nextAiringEpisode;
  const timeUntil = nextEp ? formatTimeUntil(nextEp.timeUntilAiring) : null;

  const stats = [
    {
      label: "AniList Score",
      value: media.averageScore ? `${media.averageScore}%` : "N/A",
      icon: "⭐",
      color: "yellow",
    },
    {
      label: "Favourites",
      value: media.favourites?.toLocaleString() || "N/A",
      icon: "❤️",
      color: "pink",
    },
    {
      label: "Popularity",
      value: media.popularity?.toLocaleString() || "N/A",
      icon: "👥",
      color: "blue",
    },
    {
      label: "Trending Rank",
      value: media.trending ? `#${media.trending}` : "N/A",
      icon: "📈",
      color: "green",
    },
  ];

  const colorMap = {
    yellow: "bg-yellow-500/10 border-yellow-500/20",
    pink: "bg-pink-500/10   border-pink-500/20",
    blue: "bg-blue-500/10   border-blue-500/20",
    green: "bg-green-500/10  border-green-500/20",
  };

  return (
    <div className="space-y-4">
      {/* AniList header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <div className="w-1 h-5 bg-blue-500 rounded-full" />
          AniList Stats
        </h2>
        {media.siteUrl && (
          <a
            href={media.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            View on AniList <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl p-3 border flex flex-col items-center gap-1 text-center ${colorMap[stat.color]}`}
          >
            <span className="text-xl">{stat.icon}</span>
            <p className="text-base font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Next episode banner */}
      {nextEp && (
        <div className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3">
          <span className="text-2xl">📺</span>
          <div>
            <p className="text-white font-semibold text-sm">
              Episode {nextEp.episode} airing in
            </p>
            <p className="text-orange-400 font-bold">{timeUntil}</p>
          </div>
        </div>
      )}

      {/* Tags */}
      {media.tags?.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            Tags
          </p>
          <div className="flex flex-wrap gap-1.5">
            {media.tags
              .filter((t) => !t.isMediaSpoiler)
              .slice(0, 12)
              .map((tag) => (
                <span
                  key={tag.name}
                  className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10"
                  title={`${tag.rank}% match`}
                >
                  {tag.name}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* External streaming links from AniList */}
      {media.externalLinks?.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            Official Links
          </p>
          <div className="flex flex-wrap gap-2">
            {media.externalLinks.slice(0, 6).map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
                style={{
                  borderColor: link.color ? `${link.color}40` : undefined,
                }}
              >
                {link.icon && (
                  <img
                    src={link.icon}
                    alt={link.site}
                    className="w-3.5 h-3.5 rounded"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
                {link.site}
                <ExternalLink className="w-2.5 h-2.5 opacity-50" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Format seconds into readable countdown
function formatTimeUntil(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
