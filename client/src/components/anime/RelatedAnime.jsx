import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import animeService from "../../services/animeService";

export default function RelatedAnime({ animeId, relations = [] }) {
  // Filter to only sequel/prequel/side story — most useful relations
  const usefulRelations =
    relations?.filter((r) =>
      [
        "Sequel",
        "Prequel",
        "Side Story",
        "Alternative Version",
        "Summary",
      ].includes(r.relation),
    ) || [];

  if (usefulRelations.length === 0) return null;

  // Flatten all entries from all relation groups
  const relatedEntries = usefulRelations
    .flatMap((r) =>
      r.entry
        .filter((e) => e.type === "anime")
        .map((e) => ({ ...e, relation: r.relation })),
    )
    .slice(0, 8); // max 8

  if (relatedEntries.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <div className="w-1 h-5 bg-orange-500 rounded-full" />
        Related Anime
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {relatedEntries.map((entry) => (
          <RelatedCard key={entry.mal_id} entry={entry} />
        ))}
      </div>
    </section>
  );
}

// Each related card fetches its own details (separate cached queries)
function RelatedCard({ entry }) {
  const { data } = useQuery({
    queryKey: ["anime", String(entry.mal_id)],
    queryFn: () => animeService.getAnimeById(entry.mal_id).then((r) => r.data),
    staleTime: 1000 * 60 * 30, // 30 min — related anime rarely changes
  });

  const anime = data?.data;
  const cover = anime?.images?.jpg?.image_url;
  const title = anime?.title_english || anime?.title || entry.name;

  return (
    <Link to={`/anime/${entry.mal_id}`} className="group">
      <div className="rounded-lg overflow-hidden aspect-[2/3] bg-white/5 mb-2">
        {cover ? (
          <img
            src={cover}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          // Skeleton while loading
          <div className="w-full h-full animate-pulse bg-white/5" />
        )}
      </div>
      <p className="text-xs text-gray-400 group-hover:text-white transition-colors line-clamp-2 leading-tight">
        {title}
      </p>
      <p className="text-xs text-orange-500 mt-0.5">{entry.relation}</p>
    </Link>
  );
}
