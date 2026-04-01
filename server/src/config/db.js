const { PrismaClient } = require('@prisma/client')

// Singleton: reuse the same Prisma instance
// Prevents "too many connections" in development with hot reload
const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
})

module.exports = prisma