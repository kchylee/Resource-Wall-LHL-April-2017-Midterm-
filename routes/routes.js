module.exports = function(app, passport) {

// Home Page
app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

// LOGIN ===============================
// show the login form
app.get('/login', (req, res) => {
    console.log('get login');
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
  (req, res) => {
    console.log('sign up');
    res.render("signup");
});

// LOGOUT ==============================
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

};
