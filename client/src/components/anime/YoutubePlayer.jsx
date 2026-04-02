import { useState } from "react";
import {
  Play,
  ExternalLink,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function YoutubePlayer({ anime }) {
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const trailer = anime?.trailer;

  // If no trailer available
  if (!trailer?.youtube_id) {
    return (
      <section>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-orange-500 rounded-full" />
          Watch Episodes
        </h2>
        <div
          className="rounded-xl p-8 flex flex-col items-center gap-3 text-center border border-white/5"
          style={{ backgroundColor: "var(--color-surface-2)" }}
        >
          <PlayCircle className="w-10 h-10 text-gray-600" />
          <p className="text-gray-400">No trailer available for this anime.</p>
          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent((anime?.title_english || anime?.title) + " episode 1")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-orange-500 hover:text-orange-400 text-sm"
          >
            Search on YouTube <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </section>
    );
  }

  // Build Muse Asia search URL for full episodes
  const title = anime.title_english || anime.title;
  const museAsiaUrl = `https://www.youtube.com/@MuseAsia/search?query=${encodeURIComponent(title)}`;

  // Use embed_url for iframe, url for links
  const embedUrl = trailer.embed_url
    ? `${trailer.embed_url}?autoplay=0&rel=0&modestbranding=1`
    : `https://www.youtube.com/embed/${trailer.youtube_id}?rel=0&modestbranding=1`;

  const watchUrl =
    trailer.url || `https://www.youtube.com/watch?v=${trailer.youtube_id}`;

  return (
    <section>
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <div className="w-1 h-5 bg-orange-500 rounded-full" />
        Watch / Trailer
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ── Video Player (takes 2/3 width on desktop) ── */}
        <div className="lg:col-span-2">
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
            <iframe
              src={embedUrl}
              title={`${title} Trailer`}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>

          {/* Controls below player */}
          <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
            <div>
              <p className="text-white font-semibold text-sm">{title}</p>
              <p className="text-gray-500 text-xs">Official Trailer</p>
            </div>
            <div className="flex gap-2">
              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                <PlayCircle className="w-3.5 h-3.5" /> Open in YouTube
              </a>
            </div>
          </div>
        </div>

        {/* ── Sidebar: Muse Asia + links ── */}
        <div
          className="rounded-xl border border-white/5 p-4 flex flex-col gap-4"
          style={{ backgroundColor: "var(--color-surface-2)" }}
        >
          <div>
            <p className="text-sm font-semibold text-white mb-1">
              🎌 Free Legal Episodes
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Muse Asia streams free licensed anime on YouTube.
            </p>
            <a
              href={museAsiaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
            >
              <Play className="w-4 h-4 fill-white" />
              Watch on Muse Asia
            </a>
          </div>

          {/* Divider */}
          <div className="border-t border-white/5" />

          {/* Quick links to other platforms */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
              Also available on
            </p>
            <div className="flex flex-col gap-1.5">
              {[
                {
                  name: "Crunchyroll",
                  url: "https://crunchyroll.com/search?q=",
                },
                { name: "Netflix", url: "https://netflix.com/search?q=" },
                { name: "Hidive", url: "https://hidive.com/search?q=" },
              ].map((p) => (
                <a
                  key={p.name}
                  href={p.url + encodeURIComponent(title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-sm text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  {p.name}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
