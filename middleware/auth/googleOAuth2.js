import passport from 'passport'
import User from './../../db/models/user'

const GoogleStrategy = require("passport-google-oauth20").Strategy

export const googleAuth = () => (req, res, next) =>
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })(req, res, next)


export const googleAuthRdr = () => (req, res, next) =>
    passport.authenticate('google')(req, res, next)


passport.use('google', new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/users/login/google/redirect"
    },
    (accessToken, refreshToken, profile, done) => {
        // passport callback function
        // check if user already exists in our db with the given email
        console.log('profile', profile);
        User.findOne({ email: profile.emails[0].value }).then((currentUser) => {
            console.log('currentUser', currentUser);
            if (currentUser) {
                // if we already have a record with the given email
                done(null, currentUser)
            } else {
                // if not, create a new user
                new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: 'accessToken' // TODO: Fix
                }).save().then((newUser) => {
                    done(null, newUser);
                });
            }
        })
    })
)

passport.serializeUser((user, done) => {
    console.log('serializeUser', user);
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});