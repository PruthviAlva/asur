import { useState, useRef, useCallback } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  AlignJustify,
  LayoutGrid,
} from "lucide-react";
import { useChapterPages } from "../hooks/useMangaDex";
import LoadingSpinner from "../components/common/LoadingSpinner";

const buildImageUrl = (server, hash, filename, quality = "data") =>
  `${server}/${quality}/${hash}/${filename}`;

export default function MangaReader() {
  const { chapterId } = useParams();
  const [searchParams] = useSearchParams();
  const mangaTitle = searchParams.get("title") || "Manga";
  const malId = searchParams.get("malId");

  // ── ALL hooks at the top — before any early returns ──
  const [mode, setMode] = useState("scroll");
  const [page, setPage] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [quality, setQuality] = useState("data");
  const containerRef = useRef(null);

  const { data, isLoading, isError } = useChapterPages(chapterId);

  // Derived values — safe to compute even if data is undefined
  const chapter = data?.chapter;
  const baseUrl = data?.baseUrl || "";
  const hash = chapter?.hash || "";
  const pages = chapter?.data || [];
  const dataSaver = chapter?.dataSaver || [];
  const imageFiles = quality === "data" ? pages : dataSaver;
  const totalPages = imageFiles.length;

  const goNext = useCallback(
    () => setPage((p) => Math.min(totalPages - 1, p + 1)),
    [totalPages],
  );

  const goPrev = useCallback(() => setPage((p) => Math.max(0, p - 1)), []);

  const handleKeyDown = useCallback(
    (e) => {
      if (mode !== "single") return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goNext();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goPrev();
    },
    [mode, goNext, goPrev],
  );

  // ── Early returns AFTER all hooks ──
  if (isLoading) return <LoadingSpinner fullScreen />;

  if (isError || !data?.chapter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-gray-400">Failed to load chapter.</p>
        {malId && (
          <Link
            to={`/manga/${malId}`}
            className="text-orange-500 hover:underline"
          >
            ← Back to Manga
          </Link>
        )}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#000" }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* ── Top Toolbar ───────────────────────────── */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 border-b border-white/5"
        style={{
          backgroundColor: "rgba(0,0,0,0.95)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Left — back + title */}
        <div className="flex items-center gap-3 min-w-0">
          {malId && (
            <Link
              to={`/manga/${malId}`}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          )}
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">
              {mangaTitle}
            </p>
            <p className="text-gray-500 text-xs">
              {mode === "single"
                ? `Page ${page + 1} of ${totalPages}`
                : `${totalPages} pages`}
            </p>
          </div>
        </div>

        {/* Right — controls */}
        <div className="flex items-center gap-1">
          {/* Quality toggle */}
          <button
            onClick={() =>
              setQuality((q) => (q === "data" ? "data-saver" : "data"))
            }
            className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
              quality === "data-saver"
                ? "border-orange-500/40 bg-orange-500/10 text-orange-400"
                : "border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            {quality === "data-saver" ? "📱 Saver" : "🖼 HD"}
          </button>

          <div className="w-px h-5 bg-white/10 mx-1" />

          {/* Zoom — scroll mode only */}
          {mode === "scroll" && (
            <>
              <button
                onClick={() => setZoom((z) => Math.max(50, z - 10))}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-500 w-10 text-center">
                {zoom}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(200, z + 10))}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-white/10 mx-1" />
            </>
          )}

          {/* Mode toggles */}
          <button
            onClick={() => {
              setMode("scroll");
              setPage(0);
            }}
            title="Scroll mode"
            className={`p-2 rounded-lg transition-colors ${
              mode === "scroll"
                ? "bg-orange-500 text-white"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <AlignJustify className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setMode("single");
              setPage(0);
            }}
            title="Single page mode"
            className={`p-2 rounded-lg transition-colors ${
              mode === "single"
                ? "bg-orange-500 text-white"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Reader Area ───────────────────────────── */}
      <div ref={containerRef} className="flex-1">
        {/* SCROLL MODE */}
        {mode === "scroll" && (
          <div
            className="flex flex-col items-center py-4 gap-1"
            style={{ maxWidth: `${zoom}%`, margin: "0 auto" }}
          >
            {imageFiles.map((filename, i) => (
              <img
                key={filename}
                src={buildImageUrl(baseUrl, hash, filename, quality)}
                alt={`Page ${i + 1}`}
                className="w-full block"
                loading={i < 3 ? "eager" : "lazy"}
                onError={(e) => {
                  if (quality === "data" && dataSaver[i]) {
                    e.target.src = buildImageUrl(
                      baseUrl,
                      hash,
                      dataSaver[i],
                      "data-saver",
                    );
                  }
                }}
              />
            ))}
          </div>
        )}

        {/* SINGLE PAGE MODE */}
        {mode === "single" && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] relative px-4">
            <img
              key={imageFiles[page]}
              src={buildImageUrl(baseUrl, hash, imageFiles[page], quality)}
              alt={`Page ${page + 1}`}
              className="max-h-[80vh] max-w-full object-contain select-none"
              draggable={false}
            />
            {/* Click zones */}
            <div className="absolute inset-0 flex">
              <div onClick={goPrev} className="flex-1 cursor-w-resize" />
              <div onClick={goNext} className="flex-1 cursor-e-resize" />
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Nav — single mode only ─────────── */}
      {mode === "single" && (
        <div
          className="sticky bottom-0 z-50 flex items-center justify-between px-4 py-3 border-t border-white/5"
          style={{
            backgroundColor: "rgba(0,0,0,0.95)",
            backdropFilter: "blur(8px)",
          }}
        >
          <button
            onClick={goPrev}
            disabled={page === 0}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white disabled:opacity-30 transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>

          <div className="flex items-center gap-3 flex-1 max-w-xs mx-4">
            <span className="text-xs text-gray-500 flex-shrink-0">1</span>
            <input
              type="range"
              min={0}
              max={totalPages - 1}
              value={page}
              onChange={(e) => setPage(Number(e.target.value))}
              className="flex-1 accent-orange-500"
            />
            <span className="text-xs text-gray-500 flex-shrink-0">
              {totalPages}
            </span>
          </div>

          <button
            onClick={goNext}
            disabled={page === totalPages - 1}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white disabled:opacity-30 transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
