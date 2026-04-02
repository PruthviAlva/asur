import AnimeCard from "./AnimeCard";
import AnimeCardSkeleton from "./AnimeCardSkeleton";
import SectionHeader from "../common/SectionHeader";

export default function AnimeRow({
  title,
  viewAllLink,
  icon,
  items = [],
  isLoading = false,
  showRank = false,
  type = "anime",
}) {
  return (
    <section className="mb-10">
      <SectionHeader title={title} viewAllLink={viewAllLink} icon={icon} />

      {/* Horizontal scroll container */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {isLoading
          ? // Show skeleton placeholders while loading
            Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex-shrink-0 w-36">
                  <AnimeCardSkeleton />
                </div>
              ))
          : items.map((anime, index) => (
              <div
                key={anime.mal_id}
                className={`flex-shrink-0 ${showRank ? "w-40 pl-3" : "w-36"}`}
              >
                <AnimeCard
                  anime={anime}
                  type={type}
                  rank={showRank ? index + 1 : null}
                />
              </div>
            ))}
      </div>
    </section>
  );
}
