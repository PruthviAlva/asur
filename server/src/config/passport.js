const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const prisma = require('./db')

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value
                const avatar = profile.photos[0]?.value
                const googleId = profile.id
                const username = profile.displayName

                // Check if user already exists by googleId
                let user = await prisma.user.findUnique({
                    where: { googleId }
                })

                if (user) {
                    // Existing Google user — just return them
                    return done(null, user)
                }

                // Check if email already registered (email/password user)
                user = await prisma.user.findUnique({ where: { email } })

                if (user) {
                    // Link Google account to existing email user
                    user = await prisma.user.update({
                        where: { email },
                        data: { googleId, avatar },
                    })
                    return done(null, user)
                }

                // Brand new user — create account
                user = await prisma.user.create({
                    data: { email, username, googleId, avatar }
                    // No password field — Google users don't need one
                })

                return done(null, user)
            } catch (err) {
                return done(err, null)
            }
        }
    )
)

// Not using sessions — just need these for Passport internals
passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) => done(null, { id }))

module.exports = passport