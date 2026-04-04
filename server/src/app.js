require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')

const { connectRedis } = require('./config/redis')
const { notFound, errorHandler } = require('./middlewares/errorHandler')
const healthRoutes = require('./routes/healthRoutes')
const authRoutes = require('./routes/authRoutes')

const app = express()

// ─── Connect Redis ────────────────────────────────────────────
connectRedis()

// ─── Security Middlewares ─────────────────────────────────────
app.use(helmet()) // Sets secure HTTP headers

app.use(cors({
    origin: process.env.CLIENT_URL, // Only allow our frontend
    credentials: true,              // Allow cookies/auth headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}))

// Rate limiting — prevent API abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,                  // 200 requests per window per IP
    message: { success: false, message: 'Too many requests, slow down.' },
    standardHeaders: true,
    legacyHeaders: false,
})
app.use('/api', limiter)

// ─── Logging ──────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')) // Colorful logs in dev
}

// ─── Body Parsers ─────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))

// ─── Routes ───────────────────────────────────────────────────
app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)

// app.use('/api/users', userRoutes)

// ─── Error Handling ───────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

module.exports = app