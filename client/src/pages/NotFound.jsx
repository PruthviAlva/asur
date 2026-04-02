import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-white gap-4">
      <h1 className="text-6xl font-black text-orange-500">404</h1>
      <p className="text-gray-400">This page doesn't exist.</p>
      <Link
        to="/"
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
