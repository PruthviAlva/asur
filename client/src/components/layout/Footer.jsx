import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      className="border-t mt-16 py-8"
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "var(--color-surface-2)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
            <span className="text-white font-black text-xs">A</span>
          </div>
          <span className="text-white font-bold">Asur</span>
          <span className="text-gray-500 text-sm ml-2">
            © {new Date().getFullYear()}. Data from Jikan API & AniList.
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <Link to="/anime" className="hover:text-white transition-colors">
            Anime
          </Link>
          <Link to="/manga" className="hover:text-white transition-colors">
            Manga
          </Link>
          <Link to="/search" className="hover:text-white transition-colors">
            Search
          </Link>
        </div>
      </div>
    </footer>
  );
}
