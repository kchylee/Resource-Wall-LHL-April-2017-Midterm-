module.exports = function(app, passport) {

// Home Page
app.get("/home", (req, res) => {
  console.log("request at Root:",req.user);
  res.render("home", { user: req.user });
});

// LOGIN ===============================
// show the login form
app.get('/login', (req, res) => {
    console.log("request at login:",req.session);
    console.log('get login');
    res.render("login");
});

// process the login form
app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : false // allow flash messages
}));

// PROFILE SECTION =========================
app.get('/profile', isLoggedIn, function(req, res) {
    console.log(req.user);
    res.render('profile.ejs', {
        user : req.user
    });
});

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
    res.render("signup");
});

// process the signup form
app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : false // allow flash messages
}));

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
