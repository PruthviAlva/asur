import { useQuery } from '@tanstack/react-query'
import mangaDexService from '../services/mangaDexService'

// Search MangaDex for a manga title — returns the MangaDex UUID
export function useMangaDexSearch(title) {
    return useQuery({
        queryKey: ['mangadex-search', title],
        queryFn: () => mangaDexService.searchManga(title),
        enabled: !!title && title.length > 2,
        staleTime: 1000 * 60 * 30, // 30 min — manga IDs don't change
    })
}

// Get chapter list using MangaDex UUID
export function useMangaChapters(mangaDexId, page = 1) {
    return useQuery({
        queryKey: ['manga-chapters', mangaDexId, page],
        queryFn: () => mangaDexService.getChapters(mangaDexId, page),
        enabled: !!mangaDexId,
        staleTime: 1000 * 60 * 10,
    })
}

// Get page images for a specific chapter
export function useChapterPages(chapterId) {
    return useQuery({
        queryKey: ['chapter-pages', chapterId],
        queryFn: () => mangaDexService.getChapterPages(chapterId),
        enabled: !!chapterId,
        staleTime: 1000 * 60 * 5,
    })
}