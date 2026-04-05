import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import userService from '../services/userService'
import { useAuth } from '../context/AuthContext'

export function useWatchlist() {
    const { user } = useAuth()

    return useQuery({
        queryKey: ['watchlist'],
        queryFn: userService.getWatchlist,
        enabled: !!user, // only fetch if logged in
    })
}

export function useWatchlistStatus(animeId) {
    const { data } = useWatchlist()
    // Find this anime in the watchlist array
    return data?.data?.find(item => item.animeId === Number(animeId)) || null
}

export function useWatchlistMutations() {
    const queryClient = useQueryClient()

    // Invalidate watchlist cache after any mutation so UI updates instantly
    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['watchlist'] })

    const add = useMutation({
        mutationFn: userService.addToWatchlist,
        onSuccess: invalidate,
    })

    const updateStatus = useMutation({
        mutationFn: ({ animeId, status }) => userService.updateWatchlistStatus(animeId, status),
        onSuccess: invalidate,
    })

    const remove = useMutation({
        mutationFn: userService.removeFromWatchlist,
        onSuccess: invalidate,
    })

    return { add, updateStatus, remove }
}

export function useFavorites() {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const { data } = useQuery({
        queryKey: ['favorites'],
        queryFn: userService.getFavorites,
        enabled: !!user,
    })

    const toggle = useMutation({
        mutationFn: userService.toggleFavorite,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
    })

    const isFavorited = (animeId, type = 'ANIME') =>
        data?.data?.some(f => f.animeId === Number(animeId) && f.type === type) || false

    return { favorites: data?.data || [], toggle, isFavorited }
}

export function useContinueWatching() {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const query = useQuery({
        queryKey: ['continue-watching'],
        queryFn: userService.getContinueWatching,
        enabled: !!user, // only fetch if logged in
        staleTime: 1000 * 60 * 2,
    })

    const updateProgress = useMutation({
        mutationFn: ({ animeId, progress }) =>
            userService.updateProgress(animeId, progress),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['continue-watching'] }),
    })

    return { ...query, updateProgress }
}