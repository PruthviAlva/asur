const Redis = require('ioredis')

let redis = null

const connectRedis = () => {
    // Only connect if REDIS_URL is configured
    if (!process.env.REDIS_URL) {
        console.log('⚠️  REDIS_URL not set — caching disabled')
        return null
    }

    redis = new Redis(process.env.REDIS_URL, {
        tls: {}, // Required for Upstash (rediss:// protocol)
        db: 0,
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
            if (times > 3) return null // Stop retrying after 3 attempts
            return Math.min(times * 200, 1000)
        },
    })

    redis.on('connect', () => console.log('✅ Redis connected (Upstash)'))
    redis.on('error', (err) => console.error('❌ Redis error:', err.message))

    return redis
}

// Cache helper — wraps get/set with JSON parse/stringify
const cache = {
    get: async (key) => {
        if (!redis) return null
        try {
            const data = await redis.get(key)
            return data ? JSON.parse(data) : null
        } catch (err) {
            console.error('Cache get error:', err.message)
            return null
        }
    },

    set: async (key, value, ttlSeconds = 3600) => {
        if (!redis) return
        try {
            await redis.setex(key, ttlSeconds, JSON.stringify(value))
        } catch (err) {
            console.error('Cache set error:', err.message)
        }
    },

    del: async (key) => {
        if (!redis) return
        try {
            await redis.del(key)
        } catch (err) {
            console.error('Cache del error:', err.message)
        }
    }
}

module.exports = { connectRedis, cache }