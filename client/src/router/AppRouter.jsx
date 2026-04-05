import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorBoundary from "../components/common/ErrorBoundary";

// Lazy load pages — only downloaded when visited (faster initial load)
const HomePage = lazy(() => import("../pages/HomePage"));
const AnimePage = lazy(() => import("../pages/AnimePage"));
const MangaPage = lazy(() => import("../pages/MangaPage"));
const AnimeDetails = lazy(() => import("../pages/AnimeDetails"));
const MangaDetails = lazy(() => import("../pages/MangaDetails"));
const SearchPage = lazy(() => import("../pages/SearchPage"));
const NotFound = lazy(() => import("../pages/NotFound"));
//auth
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const OAuthCallback = lazy(() => import("../pages/OAuthCallback"));

const WatchlistPage = lazy(() => import("../pages/WatchlistPage"));
const MangaReader = lazy(() => import("../pages/MangaReader"));

export default function AppRouter() {
  return (
    <ErrorBoundary>
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <Navbar />

        {/* Suspense shows spinner while lazy page loads */}
        <main className="flex-1">
          <Suspense fallback={<LoadingSpinner fullScreen />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/anime" element={<AnimePage />} />
              <Route path="/manga" element={<MangaPage />} />
              <Route path="/anime/:id" element={<AnimeDetails />} />
              <Route path="/manga/:id" element={<MangaDetails />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="*" element={<NotFound />} />
              // Auth routes
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auth/callback" element={<OAuthCallback />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="/manga/read/:chapterId" element={<MangaReader />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}
