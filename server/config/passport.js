const passport = require("passport");
const passportJWT = require("passport-jwt");
require("dotenv").config();

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = passportJWT.Strategy;
const extractJWT = require("passport-jwt").ExtractJwt;
const FacebookStrategy = require("passport-facebook").Strategy;
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
      console.log("email here", email);
      console.log("password", password);
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

//Make sure you go to https://developers.facebook.com/ and update the redirect url after it is deployed

passport.use(
  new FacebookStrategy(
    {
      clientID: keys.fbAppId,
      clientSecret: keys.fbAppSecret,
      callbackURL:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/user/auth/facebook/callback"
          : "",
      // callbackURL: '/api/facebook/callback',
      profileFields: ["displayName", "photos", "email"],
      // profileFields: ["id", "displayName", "picture.type(large)"],
    },
    function (accessToken, refreshToken, profile, done) {
      console.log("did it work")
      // User.findOne({ facebookId: profile.id }, function (err, user) {
      User.findOne({ facebookId: profile.id }, function (err, user) {
        if (err) {
          console.log(err);
          return res.json(err);
        }

        //If user exists on Fakebook, return no error and the user
        if (user) {
          done(null, user);
        }

        let name = profile.displayName.split(" ");

        if (name.length !== 2) {
          // failed to get a first and last name
          name = [profile.displayName, ""];
        }

        //If no fakebook user with this facebook account then create new user
        var newUser = new User({
          firstname: name[0],
          lastname: name[1],
          email: profile.emails[0].value,
          password: keys.fbPassword,
          birthDate: new Date(),
          gender: "other",
          friendList: [],
          photo: profile.photos ? profile.photos[0].value : "",
          realFacebookID: profile.id,
          isPublished: true,
        });

        newUser.save(function (err, createdUser) {
          if (err) {
            console.log("Saving error");
            console.log(err);
            return done(err);
          } else {
            res.json("Submitted");
            return done(err, createdUser);
          }
        });
      });
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
