import { useQuery } from '@tanstack/react-query'
import anilistService from '../services/anilistService'

export function useAniListMedia(malId, type = 'ANIME') {
    return useQuery({
        queryKey: ['anilist-media', malId, type],
        queryFn: () => anilistService.getMediaByMalId(malId, type),
        enabled: !!malId,
        staleTime: 1000 * 60 * 15,
        // Don't throw if AniList is down — Jikan data still works
        retry: 1,
    })
}

export function useCharacters(malId, type = 'ANIME', page = 1) {
    return useQuery({
        queryKey: ['characters', malId, type, page],
        queryFn: () => anilistService.getCharacters(malId, type, page),
        enabled: !!malId,
        staleTime: 1000 * 60 * 30,
    })
}

export function useStaff(malId, type = 'ANIME') {
    return useQuery({
        queryKey: ['staff', malId, type],
        queryFn: () => anilistService.getStaff(malId, type),
        enabled: !!malId,
        staleTime: 1000 * 60 * 30,
    })
}

export function useRecommendations(malId, type = 'ANIME') {
    return useQuery({
        queryKey: ['recommendations', malId, type],
        queryFn: () => anilistService.getRecommendations(malId, type),
        enabled: !!malId,
        staleTime: 1000 * 60 * 30,
    })
}

export function useAniListTrending(page = 1, type = 'ANIME') {
    return useQuery({
        queryKey: ['anilist-trending', page, type],
        queryFn: () => anilistService.getTrending(page, type),
        staleTime: 1000 * 60 * 10,
    })
}