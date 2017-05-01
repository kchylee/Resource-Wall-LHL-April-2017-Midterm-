"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const methodOverride = require('method-override')
const sass        = require("node-sass-middleware");
const app         = express();
const util = require('util');

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Separated Routes for each Resource
const usersRoutes = require("./routes/users");
const resourcesRoutes = require("./routes/resources");
const searchRoutes = require("./routes/search");
const catRoutes = require("./routes/categorize");
const addCatItems = require("./routes/addToCategory");
const getCat = require("./routes/getCategory");
const addLikes = require("./routes/likes");
const unlike = require("./routes/unlike");
const showLiked = require("./routes/showLiked");
const addComment = require("./routes/addComment");
const addRating = require("./routes/rating");
// passport for user authentication
const passport = require('passport');
const flash = require('connect-flash');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const partials = require('express-partials');

require('./auth/passport')(passport);

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes,
//         and uncolored for all other codes.

//app.use(morgan('dev'));
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(partials());

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.use(methodOverride('_method'))

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: false,
  outputStyle: 'expanded'
}));

app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));
app.use("/api/resources", resourcesRoutes(knex));
app.use("/api/category", catRoutes(knex));
app.use("/api/add_res", addCatItems(knex));
app.use("/api/category", getCat(knex));
app.use("/api/search/", searchRoutes(knex));
app.use("/api/like", addLikes(knex));
app.use("/api/comment", addComment(knex));
app.use("/api/rating", addRating(knex));
app.use("/api/unlike", unlike(knex));
app.use("/api/showLiked", showLiked(knex));

app.get("/", (req, res) => {
   res.render("home", { user: req.user });
});

app.get("/userhome", (req, res) => {
   res.render("userhome", { user: req.user });
});

app.get("/myresources", (req, res) => {
   res.render("myresources", { user: req.user });
});


// routes ======================================================================
require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
