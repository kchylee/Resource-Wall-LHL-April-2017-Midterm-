// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;

require('dotenv').config();

const ENV         = process.env.ENV || "development";
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const knexLogger  = require('knex-logger');
const bcrypt      = require('bcrypt-nodejs')

const GitHubStrategy = require('passport-github2').Strategy;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    passport.serializeUser(function(user, cb) {
      //console.log("serializing")
      //console.log(user)
      cb(null, user.id);
    });

    passport.deserializeUser((id, done) => {
      console.log("deserializing:", id)
      knex('users').where({id}).first()
      .then((user) => {
        //console.log(user);
        done(null, user); })
      .catch((err) => { done(err,null); });
    });

    // passport.serializeUser(function(user, done) {
    //   done(null, user);
    // });

    passport.deserializeUser(function(obj, done) {
        console.log("github: deserializing:", obj)
        done(null, obj);
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================

    const options = {
      usernameField: 'email',
      passwordField: 'password',
      session: true,
      passReqToCallback : true
    }

    passport.use('local-login', new LocalStrategy(options,
      function(req, username, password, cb) {
        console.log('username:',username, 'password:', password);
        knex
        .select("*")
        .from("users")
        .where("email","=",username)
        .then((results) => {
          if (results.length === 0) {
            return cb(null, false, req.flash('loginMessage', 'User not found.'));
          }
          if (! bcrypt.compareSync(password, results[0].password) ) {
            return cb(null, false, req.flash('loginMessage', 'Password incorrect.'));
          }
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
            console.log("Email already exist");
            return done(null, false, req.flash('signupMessage', 'Email is already taken.'));
          }
          else if (req.body.password !== req.body.password_retype) {
            console.log("password does not match")
            return done(null, false, req.flash('signupMessage', 'Entered passwords do not match.'))
          }
          else {
            knex("users")
            .insert({"first_name": req.body.first_name,
                "last_name": req.body.last_name,
                "email": req.body.email,
                "handle": req.body.handle,
                "password": bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null)}) //req.body.password})
            .then(() => {
                let user_id = knex
                    .select("*")
                    .from("users")
                    .where("email","=",req.body.email)
                    .then((results) => {
                        let user = {
                            id: results[0].id,
                            local: {
                            password: results[0].password,
                            email: req.body.email
                            }
                        }
                    console.log(user);
                    return done(null, user);
                    })
                })
            }
        })
        .catch((err) => done(err));
    }))

    // =========================================================================
    // LOCAL PASSWORD CHANGE ===================================================
    // =========================================================================

    // const options = {
    //   usernameField: 'email',
    //   passwordField: 'password',
    //   session: true,
    //   passReqToCallback : true
    // }

    passport.use('local-change_password', new LocalStrategy(options,
      function(req, username, password, cb) {
        console.log('changing password', req.user);
        let flag = false;
        knex
        .select("*")
        .from("users")
        .where("id","=",req.user.id)
        .then((results) => {
          console.log(results[0])
          if (! bcrypt.compareSync(req.body.password, results[0].password) ) {
            console.log('original password incorrect')
            return cb(null, false, req.flash('changePasswordMessage', 'Original password incorrect.'));
          }
          else if (req.body.new_password !== req.body.confirm_password) {
            console.log("password does not match");
            return cb(null, false, req.flash('changePasswordMessage', 'Entered passwords do not match.'));
          } else {
            knex("users")
            .where('id', req.user.id)
            .update({"password": bcrypt.hashSync(req.body.new_password, bcrypt.genSaltSync(8), null)})
            .then (() => {
                knex
                .select("*")
                .from("users")
                .where("id","=",req.user.id)
                .then ((results) => {
                    return cb(null, results[0]);
                })
            })
        }
        })
        .catch((e)=>{ console.log(e) })
      }));


    passport.use(new GitHubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:8080/auth/github/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        console.log(profile)
        process.nextTick(function () {
          // To keep the example simple, the user's GitHub profile is returned to
          // represent the logged-in user.  In a typical application, you would want
          // to associate the GitHub account with a user record in your database,
          // and return that user instead.
          // console.log('signing up')
          knex
          .select("*")
          .from("users")
          .where("email","=",profile.emails[0].value)
          .then((results, err) => {
            if (results.length !== 0) {
              console.log("Email found");
              return done(null,results[0]);
            } else {
              const nameArr = profile.displayName.split(" ");
              knex("users")
              .insert({"first_name": nameArr[0],
                "last_name": nameArr[nameArr.length-1],
                "email": profile.emails[0].value,
                "handle": profile.username,
                "password": null }) //req.body.password})
              .then(() => {
                let user_id = knex
                    .select("*")
                    .from("users")
                    .where("email","=",profile.emails[0].value)
                    .then((results, err) => {
                        let user = {
                            id: profile.id,
                            local: {
                            email: profile.emails[0].value
                            }
                        }
                    console.log(user);
                    return done(null, user);
                    })
                })
              }
            })
          .catch((err) => done(err));
          })
        }));
          //return done(null, profile);

}
