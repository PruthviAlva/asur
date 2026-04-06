import { useStaff } from "../../hooks/useAniList";

export default function StaffGrid({ malId, type = "ANIME" }) {
  const { data, isLoading } = useStaff(malId, type);

  const staff = data?.Media?.staff?.edges || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-pulse">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="rounded-xl bg-white/5 h-20" />
          ))}
      </div>
    );
  }

  if (!staff.length) return null;

  return (
    <section>
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <div className="w-1 h-5 bg-orange-500 rounded-full" />
        Staff
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {staff.slice(0, 12).map(({ role, node: person }) => (
          <a
            key={`${person.id}-${role}`}
            href={person.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all group"
            style={{ backgroundColor: "var(--color-surface-2)" }}
          >
            <img
              src={person.image?.large}
              alt={person.name?.full}
              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
              loading="lazy"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-white group-hover:text-orange-400 transition-colors truncate">
                {person.name?.full}
              </p>
              <p className="text-xs text-gray-500 truncate">{role}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
