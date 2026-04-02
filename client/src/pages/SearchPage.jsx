import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useDebounce from "../hooks/useDebounce";
import AnimeGrid from "../components/anime/AnimeGrid";
import FilterTabs from "../components/common/FilterTabs";
import Pagination from "../components/common/Pagination";
import animeService from "../services/animeService";

const TYPE_TABS = [
  { label: "Anime", value: "anime" },
  { label: "Manga", value: "manga" },
];

const STATUS_FILTERS = [
  { label: "Any Status", value: "" },
  { label: "Airing", value: "airing" },
  { label: "Complete", value: "complete" },
  { label: "Upcoming", value: "upcoming" },
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize from URL so sharing links works
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [type, setType] = useState(searchParams.get("type") || "anime");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [page, setPage] = useState(1);

  // Only fires API call 500ms after user stops typing
  const debouncedQuery = useDebounce(query, 500);

  // Sync URL params when search state changes
  useEffect(() => {
    const params = {};
    if (debouncedQuery) params.q = debouncedQuery;
    if (type !== "anime") params.type = type;
    if (status) params.status = status;
    setSearchParams(params, { replace: true });
    setPage(1); // reset to page 1 on new search
  }, [debouncedQuery, type, status]);

  // Search query — disabled until user types something
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["search", debouncedQuery, type, status, page],
    queryFn: () => {
      if (type === "anime") {
        return animeService
          .searchAnime(debouncedQuery, page, status ? { status } : {})
          .then((r) => r.data);
      } else {
        return animeService
          .searchManga(debouncedQuery, page)
          .then((r) => r.data);
      }
    },
    enabled: debouncedQuery.trim().length >= 2, // min 2 chars
    staleTime: 1000 * 60 * 2,
  });

  const items = data?.data || [];
  const totalPages = Math.min(data?.pagination?.last_visible_page || 1, 10);
  const totalCount = data?.pagination?.items?.total || 0;
  const isSearching = isLoading || isFetching;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white mb-4">Search</h1>

        {/* Big search input */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anime, manga, characters..."
            autoFocus
            className="w-full pl-12 pr-12 py-3.5 text-base rounded-xl outline-none transition-all"
            style={{
              backgroundColor: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#f97316")}
            onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
          />
          {/* Clear button */}
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Type toggle */}
        <FilterTabs
          tabs={TYPE_TABS}
          activeTab={type}
          onChange={(val) => {
            setType(val);
            setStatus("");
          }}
        />

        {/* Divider */}
        <div className="w-px h-6 bg-white/10" />

        {/* Status filter — anime only */}
        {type === "anime" && (
          <div className="flex items-center gap-1">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="text-sm rounded-lg px-3 py-1.5 outline-none cursor-pointer"
              style={{
                backgroundColor: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
            >
              {STATUS_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Results count */}
        {!isSearching && debouncedQuery && totalCount > 0 && (
          <p className="text-sm text-gray-500 ml-auto">
            Found{" "}
            <span className="text-white font-medium">
              {totalCount.toLocaleString()}
            </span>{" "}
            results for{" "}
            <span className="text-orange-400 font-medium">
              "{debouncedQuery}"
            </span>
          </p>
        )}
      </div>

      {/* States */}
      {!debouncedQuery || debouncedQuery.trim().length < 2 ? (
        // Empty state — before search
        <div className="flex flex-col items-center justify-center py-24 text-gray-600">
          <Search className="w-12 h-12 mb-4 opacity-30" />
          <p className="text-lg">Start typing to search</p>
          <p className="text-sm mt-1">
            Search for your favorite anime or manga
          </p>
        </div>
      ) : (
        <>
          {/* Loading indicator — subtle, doesn't replace grid */}
          {isFetching && !isLoading && (
            <div className="flex justify-center mb-4">
              <div className="h-0.5 w-48 bg-orange-500/20 rounded overflow-hidden">
                <div className="h-full w-1/3 bg-orange-500 rounded animate-[slide_1s_ease-in-out_infinite]" />
              </div>
            </div>
          )}

          <AnimeGrid items={items} isLoading={isLoading} type={type} />

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </>
      )}
    </div>
  );
}
