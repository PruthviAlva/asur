import { api } from './authService' // reuses the axios instance with JWT interceptor

const userService = {
    // Watchlist
    getWatchlist: () => api.get('/users/watchlist').then(r => r.data),
    addToWatchlist: (data) => api.post('/users/watchlist', data).then(r => r.data),
    updateWatchlistStatus: (animeId, status) => api.patch(`/users/watchlist/${animeId}`, { status }).then(r => r.data),
    removeFromWatchlist: (animeId) => api.delete(`/users/watchlist/${animeId}`).then(r => r.data),

    // Favorites
    getFavorites: () => api.get('/users/favorites').then(r => r.data),
    toggleFavorite: (data) => api.post('/users/favorites/toggle', data).then(r => r.data),

    getProfile: () => api.get('/users/profile').then(r => r.data),
    updateProfile: (data) => api.patch('/users/profile', data).then(r => r.data),
    updatePassword: (data) => api.patch('/users/password', data).then(r => r.data),
    getContinueWatching: () =>
        api.get('/users/continue-watching').then(r => r.data),

    updateProgress: (animeId, progress) =>
        api.patch(`/users/progress/${animeId}`, { progress }).then(r => r.data),
}

export default userService