const app = require('./src/app')
const prisma = require('./src/config/db')

const PORT = process.env.PORT || 5000

const startServer = async () => {
    try {
        // Verify DB connection on startup
        await prisma.$connect()
        console.log('✅ Database connected (Neon.tech)')

        app.listen(PORT, () => {
            console.log(`🚀 Asur API running on port ${PORT}`)
            console.log(`📍 Environment: ${process.env.NODE_ENV}`)
            console.log(`🏥 Health check: http://localhost:${PORT}/api/health`)
        })
    } catch (err) {
        console.error('❌ Failed to start server:', err)
        process.exit(1) // Exit so Render restarts the dyno
    }
}

startServer()

// Graceful shutdown — clean up DB connections
process.on('SIGTERM', async () => {
    console.log('Shutting down gracefully...')
    await prisma.$disconnect()
    process.exit(0)
})