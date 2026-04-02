import { ExternalLink } from "lucide-react";
import { STREAMING_PLATFORMS } from "../../utils/constants";

// Badge color → Tailwind classes map
const badgeStyles = {
  green: "bg-green-500/20  text-green-400  border-green-500/30",
  orange: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  red: "bg-red-500/20    text-red-400    border-red-500/30",
  blue: "bg-blue-500/20   text-blue-400   border-blue-500/30",
  teal: "bg-teal-500/20   text-teal-400   border-teal-500/30",
  purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  pink: "bg-pink-500/20   text-pink-400   border-pink-500/30",
};

export default function StreamingPlatforms({ title, type = "anime" }) {
  const platforms = STREAMING_PLATFORMS[type] || [];

  const handleClick = (platform) => {
    // Opens: platformUrl + encoded anime title
    // e.g. https://crunchyroll.com/search?q=One+Piece
    const url = platform.url + encodeURIComponent(title);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section>
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <div className="w-1 h-5 bg-orange-500 rounded-full" />
        Where to Watch
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {platforms.map((platform) => (
          <button
            key={platform.name}
            onClick={() => handleClick(platform)}
            className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-center"
          >
            {/* Platform icon — emoji placeholder until we add real logos */}
            <div className="text-2xl">{platform.icon || "📺"}</div>

            {/* Platform name */}
            <span className="text-sm font-semibold text-white group-hover:text-orange-400 transition-colors leading-tight">
              {platform.name}
            </span>

            {/* Free/Sub badge */}
            <span
              className={`
              text-xs px-2 py-0.5 rounded-full border font-medium
              ${badgeStyles[platform.badgeColor] || badgeStyles.green}
            `}
            >
              {platform.badge}
            </span>

            {/* External link icon — appears on hover */}
            <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-gray-400 transition-colors" />
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-600 mt-3">
        * Availability varies by region. Clicking opens the platform's search
        for this title.
      </p>
    </section>
  );
}
