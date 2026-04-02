import axios from 'axios'
import { JIKAN_BASE } from '../utils/constants'

// Jikan has a rate limit: 3 req/sec, 60 req/min
// TanStack Query caching prevents hitting this in normal use

const jikan = axios.create({
    baseURL: JIKAN_BASE,
    timeout: 10000, // 10s timeout
})

const animeService = {
    // Hero banner + featured content
    getSeasonNow: (page = 1) =>
        jikan.get(`/seasons/now?limit=10&page=${page}`),

    // Top 10 today — used for the big rank number row
    getTopAnime: (page = 1, limit = 10) =>
        jikan.get(`/top/anime?limit=${limit}&page=${page}`),

    // Trending = currently airing, sorted by score
    getTrending: (page = 1) =>
        jikan.get(`/anime?status=airing&order_by=score&sort=desc&limit=12&page=${page}`),

    // Latest episodes — recently updated airing anime  
    getLatestEpisodes: () =>
        jikan.get(`/anime?status=airing&order_by=start_date&sort=desc&limit=12`),

    // Upcoming anime
    getUpcoming: (page = 1) =>
        jikan.get(`/seasons/upcoming?limit=12&page=${page}`),

    // Single anime details
    getAnimeById: (id) =>
        jikan.get(`/anime/${id}/full`),

    // Episodes list for an anime
    getAnimeEpisodes: (id, page = 1) =>
        jikan.get(`/anime/${id}/episodes?page=${page}`),

    // Related anime
    getAnimeRelations: (id) =>
        jikan.get(`/anime/${id}/relations`),

    // Search
    searchAnime: (query, page = 1, filters = {}) => {
        const params = new URLSearchParams({
            q: query,
            page,
            limit: 24,
            ...filters,
        })
        return jikan.get(`/anime?${params}`)
    },

    // All anime with filters (for /anime page)
    getAnimeList: (page = 1, filters = {}) => {
        const params = new URLSearchParams({ page, limit: 24, ...filters })
        return jikan.get(`/anime?${params}`)
    },

    // Manga
    getTopManga: (page = 1) =>
        jikan.get(`/top/manga?limit=24&page=${page}`),

    getMangaById: (id) =>
        jikan.get(`/manga/${id}/full`),

    searchManga: (query, page = 1) =>
        jikan.get(`/manga?q=${query}&page=${page}&limit=24`),

    getMangaList: (page = 1, filters = {}) => {
        const params = new URLSearchParams({ page, limit: 24, ...filters })
        return jikan.get(`/manga?${params}`)
    },

    // Genres list
    getGenres: () =>
        jikan.get(`/genres/anime`),
}

export default animeService