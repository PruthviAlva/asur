const express = require('express')
const router = express.Router()
const { protect } = require('../middlewares/authMiddleware')
const {
    getWatchlist, addToWatchlist, updateWatchlistStatus, removeFromWatchlist,
    getFavorites, toggleFavorite,
} = require('../controllers/userController')

// All routes require authentication
router.use(protect)

router.get('/watchlist', getWatchlist)
router.post('/watchlist', addToWatchlist)
router.patch('/watchlist/:animeId', updateWatchlistStatus)
router.delete('/watchlist/:animeId', removeFromWatchlist)

router.get('/favorites', getFavorites)
router.post('/favorites/toggle', toggleFavorite)

module.exports = router