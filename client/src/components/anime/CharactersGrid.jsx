import { useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useCharacters } from "../../hooks/useAniList";

const ROLE_COLORS = {
  MAIN: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  SUPPORTING: "bg-blue-500/20   text-blue-400   border-blue-500/30",
  BACKGROUND: "bg-gray-500/20   text-gray-400   border-gray-500/30",
};

export default function CharactersGrid({ malId, type = "ANIME" }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useCharacters(malId, type, page);

  const characters = data?.Media?.characters?.edges || [];
  const pageInfo = data?.Media?.characters?.pageInfo;
  const hasNextPage = pageInfo?.hasNextPage;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 animate-pulse">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="rounded-xl bg-white/5 h-24" />
          ))}
      </div>
    );
  }

  if (!characters.length) return null;

  return (
    <section>
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <div className="w-1 h-5 bg-orange-500 rounded-full" />
        Characters & Voice Actors
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {characters.map(({ role, node: char, voiceActors }) => {
          const va = voiceActors?.[0]; // primary JP voice actor

          return (
            <div
              key={char.id}
              className="flex gap-3 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
              style={{ backgroundColor: "var(--color-surface-2)" }}
            >
              {/* Character */}
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <a
                  href={char.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0"
                >
                  <img
                    src={char.image?.medium}
                    alt={char.name?.full}
                    className="w-12 h-16 rounded-lg object-cover hover:opacity-80 transition-opacity"
                    loading="lazy"
                  />
                </a>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {char.name?.full}
                  </p>
                  <p className="text-xs text-gray-500 truncate mb-1">
                    {char.name?.native}
                  </p>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded border ${ROLE_COLORS[role] || ROLE_COLORS.BACKGROUND}`}
                  >
                    {role}
                  </span>
                </div>
              </div>

              {/* Divider */}
              {va && (
                <>
                  <div className="w-px bg-white/5 self-stretch" />

                  {/* Voice Actor */}
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <div className="min-w-0 text-right flex-1">
                      <p className="text-sm font-semibold text-white truncate">
                        {va.name?.full}
                      </p>
                      <p className="text-xs text-gray-500 truncate mb-1">
                        {va.name?.native}
                      </p>
                      <span className="text-xs text-blue-400">
                        {va.languageV2}
                      </span>
                    </div>
                    <a
                      href={va.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0"
                    >
                      <img
                        src={va.image?.large}
                        alt={va.name?.full}
                        className="w-12 h-16 rounded-lg object-cover hover:opacity-80 transition-opacity"
                        loading="lazy"
                      />
                    </a>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {(page > 1 || hasNextPage) && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-500">Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasNextPage}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
}
