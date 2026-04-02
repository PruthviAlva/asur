import AnimeCard from "./AnimeCard";
import AnimeCardSkeleton from "./AnimeCardSkeleton";

export default function AnimeGrid({ items = [], isLoading, type = "anime" }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array(24)
          .fill(0)
          .map((_, i) => (
            <AnimeCardSkeleton key={i} />
          ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-500">
        <p className="text-lg">No results found</p>
        <p className="text-sm mt-1">Try a different filter or search term</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {items.map((anime) => (
        <AnimeCard key={anime.mal_id} anime={anime} type={type} />
      ))}
    </div>
  );
}
