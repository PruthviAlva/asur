const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../config/db')

// Helper — generate JWT
const generateToken = (userId) =>
    jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    })

// Helper — safe user object (never send password)
const safeUser = (user) => ({
    id: user.id,
    email: user.email,
    username: user.username,
    avatar: user.avatar,
})

// ── POST /api/auth/register ───────────────────────
const register = async (req, res) => {
    try {
        const { email, username, password } = req.body

        // Basic validation
        if (!email || !username || !password) {
            return res.status(400).json({ success: false, message: 'All fields required' })
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })
        }

        // Check duplicate email
        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) {
            return res.status(409).json({ success: false, message: 'Email already registered' })
        }

        // Hash password — cost factor 12 is secure but not too slow
        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await prisma.user.create({
            data: { email, username, password: hashedPassword }
        })

        const token = generateToken(user.id)

        res.status(201).json({
            success: true,
            token,
            user: safeUser(user),
        })
    } catch (err) {
        console.error('Register error:', err)
        res.status(500).json({ success: false, message: 'Server error' })
    }
}

// ── POST /api/auth/login ──────────────────────────
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password required' })
        }

        // Find user
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user || !user.password) {
            // Don't reveal whether email exists — security best practice
            return res.status(401).json({ success: false, message: 'Invalid email or password' })
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' })
        }

        const token = generateToken(user.id)

        res.json({ success: true, token, user: safeUser(user) })
    } catch (err) {
        console.error('Login error:', err)
        res.status(500).json({ success: false, message: 'Server error' })
    }
}

// ── GET /api/auth/me ──────────────────────────────
// Returns current user from JWT — used on app load
const getMe = async (req, res) => {
    res.json({ success: true, user: req.user })
}

module.exports = { register, login, getMe }