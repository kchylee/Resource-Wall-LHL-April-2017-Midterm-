"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  router.get("/", (req, res) => {
        knex
        .select("*")
        .from("ratings")
        .where({
          user_id: req.body.userID
        })
        .then((result) => {
          res.json(result);
        });
  });
  return router;
}
