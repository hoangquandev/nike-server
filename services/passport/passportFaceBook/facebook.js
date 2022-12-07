
import { Router } from "express";
const passport = require("passport");
const facebookStrategy = require("passport-facebook").Strategy;
// const passport = require('passport')
const router = new Router(); 
router.use(passport.initialize());
router.use(passport.session())
const passport = require('passport')
app.use(passport.initialize());
app.use(passport.session())

const facebookStrategy = require("passport-facebook").Strategy;

passport.use(
  new facebookStrategy(
    {
      clientID: "152726539648546",
      clientSecret: "0e7c687b670077413a3af1cec5024ae5",
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields   : ['id','displayName','name','gender','picture.type(large)','email']
    },
    function(accessToken, refreshToken, profile, done) {
      // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      //   return cb(err, user);
      // });
      console.log("accessToken",accessToken);
      console.log("refreshToken",profile);
      
      
      // const { email, first_name, last_name } = profile._json;
      // const userData = {
      //   email,
      //   firstName: first_name,
      //   lastName: last_name
      // };
      // console.log(userData);
      // console.log(accessToken);
      // console.log(profile)
    return done(null,profile)
    } 
  )
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
  return done(null,user)
});

// server

import User from "./db/models/user"
const passport = require('passport')
// var session = require('express-session')
// app.use(session())
app.use(passport.initialize());
// app.use(session({
//   proxy: true,
//   name: "haha",
//   secret: 'hihi',
//   store: sessionStore,
//   resave: true,
//   saveUninitialized: true,
//   cookie: { secure: true }
// }))


const facebookStrategy = require("passport-facebook").Strategy;

passport.use(
  new facebookStrategy(
    {
      clientID: "152726539648546",
      clientSecret: "0e7c687b670077413a3af1cec5024ae5",
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields   : ['id','displayName','name','gender','picture.type(large)','email'],
      scope: ['email']
    },
    function(accessToken, refreshToken, profile, done) {
      // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      //   return cb(err, user);
      // });
      console.log("accessToken",accessToken);
      console.log("refreshToken",profile);
      
      
      // const { email, first_name, last_name } = profile._json;
      // const userData = {
      //   email,
      //   firstName: first_name,
      //   lastName: last_name
      // };
      // console.log(userData);
      // console.log(accessToken);
      // console.log(profile)

      // tìm trong database
    return done(null,profile)
    }
  )
);
// 
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user 
passport.deserializeUser(function(id, done) {
    User.findById(id).exec((err, user)=>{
      done(null,user)
    })
});



app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

app.get('/profile',(req,res) => {    
    res.send("success")
})
app.get("/fail", (req, res) => {
  res.send("Failed attempt");
});

app.use('/logout', (req, res, next) => {
  // req.logout();
  console.log(req.isAuthenticated());
  res.send('user is logged out');
})

// router.get('/auth/facebook/callback', 
// 		passport.authenticate('facebook', {
// 			successRedirect : '/profile',
// 			failureRedirect : '/fail'
//   }));
module.exports = router
app.get('/auth/facebook/callback', 
		passport.authenticate('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/fail'
  }));
