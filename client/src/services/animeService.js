import axios from 'axios'
import { JIKAN_BASE } from '../utils/constants'

// Jikan has a rate limit: 3 req/sec, 60 req/min
// TanStack Query caching prevents hitting this in normal use,
// but multiple queries firing on the same page mount (e.g. home page
// hero + top10 + latest episodes) can still burst past the limit.
// The queue below serializes every call with a gap, and retries on 429/504.

const jikan = axios.create({
    baseURL: JIKAN_BASE,
    timeout: 10000, // 10s timeout
})

// ─── Request Queue: max 1 in-flight, spaced ~400ms apart ───
let queue = []
let activeRequests = 0
const MAX_CONCURRENT = 1
const MIN_GAP_MS = 400 // ~2.5 req/sec, safely under Jikan's 3/sec cap

const processQueue = () => {
    if (activeRequests >= MAX_CONCURRENT || queue.length === 0) return

    activeRequests++
    const { fn, resolve, reject } = queue.shift()

    fn()
        .then(resolve)
        .catch(reject)
        .finally(() => {
            activeRequests--
            setTimeout(processQueue, MIN_GAP_MS)
        })
}

const enqueue = (fn) => {
    return new Promise((resolve, reject) => {
        queue.push({ fn, resolve, reject })
        processQueue()
    })
}

// ─── Retry wrapper: handle 429 / 504 with exponential backoff ──
const requestWithRetry = async (requestFn, retries = 3, attempt = 1) => {
    try {
        return await requestFn()
    } catch (error) {
        const status = error?.response?.status
        const retryable = status === 429 || status === 504
        if (retryable && attempt <= retries) {
            const delay = attempt * 1000 // 1s, 2s, 3s
            await new Promise((r) => setTimeout(r, delay))
            return requestWithRetry(requestFn, retries, attempt + 1)
        }
        throw error
    }
}

// Every call goes through queue + retry, wrapping jikan.get()
const request = (url) => enqueue(() => requestWithRetry(() => jikan.get(url)))

const animeService = {
    // Hero banner + featured content
    getSeasonNow: (page = 1) =>
        request(`/seasons/now?limit=10&page=${page}`),

    // Top 10 today — used for the big rank number row
    getTopAnime: (page = 1, limit = 10) =>
        request(`/top/anime?limit=${limit}&page=${page}`),

    // Trending = currently airing, sorted by score
    getTrending: (page = 1) =>
        request(`/anime?status=airing&order_by=score&sort=desc&limit=12&page=${page}`),

    // Latest episodes — recently updated airing anime
    getLatestEpisodes: () =>
        request(`/anime?status=airing&order_by=start_date&sort=desc&limit=12`),

    // Upcoming anime
    getUpcoming: (page = 1) =>
        request(`/seasons/upcoming?limit=12&page=${page}`),

    // Single anime details
    getAnimeById: (id) =>
        request(`/anime/${id}/full`),

    // Episodes list for an anime
    getAnimeEpisodes: (id, page = 1) =>
        request(`/anime/${id}/episodes?page=${page}`),

    // Related anime
    getAnimeRelations: (id) =>
        request(`/anime/${id}/relations`),

    // Search
    searchAnime: (query, page = 1, filters = {}) => {
        const params = new URLSearchParams({
            q: query,
            page,
            limit: 24,
            ...filters,
        })
        return request(`/anime?${params}`)
    },

    // All anime with filters (for /anime page)
    getAnimeList: (page = 1, filters = {}) => {
        const params = new URLSearchParams({ page, limit: 24, ...filters })
        return request(`/anime?${params}`)
    },

    // Manga
    getTopManga: (page = 1) =>
        request(`/top/manga?limit=24&page=${page}`),

    getMangaById: (id) =>
        request(`/manga/${id}/full`),

    searchManga: (query, page = 1) =>
        request(`/manga?q=${query}&page=${page}&limit=24`),

    getMangaList: (page = 1, filters = {}) => {
        const params = new URLSearchParams({ page, limit: 24, ...filters })
        return request(`/manga?${params}`)
    },

    // Genres list
    getGenres: () =>
        request(`/genres/anime`),
}

export default animeService