const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('../config/passport')
const { register, login, getMe } = require('../controllers/authController')
const { protect } = require('../middlewares/authMiddleware')

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe) // protected — needs valid JWT

// ── Google OAuth ──────────────────────────────────

// Step 1: Redirect user to Google consent screen
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
    })
)

// Step 2: Google redirects back here after user approves
router.get('/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
    }),
    (req, res) => {
        // Passport puts the user on req.user after success
        const token = jwt.sign(
            { id: req.user.id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        )

        // Redirect to frontend with token in URL param
        // Frontend will extract it and store in localStorage
        res.redirect(
            `${process.env.CLIENT_URL}/auth/callback?token=${token}`
        )
    }
)

module.exports = router