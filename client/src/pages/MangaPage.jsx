import { useSearchParams } from "react-router-dom";
import FilterTabs from "../components/common/FilterTabs";
import AnimeGrid from "../components/anime/AnimeGrid";
import Pagination from "../components/common/Pagination";
import { useMangaList } from "../hooks/useAnime";

const TABS = [
  { label: "Top Manga", value: "manga" },
  { label: "Manhwa", value: "manhwa" },
  { label: "Novels", value: "novel" },
  { label: "Publishing", value: "publishing" },
  { label: "Completed", value: "finished" },
];

const getFilters = (tab) => {
  switch (tab) {
    case "manga":
      return { type: "manga", order_by: "score", sort: "desc" };
    case "manhwa":
      return { type: "manhwa", order_by: "score", sort: "desc" };
    case "novel":
      return { type: "novel", order_by: "score", sort: "desc" };
    case "publishing":
      return { status: "publishing", order_by: "score", sort: "desc" };
    case "finished":
      return { status: "complete", order_by: "score", sort: "desc" };
    default:
      return {};
  }
};

export default function MangaPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const activeTab = searchParams.get("tab") || "manga";

  const filters = getFilters(activeTab);
  const { data, isLoading } = useMangaList(currentPage, filters);

  const items = data?.data || [];
  const totalPages = Math.min(data?.pagination?.last_visible_page || 1, 20);
  const totalCount = data?.pagination?.items?.total || 0;

  const handleTabChange = (tab) => setSearchParams({ tab, page: "1" });

  const handlePageChange = (page) => {
    setSearchParams({ tab: activeTab, page: String(page) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white mb-1">Manga</h1>
        <p className="text-gray-500 text-sm">
          Explore manga, manhwa, and light novels
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <FilterTabs
          tabs={TABS}
          activeTab={activeTab}
          onChange={handleTabChange}
        />

        {!isLoading && totalCount > 0 && (
          <p className="text-sm text-gray-500 flex-shrink-0">
            Showing{" "}
            <span className="text-white font-medium">
              {(currentPage - 1) * 24 + 1}–
              {Math.min(currentPage * 24, totalCount)}
            </span>{" "}
            of{" "}
            <span className="text-white font-medium">
              {totalCount.toLocaleString()}
            </span>{" "}
            results
          </p>
        )}
      </div>

      <AnimeGrid items={items} isLoading={isLoading} type="manga" />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
