"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  router.post("/", (req, res) => {
        knex('category')
        .insert({
          cat_name: req.body.catname,
          user_id: 1      //Dummy ID
        })
        .then((result) => {
          console.log(result);
        });
        res.redirect("/");
  });
  return router;
}
