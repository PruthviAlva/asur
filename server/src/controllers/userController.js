const prisma = require('../config/db')

// ── WATCHLIST ─────────────────────────────────────

// GET /api/users/watchlist
const getWatchlist = async (req, res) => {
    try {
        const watchlist = await prisma.watchlist.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
        })
        res.json({ success: true, data: watchlist })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// POST /api/users/watchlist
const addToWatchlist = async (req, res) => {
    try {
        const { animeId, animeTitle, animeCover, status } = req.body

        if (!animeId || !animeTitle) {
            return res.status(400).json({ success: false, message: 'animeId and animeTitle required' })
        }

        // upsert = create if not exists, update if exists
        const entry = await prisma.watchlist.upsert({
            where: { userId_animeId: { userId: req.user.id, animeId: Number(animeId) } },
            update: { status: status || 'PLANNING', animeCover },
            create: {
                userId: req.user.id,
                animeId: Number(animeId),
                animeTitle,
                animeCover: animeCover || '',
                status: status || 'PLANNING',
            },
        })

        res.status(201).json({ success: true, data: entry })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// PATCH /api/users/watchlist/:animeId — update status
const updateWatchlistStatus = async (req, res) => {
    try {
        const { status } = req.body
        const animeId = Number(req.params.animeId)

        const entry = await prisma.watchlist.update({
            where: { userId_animeId: { userId: req.user.id, animeId } },
            data: { status },
        })

        res.json({ success: true, data: entry })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// DELETE /api/users/watchlist/:animeId
const removeFromWatchlist = async (req, res) => {
    try {
        const animeId = Number(req.params.animeId)

        await prisma.watchlist.delete({
            where: { userId_animeId: { userId: req.user.id, animeId } },
        })

        res.json({ success: true, message: 'Removed from watchlist' })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// ── FAVORITES ─────────────────────────────────────

// GET /api/users/favorites
const getFavorites = async (req, res) => {
    try {
        const favorites = await prisma.favorite.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
        })
        res.json({ success: true, data: favorites })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// POST /api/users/favorites — toggle (add if not exists, remove if exists)
const toggleFavorite = async (req, res) => {
    try {
        const { animeId, animeTitle, animeCover, type } = req.body

        const existing = await prisma.favorite.findUnique({
            where: {
                userId_animeId_type: {
                    userId: req.user.id,
                    animeId: Number(animeId),
                    type: type || 'ANIME',
                },
            },
        })

        if (existing) {
            // Already favorited → remove it
            await prisma.favorite.delete({ where: { id: existing.id } })
            return res.json({ success: true, favorited: false, message: 'Removed from favorites' })
        }

        // Not favorited → add it
        const fav = await prisma.favorite.create({
            data: {
                userId: req.user.id,
                animeId: Number(animeId),
                animeTitle,
                animeCover: animeCover || '',
                type: type || 'ANIME',
            },
        })

        res.status(201).json({ success: true, favorited: true, data: fav })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

module.exports = {
    getWatchlist, addToWatchlist, updateWatchlistStatus, removeFromWatchlist,
    getFavorites, toggleFavorite,
}