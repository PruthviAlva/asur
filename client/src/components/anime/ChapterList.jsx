import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useMangaDexSearch, useMangaChapters } from "../../hooks/useMangaDex";
import LoadingSpinner from "../common/LoadingSpinner";

export default function ChapterList({ mangaTitle, malId }) {
  const [chapterPage, setChapterPage] = useState(1);
  const [search, setSearch] = useState("");

  // Step 1: Find the MangaDex UUID from the manga title
  const { data: searchData, isLoading: searching } =
    useMangaDexSearch(mangaTitle);

  // Get first match
  const mangaDexManga = searchData?.data?.[0];
  const mangaDexId = mangaDexManga?.id;

  // Step 2: Get chapters using that UUID
  const { data: chaptersData, isLoading: loadingChapters } = useMangaChapters(
    mangaDexId,
    chapterPage,
  );

  const chapters = chaptersData?.data || [];
  // Keep only ONE entry per chapter number (prefer longer title, more pages)
  const seen = new Set();
  const deduped = chapters.filter((ch) => {
    const num = ch.attributes?.chapter || ch.id;
    if (seen.has(num)) return false;
    seen.add(num);
    return true;
  });

  // Then use deduped instead of chapters for filtering:
  const filtered = deduped.filter((ch) => {
    const num = ch.attributes?.chapter || "";
    const title = ch.attributes?.title || "";
    return (
      num.includes(search) || title.toLowerCase().includes(search.toLowerCase())
    );
  });
  const total = chaptersData?.total || 0;
  const totalPages = Math.ceil(total / 40);

  // ── Loading state ──
  if (searching) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="md" />
        <span className="ml-2 text-gray-500 text-sm">
          Finding manga on MangaDex...
        </span>
      </div>
    );
  }

  // ── Not found on MangaDex (licensed content) ──
  if (!mangaDexId) {
    return <NotAvailable title={mangaTitle} />;
  }

  return (
    <div
      className="rounded-xl border border-white/5 overflow-hidden"
      style={{ backgroundColor: "var(--color-surface-2)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div>
          <p className="text-white font-semibold">Chapters</p>
          <p className="text-gray-500 text-xs mt-0.5">
            {total} chapters available
          </p>
        </div>

        {/* Chapter search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chapters..."
            className="pl-8 pr-3 py-1.5 text-xs rounded-lg outline-none w-40"
            style={{
              backgroundColor: "var(--color-surface-3)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
            }}
          />
        </div>
      </div>

      {/* Chapter List */}
      {loadingChapters ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-8 text-sm">
          No chapters found
        </p>
      ) : (
        <div className="max-h-96 overflow-y-auto">
          {filtered.map((chapter, index) => {
            const num = chapter.attributes?.chapter;
            const title = chapter.attributes?.title;
            const pages = chapter.attributes?.pages;
            const group = chapter.relationships?.find(
              (r) => r.type === "scanlation_group",
            );
            const groupName = group?.attributes?.name || "Unknown";

            return (
              <Link
                key={`${chapter.id}-${index}`}
                to={`/manga/read/${chapter.id}?title=${encodeURIComponent(mangaTitle)}&malId=${malId}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-white/5 border-b border-white/5 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-3.5 h-3.5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      Chapter {num || "?"}
                      {title && (
                        <span className="text-gray-500 ml-1">— {title}</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-600">{groupName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500">
                  {pages && <span>{pages} pages</span>}
                  <ChevronRight className="w-4 h-4 group-hover:text-orange-400 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-3 border-t border-white/5">
          <button
            onClick={() => setChapterPage((p) => Math.max(1, p - 1))}
            disabled={chapterPage === 1}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-500">
            Page {chapterPage} of {totalPages}
          </span>
          <button
            onClick={() => setChapterPage((p) => Math.min(totalPages, p + 1))}
            disabled={chapterPage === totalPages}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Not Available Fallback ────────────────────────
function NotAvailable({ title }) {
  const platforms = [
    {
      name: "MangaPlus",
      url: `https://mangaplus.shueisha.co.jp/search?query=${encodeURIComponent(title)}`,
    },
    {
      name: "MangaDex",
      url: `https://mangadex.org/search?q=${encodeURIComponent(title)}`,
    },
    {
      name: "VIZ Media",
      url: `https://viz.com/search/results/${encodeURIComponent(title)}`,
    },
  ];

  return (
    <div
      className="rounded-xl border border-white/5 p-6 text-center"
      style={{ backgroundColor: "var(--color-surface-2)" }}
    >
      <BookOpen className="w-10 h-10 text-gray-600 mx-auto mb-3" />
      <p className="text-white font-semibold mb-1">Chapters not available</p>
      <p className="text-gray-500 text-sm mb-4">
        This manga may be licensed and unavailable on MangaDex. Read it legally
        on:
      </p>
      <div className="flex justify-center gap-2 flex-wrap">
        {platforms.map((p) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 px-4 py-2 rounded-lg transition-colors"
          >
            {p.name} <ExternalLink className="w-3 h-3" />
          </a>
        ))}
      </div>
    </div>
  );
}
