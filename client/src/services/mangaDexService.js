import axios from 'axios'
import { MANGADEX_BASE } from '../utils/constants'

const mangadex = axios.create({
    baseURL: MANGADEX_BASE,
    timeout: 15000,
})

const mangaDexService = {
    // Search manga by title — returns MangaDex manga ID
    searchManga: async (title) => {
        const res = await mangadex.get('/manga', {
            params: {
                title,
                limit: 5,
                contentRating: ['safe', 'suggestive'],
                availableTranslatedLanguage: ['en'],
                order: { relevance: 'desc' },
            },
        })
        return res.data
    },

    // Get chapter list for a manga
    getChapters: async (mangaDexId, page = 1, limit = 40) => {
        const offset = (page - 1) * limit
        const res = await mangadex.get(`/manga/${mangaDexId}/feed`, {
            params: {
                translatedLanguage: ['en'],
                order: { chapter: 'asc' },
                limit,
                offset,
                contentRating: ['safe', 'suggestive'],
                // Include scanlation group info
                includes: ['scanlation_group'],
            },
        })
        return res.data
    },

    // Get page image URLs for a chapter
    getChapterPages: async (chapterId) => {
        // MangaDex uses an "at-home" server system for CDN
        const res = await mangadex.get(`/at-home/server/${chapterId}`)
        return res.data
    },

    // Get single chapter details
    getChapter: async (chapterId) => {
        const res = await mangadex.get(`/chapter/${chapterId}`, {
            params: { includes: ['manga', 'scanlation_group'] },
        })
        return res.data
    },
}

export default mangaDexService