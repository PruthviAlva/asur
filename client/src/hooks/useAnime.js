import { useQuery } from '@tanstack/react-query'
import animeService from '../services/animeService'

// Each hook wraps a service call with a unique cache key
// TanStack Query automatically caches, dedupes, and refetches

export const useSeasonNow = (page = 1) =>
    useQuery({
        queryKey: ['season-now', page],
        queryFn: () => animeService.getSeasonNow(page).then(r => r.data),
    })

export const useTopAnime = (limit = 10) =>
    useQuery({
        queryKey: ['top-anime', limit],
        queryFn: () => animeService.getTopAnime(1, limit).then(r => r.data),
        staleTime: 1000 * 60 * 10, // Top anime changes slowly — 10min cache
    })

export const useTrending = () =>
    useQuery({
        queryKey: ['trending'],
        queryFn: () => animeService.getTrending().then(r => r.data),
    })

export const useLatestEpisodes = () =>
    useQuery({
        queryKey: ['latest-episodes'],
        queryFn: () => animeService.getLatestEpisodes().then(r => r.data),
    })

export const useUpcoming = () =>
    useQuery({
        queryKey: ['upcoming'],
        queryFn: () => animeService.getUpcoming().then(r => r.data),
    })

export const useAnimeDetails = (id) =>
    useQuery({
        queryKey: ['anime', id],
        queryFn: () => animeService.getAnimeById(id).then(r => r.data),
        enabled: !!id, // Don't run if id is undefined
    })

export const useAnimeList = (page, filters) =>
    useQuery({
        queryKey: ['anime-list', page, filters],
        queryFn: () => animeService.getAnimeList(page, filters).then(r => r.data),
    })

export const useTopManga = (page = 1) =>
    useQuery({
        queryKey: ['top-manga', page],
        queryFn: () => animeService.getTopManga(page).then(r => r.data),
    })

export const useMangaDetails = (id) =>
    useQuery({
        queryKey: ['manga', id],
        queryFn: () => animeService.getMangaById(id).then(r => r.data),
        enabled: !!id,
    })

export const useMangaList = (page, filters) =>
    useQuery({
        queryKey: ['manga-list', page, filters],
        queryFn: () => animeService.getMangaList(page, filters).then(r => r.data),
    })