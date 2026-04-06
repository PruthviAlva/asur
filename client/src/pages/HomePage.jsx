import { Flame, Clock, TrendingUp, Calendar } from "lucide-react";
import HeroBanner from "../components/anime/HeroBanner";
import AnimeRow from "../components/anime/AnimeRow";
import ContinueWatchingRow from "../components/anime/ContinueWatchingRow";
import {
  useSeasonNow,
  useTopAnime,
  useTrending,
  useLatestEpisodes,
  useUpcoming,
} from "../hooks/useAnime";

export default function HomePage() {
  const { data: seasonData, isLoading: loadingSeason } = useSeasonNow();
  const { data: topData, isLoading: loadingTop } = useTopAnime(10);
  const { data: trendData, isLoading: loadingTrend } = useTrending();
  const { data: latestData, isLoading: loadingLatest } = useLatestEpisodes();
  const { data: upcomingData, isLoading: loadingUpcoming } = useUpcoming();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero Banner — rotates through currently airing anime */}
      <HeroBanner animeList={seasonData?.data?.slice(0, 5) || []} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Continue Watching — only shows for logged-in users with WATCHING items */}
        <ContinueWatchingRow />

        {/* Top 10 Today — with large rank numbers */}
        <AnimeRow
          title="Top 10 Today"
          viewAllLink="/anime"
          icon={TrendingUp}
          items={topData?.data || []}
          isLoading={loadingTop}
          showRank={true}
        />

        {/* Trending Now */}
        <AnimeRow
          title="Trending Now"
          viewAllLink="/anime"
          icon={Flame}
          items={trendData?.data || []}
          isLoading={loadingTrend}
        />

        {/* Latest Episodes */}
        <AnimeRow
          title="Latest Episodes"
          viewAllLink="/anime"
          icon={Clock}
          items={latestData?.data || []}
          isLoading={loadingLatest}
        />

        {/* Top Upcoming */}
        <AnimeRow
          title="Top Upcoming"
          viewAllLink="/anime"
          icon={Calendar}
          items={upcomingData?.data || []}
          isLoading={loadingUpcoming}
        />
      </div>
    </div>
  );
}
