import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 text-center">
      {/* Big 404 with orange outline style — matches Top 10 rank numbers */}
      <div
        className="font-black select-none leading-none mb-4"
        style={{
          fontSize: "clamp(6rem, 20vw, 12rem)",
          color: "transparent",
          WebkitTextStroke: "3px rgba(249,115,22,0.5)",
        }}
      >
        404
      </div>

      <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
      <p className="text-gray-500 text-sm mb-8 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-lg transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
        <Link
          to="/"
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg transition-colors text-sm font-semibold"
        >
          <Home className="w-4 h-4" /> Home
        </Link>
        <Link
          to="/search"
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-lg transition-colors text-sm"
        >
          <Search className="w-4 h-4" /> Search
        </Link>
      </div>
    </div>
  );
}
