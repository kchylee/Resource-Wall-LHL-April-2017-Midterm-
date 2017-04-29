// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;

require('dotenv').config();

const ENV         = process.env.ENV || "development";
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const knexLogger  = require('knex-logger');
const bcrypt      = require('bcrypt-nodejs')

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    passport.serializeUser(function(user, cb) {
      console.log("serializing")
      console.log(user)
      cb(null, user.id);
    });

    passport.deserializeUser((id, done) => {
      console.log("deserializing")
      knex('users').where({id}).first()
      .then((user) => {
        console.log(user);
        done(null, user); })
      .catch((err) => { done(err,null); });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================

    const options = {
      usernameField: 'email',
      passwordField: 'password',
      session: true
    }

    passport.use('local-login', new LocalStrategy(options,
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
          if (! bcrypt.compareSync(password, results[0].password) ) { //results[0].password !== password) {
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

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, username, password, done) {
        console.log('signing up')
        knex
        .select("*")
        .from("users")
        .where("email","=",req.body.email)
        .then((results) => {
          if (results.length !== 0) {
            console.log("email already exist");
            return done(null, false)
            //res.redirect('/signup')
          }
          else {
            knex("users")
            .insert({"first_name": req.body.first_name,
                "last_name": req.body.last_name,
                "email": req.body.email,
                "handle": req.body.handle,
                "password": bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null)}) //req.body.password})
            .then(() => {
                console.log('Done insert');
                let user_id = knex
                            .select("*")
                            .from("users")
                            .where("email","=",req.body.email).then((results) => {
                                let user = {
                                    id: results[0].id,
                                    local: {
                                    password: results[0].password, //req.body.password,
                                    email: req.body.email
                                    }
                                }
                                console.log(user);
                                return done(null, user);
                                })
          })
        }
    });
}))
}
