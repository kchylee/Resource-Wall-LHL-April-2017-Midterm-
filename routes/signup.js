"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.post("/", (req, res) => {
    knex
      .select("*")
      .from("users")
      .where("email","=",req.body.email)
      .then( (results) => {
          if (results.length !== 0) {
            console.log("email already exist")
            res.redirect('/signup')
          }
          else {
            knex("users")
              .returning("*")
              .insert
              ({
                  "first_name": req.body.first_name,
                  "last_name": req.body.last_name,
                  "email": req.body.email,
                  "handle": req.body.handle,
                  "password": req.body.password
                })
              .then( (results) => {
                res.redirect('/userhome')
              }, (rej) => {
                res.status(500).send(rej);
              });
          }
        }, (rej) => {
          res.status(500).send(rej);
        })
    })
  return router;

}
