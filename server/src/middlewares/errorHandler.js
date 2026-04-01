// 404 handler — for routes that don't exist
const notFound = (req, res, next) => {
    const error = new Error(`Not Found — ${req.originalUrl}`)
    res.status(404)
    next(error)
}

// Global error handler — catches all errors passed to next()
const errorHandler = (err, req, res, next) => {
    // Sometimes Express passes a 200 status with an error, fix it
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode

    console.error(`[ERROR] ${err.message}`)
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack)
    }

    res.status(statusCode).json({
        success: false,
        message: err.message,
        // Only show stack trace in development
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    })
}

module.exports = { notFound, errorHandler }