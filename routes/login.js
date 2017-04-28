"use strict";

const express = require('express');
const router  = express.Router();
const passport = require('passport');
const Strategy = require('passport-local').Strategy;

module.exports = (knex) => {

  router.post("/",
    (req, res) => {
    knex
      .select("*")
      .from("users")
      .where("email","=",req.body.email)
      .then((results) => {
        if (console.log(results.length === 0)) {
          res.redirect('/');
        } else if (results.password !== req.body.password) {
          console.log('password incorrect')
        }
        {
          console.log('successful login')
          res.redirect('/')
        }
    });
  });

  return router;
}
