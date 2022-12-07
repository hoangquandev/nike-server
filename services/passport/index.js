// passport service
// 1. function password: verify user's username, pasw is correct
// 2. function master: verify master token (incase admin want to create new user)
// 3. function token: verify jwt from client send to server

import passport from 'passport'
import { BasicStrategy } from 'passport-http'
import User from '../../db/models/user'

const GoogleStrategy = require("passport-google-oauth20").Strategy

// const masterToken = 'whatever' // saved on ENV file

// Docs http://www.passportjs.org/docs/authenticate/
export const password = () => (req, res, next) =>
    passport.authenticate('password', {
        session: false
    }, (err, user, info) => {
        if (err && err.param) {
            return res.status(400).json(err)
        } else if (err || !user) {
            return res.status(401).end()
        }
        req.logIn(user, {
            session: false
        }, (err) => {
            if (err) return res.status(401).end()
            next()
        })
    })(req, res, next)

// const master = (req, res, next) => {

// }

// const token = (req, res, next) => {

// }

passport.use('password', new BasicStrategy((username, password, done) => {
    const user = User.find(u => {
        return u.username === username && u.password === password
    })
    if (!user) {
        done(true)
    } else {
        done(null, user)
    }
}))

// Google Login
passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/redirect"
    },
    (accessToken, refreshToken, email, done) => {
        // passport callback function
        // check if user already exists in our db with the given email
        User.findOne({ email }).then((currentUser) => {
            if (currentUser) {
                // if we already have a record with the given email
                done(null, currentUser)
            } else {
                // if not, create a new user
                new User({
                    email,
                }).save().then((newUser) => {
                    done(null, newUser);
                });
            }
        })
    })
)

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});