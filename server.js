"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// passport for user authentication
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.

const options = {
  usernameField: 'email',
  passwordField: 'password',
  session: true
}

passport.use(new LocalStrategy(options,
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
    // });

    }));
// }

// passport.use(new Strategy(
//   function(username, password, cb) {
//     db.users.findByUsername(username, function(err, user) {
//       if (err) { return cb(err); }
//       if (!user) { return cb(null, false); }
//       if (user.password != password) { return cb(null, false); }
//       return cb(null, user);
//     });
//   }));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  console.log("serializing")
  console.log(user)
  cb(null, user.id);
});

// passport.deserializeUser(function(id, cb) {
//   db.users.findById(id, function (err, user) {
//     if (err) { return cb(err); }
//     cb(null, user);
//   });
// });

passport.deserializeUser((id, done) => {
  knex('users').where({id}).first()
  .then((user) => { done(null, user); })
  .catch((err) => { done(err,null); });
});

// Separated Routes for each Resource
const usersRoutes = require("./routes/users");
// const loginRoutes = require("./routes/login");
const signupRoutes = require("./routes/signup");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));
// app.use("/login", loginRoutes(knex));
app.use("/signup", signupRoutes(knex));

// Home Page
app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

// LOGIN ===============================
// show the login form
app.get('/login', (req, res) => {
    console.log('get login')
    res.render("login");
});

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

// // // SIGNUP =================================
// // // show the signup form
app.get('/signup',
  passport.authenticate('local', { failureRedirect: '/signup' }),
  (req, res) => {
  res.render("/");
});

// LOGOUT ==============================
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
