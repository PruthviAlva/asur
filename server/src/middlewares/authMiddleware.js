const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

const protect = async (req, res, next) => {
    try {
        // Token comes in header: "Authorization: Bearer <token>"
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Not Authorized' });
        }

        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Attach user to request (without password)
        req.user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, username: true, avatar: true }
        })

        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User not found' })
        }

        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Token invalid or expired' })
    }
}

module.exports = { protect }