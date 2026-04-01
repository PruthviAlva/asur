const express = require('express')
const router = express.Router()
const prisma = require('../config/db')

// GET /api/health — verify server + DB are up
router.get('/', async (req, res) => {
    try {
        // Quick DB check — runs a lightweight query
        await prisma.$queryRaw`SELECT 1`

        res.json({
            success: true,
            message: '✅ Asur API is healthy',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            database: 'connected',
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: '❌ Database connection failed',
            error: err.message,
        })
    }
})

module.exports = router