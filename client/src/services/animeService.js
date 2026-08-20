import anilistService from './anilistService'

// Map AniList media -> minimal Jikan-like shape expected by UI
const mapMedia = (m) => {
    const title = m.title?.english || m.title?.romaji || ''
    return {
        mal_id: m.idMal || m.id || null,
        title_english: m.title?.english || null,
        title,
        images: {
            jpg: {
                image_url: m.coverImage?.large || (m.coverImage?.extraLarge ?? null),
                large_image_url: m.coverImage?.large || null,
            }
        },
        score: m.averageScore || m.meanScore || null,
        episodes: m.episodes || null,
        status: m.status || null,
        type: m.type || 'ANIME',
        genres: m.genres || [],
        raw: m,
    }
}

const toJikanPage = (pageData) => {
    // pageData expected to be { Page: { media: [...] } } or similar
    const media = pageData?.Page?.media || []
    const mapped = media.map(mapMedia)
    return { data: mapped, pagination: { last_visible_page: pageData?.Page?.pageInfo?.lastPage || 1 } }
}

const animeService = {
    // Hero banner + featured content
    getSeasonNow: (page = 1) =>
        anilistService.getSeasonNow(page, 10).then((res) => ({ data: toJikanPage(res) })),

    // Top 10 today — used for the big rank number row
    getTopAnime: (page = 1, limit = 10) =>
        anilistService.getTopAnime(page, limit).then((res) => ({ data: toJikanPage(res) })),

    // Trending = currently airing, sorted by score
    getTrending: (page = 1) =>
        anilistService.getTrending(page).then((res) => ({ data: toJikanPage(res) })),

    // Latest episodes — recently updated airing anime
    getLatestEpisodes: () =>
        anilistService.getTrending(1).then((res) => ({ data: toJikanPage(res) })),

    // Upcoming anime
    getUpcoming: (page = 1) =>
        anilistService.getUpcoming(page, 12).then((res) => ({ data: toJikanPage(res) })),

    // Single anime details
    getAnimeById: (id) =>
        anilistService.getMediaByMalId(id).then((res) => {
            const media = res?.Media || res
            const mapped = mapMedia(media)
            return { data: { data: mapped } }
        }),

    // Episodes list for an anime
    getAnimeEpisodes: (id, page = 1) =>
        // AniList does not provide a full episode list via GraphQL; return empty
        Promise.resolve({ data: { episodes: [] } }),

    // Related anime
    getAnimeRelations: (id) =>
        anilistService.getRelations(id).then((res) => {
            const edges = res?.Media?.relations?.edges || []
            const mapped = edges.map((e) => ({
                relation: e.relationType,
                entry: mapMedia(e.node),
            }))
            return { data: mapped }
        }),

    // Search
    searchAnime: (query, page = 1, filters = {}) =>
        anilistService.searchMedia(query, page, 24).then((res) => ({ data: toJikanPage(res) })),

    // All anime with filters (for /anime page)
    getAnimeList: (page = 1, filters = {}) =>
        anilistService.getTopAnime(page, 24).then((res) => ({ data: toJikanPage(res) })),

    // Manga (not fully implemented via AniList yet) — return empty structures for demo
    getTopManga: (page = 1) => Promise.resolve({ data: { data: [], pagination: { last_visible_page: 1 } } }),
    getMangaById: (id) => Promise.resolve({ data: {} }),
    searchManga: (query, page = 1) => Promise.resolve({ data: { data: [], pagination: { last_visible_page: 1 } } }),
    getMangaList: (page = 1, filters = {}) => Promise.resolve({ data: { data: [], pagination: { last_visible_page: 1 } } }),

    // Genres — AniList doesn't expose a simple genres endpoint; return empty for demo
    getGenres: () => Promise.resolve({ data: { data: [] } }),
}

export default animeService