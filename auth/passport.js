// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;

require('dotenv').config();

const ENV         = process.env.ENV || "development";
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const knexLogger  = require('knex-logger');

// load up the user model
// var User       = require('../app/models/user');

// // load the auth variables
// var configAuth = require('./auth'); // use this one for testing

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    // passport.serializeUser(function(user, done) {
    //     done(null, user.id);
    // });

    // // used to deserialize the user
    // passport.deserializeUser(function(id, done) {
    //     User.findById(id, function(err, user) {
    //         done(err, user);
    //     });
    // });

    passport.serializeUser(function(user, cb) {
      console.log("serializing")
      console.log(user)
      cb(null, user.id);
    });

    passport.deserializeUser((id, done) => {
      knex('users').where({id}).first()
      .then((user) => { done(null, user); })
      .catch((err) => { done(err,null); });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // passport.use('local-login', new LocalStrategy({
    //     // by default, local strategy uses username and password, we will override with email
    //     usernameField : 'email',
    //     passwordField : 'password',
    //     passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    // },
    // function(req, email, password, done) {
    //     if (email)
    //         email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

    //     // asynchronous
    //     process.nextTick(function() {
    //         User.findOne({ 'local.email' :  email }, function(err, user) {
    //             // if there are any errors, return the error
    //             if (err)
    //                 return done(err);

    //             // if no user is found, return the message
    //             if (!user)
    //                 return done(null, false, req.flash('loginMessage', 'No user found.'));

    //             if (!user.validPassword(password))
    //                 return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

    //             // all is well, return user
    //             else
    //                 return done(null, user);
    //         });
    //     });

    // }));

    const options = {
      usernameField: 'email',
      passwordField: 'password',
      session: true
    }

    passport.use('local', new LocalStrategy(options,
      function(username, password, cb) {

        // const express = require('express');
        // const router  = express.Router();

        console.log('username:',username, 'password:', password);
        // router.post("/login",
        //   (req, res) => {
        knex
        .select("*")
        .from("users")
        .where("email","=",username)
        .then((results) => {
          if (console.log(results.length === 0)) {
            console.log("login fail: username wrong")
            return cb(null, false);
          }
          if (results[0].password !== password) {
            console.log("results:", results)
            console.log("results.password:", results.password, "password", password)
            console.log("login fail: wrong password")

            return cb(null, false);
          }
          console.log("login success")
          return cb(null, results[0]);
        })
        .catch((err) => cb(err));
    }));
};
    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // passport.use('local-signup', new LocalStrategy({
    //     // by default, local strategy uses username and password, we will override with email
    //     usernameField : 'email',
    //     passwordField : 'password',
    //     passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    // },
    // function(req, email, password, done) {
    //     if (email)
    //         email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

    //     // asynchronous
    //     process.nextTick(function() {
    //         // if the user is not already logged in:
    //         if (!req.user) {
    //             User.findOne({ 'local.email' :  email }, function(err, user) {
    //                 // if there are any errors, return the error
    //                 if (err)
    //                     return done(err);

    //                 // check to see if theres already a user with that email
    //                 if (user) {
    //                     return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
    //                 } else {

    //                     // create the user
    //                     var newUser            = new User();

    //                     newUser.local.email    = email;
    //                     newUser.local.password = newUser.generateHash(password);

    //                     newUser.save(function(err) {
    //                         if (err)
    //                             return done(err);

    //                         return done(null, newUser);
    //                     });
    //                 }

    //             });
    //         // if the user is logged in but has no local account...
    //         } else if ( !req.user.local.email ) {
    //             // ...presumably they're trying to connect a local account
    //             // BUT let's check if the email used to connect a local account is being used by another user
    //             User.findOne({ 'local.email' :  email }, function(err, user) {
    //                 if (err)
    //                     return done(err);

    //                 if (user) {
    //                     return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
    //                     // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
    //                 } else {
    //                     var user = req.user;
    //                     user.local.email = email;
    //                     user.local.password = user.generateHash(password);
    //                     user.save(function (err) {
    //                         if (err)
    //                             return done(err);

    //                         return done(null,user);
    //                     });
    //                 }
    //             });
    //         } else {
    //             // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
    //             return done(null, req.user);
    //         }

    //     });

    // }));
