const passport = require("passport");
const passportJWT = require("passport-jwt");
require("dotenv").config();

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = passportJWT.Strategy;
const extractJWT = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");
const keys = require("../config/keys");
const mongoose = require("mongoose");

const User = require("../models/User");

//Update passport part
// JWTStrategy vs LocalStrategy ?

//I think that JWT is being used and that this is being over written. Which is fine, but looks sloppy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (email, password, cb) {
      console.log("email", email);
      console.log("email", password);
      User.findOne({ email }, (err, user) => {
        if (err) return cb(err);
        if (!user)
          return cb(null, false, {
            message: "No account associated with this email",
          });

        bcrypt.compare(password, user.password, (err, match) => {
          console.log("got to here");
          if (err) return cb(err);
          if (!match) return cb(null, false, { message: "Incorrect Password" });
          return cb(null, user, { message: "Logged In successfully" });
        });
      });
    }
  )
);

// console.log("secretTunnel:", process.env.JWT_SECRET)

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: keys.secretOrKey,
      // //Production:
      // secretOrKey: process.env.JWT_SECRET,
    },
    (jwtPayload, cb) => {
      return cb(null, jwtPayload);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = passport;
