"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  router.get("/", (req, res) => {
        knex
        .select("*")
        .from("category")
        .then((result) => {
          res.json(result);
        });
  });
  return router;
}
