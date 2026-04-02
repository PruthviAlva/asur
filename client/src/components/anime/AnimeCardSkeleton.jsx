// Pulsing placeholder shown while data loads
export default function AnimeCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[2/3] rounded-lg bg-white/5" />
      <div className="mt-2 h-3 bg-white/5 rounded w-4/5" />
      <div className="mt-1 h-3 bg-white/5 rounded w-3/5" />
    </div>
  );
}
