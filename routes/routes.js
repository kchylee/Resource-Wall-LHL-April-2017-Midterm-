require('dotenv').config();

const ENV         = process.env.ENV || "development";
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const bcrypt      = require('bcrypt-nodejs')

module.exports = function(app, passport) {

  // Home Page
  app.get("/", (req, res) => {
    console.log("request at Root:",req.user);
    res.render("home", { user: req.user });
  });

  // Index Page
  app.get("/index", (req, res) => {
    console.log("request at Root:",req.user);
    res.render("index", { user: req.user });
  });

  // LOGIN ===============================
  // show the login form
  app.get('/login', (req, res) => {
    console.log("request at login:",req.flash);
    console.log('get login');
    res.render("login", { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // passport.serializeUser(function(user, done) {
  //   done(null, user);
  // });

  // passport.deserializeUser(function(obj, done) {
  //   done(null, obj);
  // });

  // github ===============================
  // show the login form
  // GET /auth/github
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  The first step in GitHub authentication will involve redirecting
  //   the user to github.com.  After authorization, GitHub will redirect the user
  //   back to this application at /auth/github/callback
  app.get('/auth/github',
    passport.authenticate('github', { scope: [ 'user:email' ] }),
    function(req, res){
      // The request will be redirected to GitHub for authentication, so this
      // function will not be called.
    });

  // GET /auth/github/callback
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  If authentication fails, the user will be redirected back to the
  //   login page.  Otherwise, the primary route function will be called,
  //   which, in this example, will redirect the user to the home page.
  app.get('/auth/github/callback',
    passport.authenticate('github', {
      failureRedirect: '/login' }),
    function(req, res) {
      console.log(req.user)
      res.render('profile.ejs', {user_github: req.user});
    });

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function(req, res) {
    console.log("at profile:", req.user.id);
    res.render('profile.ejs', {
        user : req.user
    });
  });

  // CHANGE PASSWORD =========================
  app.get('/change_password', isLoggedIn, function(req, res) {
      console.log("at change_password:", req.user.id);
      res.render('change_password.ejs', {
          message: req.flash('changePasswordMessage')
      });
    });

  app.post('/change_password', passport.authenticate('local-change_password', {
      successRedirect : '/profile', // redirect to the secure profile section
      failureRedirect : '/change_password', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  }));

  // LOGOUT ==============================
  app.get('/logout', function(req, res) {
      console.log("before logout:", req.session)
      req.logout();
      console.log("after logout:",req.session);
      res.redirect('/');
  });

  // // // SIGNUP =================================
  // // // show the signup form
  app.get('/signup',
    (req, res) => {
      console.log("request at signup:",req.session);
      console.log('sign up');
      res.render("signup", { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
      successRedirect : '/profile', // redirect to the secure profile section
      failureRedirect : '/signup', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  }));

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}
