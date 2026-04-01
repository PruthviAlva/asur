// client/src/utils/constants.js
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const JIKAN_BASE = 'https://api.jikan.moe/v4'
export const ANILIST_BASE = 'https://graphql.anilist.co'
export const MANGADEX_BASE = 'https://api.mangadex.org'

// Streaming platform data — legal search links
export const STREAMING_PLATFORMS = {
    anime: [
        { name: 'Crunchyroll', url: 'https://crunchyroll.com/search?q=', badge: 'Subscription', badgeColor: 'orange', icon: '🟠' },
        { name: 'Netflix', url: 'https://netflix.com/search?q=', badge: 'Subscription', badgeColor: 'red', icon: '🔴' },
        { name: 'Amazon Prime', url: 'https://amazon.com/s?k=', badge: 'Subscription', badgeColor: 'blue', icon: '🔵' },
        { name: 'Disney+', url: 'https://disneyplus.com/search/', badge: 'Subscription', badgeColor: 'blue', icon: '🔵' },
        { name: 'Hidive', url: 'https://hidive.com/search?q=', badge: 'Subscription', badgeColor: 'teal', icon: '🟢' },
        { name: 'Muse Asia', url: 'https://youtube.com/@MuseAsia/search?query=', badge: 'Free', badgeColor: 'green', icon: '🟢' },
        { name: 'Rakuten Viki', url: 'https://viki.com/search?q=', badge: 'Free/Sub', badgeColor: 'green', icon: '🟢' },
        { name: 'KissKH', url: 'https://kisskh.co/search?q=', badge: 'Free', badgeColor: 'pink', icon: '🩷' },
        { name: 'JioCinema', url: 'https://jiocinema.com/search/', badge: 'Free', badgeColor: 'purple', icon: '🟣' },
    ],
    manga: [
        { name: 'MangaPlus', url: 'https://mangaplus.shueisha.co.jp/search?query=', badge: 'Free', badgeColor: 'green' },
        { name: 'MangaDex', url: 'https://mangadex.org/search?q=', badge: 'Free', badgeColor: 'green' },
        { name: 'VIZ Media', url: 'https://viz.com/search/results/', badge: 'Free/Sub', badgeColor: 'blue' },
        { name: 'Webtoon', url: 'https://webtoon.com/search?keyword=', badge: 'Free', badgeColor: 'green' },
    ]
}