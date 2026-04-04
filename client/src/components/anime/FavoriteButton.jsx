import { Heart } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../hooks/useWatchlist";

export default function FavoriteButton({ anime, type = "ANIME" }) {
  const { user } = useAuth();
  const { isFavorited, toggle } = useFavorites();

  const favorited = isFavorited(anime.mal_id, type);

  const handleClick = () => {
    if (!user) return;
    toggle.mutate({
      animeId: anime.mal_id,
      animeTitle: anime.title_english || anime.title,
      animeCover: anime.images?.jpg?.image_url || "",
      type,
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={toggle.isPending}
      title={favorited ? "Remove from favorites" : "Add to favorites"}
      className={`flex items-center gap-2 font-semibold px-5 py-2.5 rounded-lg transition-all ${
        favorited
          ? "bg-pink-500/20 border border-pink-500/40 text-pink-400 hover:bg-pink-500/30"
          : "bg-white/10 hover:bg-white/20 text-white border border-transparent"
      }`}
    >
      <Heart
        className={`w-4 h-4 transition-all ${favorited ? "fill-pink-400 text-pink-400 scale-110" : ""}`}
      />
      {favorited ? "Favorited" : "Favorite"}
    </button>
  );
}
