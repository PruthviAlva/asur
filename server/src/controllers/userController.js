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

// ── GET /api/users/profile ────────────────────────
const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                username: true,
                avatar: true,
                googleId: true,
                createdAt: true,
                // Count related records directly
                _count: {
                    select: {
                        watchlist: true,
                        favorites: true,
                    }
                }
            }
        })

        // Get watchlist breakdown by status
        const watchlistStats = await prisma.watchlist.groupBy({
            by: ['status'],
            where: { userId: req.user.id },
            _count: { status: true },
        })

        // Shape into { WATCHING: 5, COMPLETED: 12, ... }
        const statusBreakdown = watchlistStats.reduce((acc, item) => {
            acc[item.status] = item._count.status
            return acc
        }, {})

        res.json({
            success: true,
            data: {
                ...user,
                watchlistStats: statusBreakdown,
            }
        })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// ── PATCH /api/users/profile ──────────────────────
const updateProfile = async (req, res) => {
    try {
        const { username, avatar } = req.body

        if (username && username.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Username must be at least 3 characters'
            })
        }

        const updated = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                ...(username && { username: username.trim() }),
                ...(avatar && { avatar }),
            },
            select: {
                id: true, email: true,
                username: true, avatar: true
            }
        })

        res.json({ success: true, data: updated })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// ── PATCH /api/users/password ─────────────────────
const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body
        const bcrypt = require('bcryptjs')

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Both current and new password required'
            })
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters'
            })
        }

        // Get full user record (need hashed password)
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        })

        // Google OAuth users have no password
        if (!user.password) {
            return res.status(400).json({
                success: false,
                message: 'Google accounts cannot change password here'
            })
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            })
        }

        const hashed = await bcrypt.hash(newPassword, 12)
        await prisma.user.update({
            where: { id: req.user.id },
            data: { password: hashed }
        })

        res.json({ success: true, message: 'Password updated successfully' })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// GET /api/users/continue-watching
const getContinueWatching = async (req, res) => {
    try {
        const items = await prisma.watchlist.findMany({
            where: {
                userId: req.user.id,
                status: 'WATCHING', // only currently watching
            },
            orderBy: { createdAt: 'desc' },
            take: 12, // max 12 in the row
        })

        res.json({ success: true, data: items })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// PATCH /api/users/progress/:animeId — update episode progress
const updateProgress = async (req, res) => {
    try {
        const { progress } = req.body
        const animeId = Number(req.params.animeId)

        const entry = await prisma.watchlist.update({
            where: { userId_animeId: { userId: req.user.id, animeId } },
            data: { progress: Number(progress) },
        })

        res.json({ success: true, data: entry })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// Add to module.exports:
module.exports = {
    getWatchlist, addToWatchlist, updateWatchlistStatus,
    removeFromWatchlist, getFavorites, toggleFavorite,
    getProfile, updateProfile, updatePassword,
    getContinueWatching, updateProgress, // ← add
}