"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.post("/", (req, res) => {
    knex('ratings')
    .returning("*")
    .insert({
      user_id: req.body.userID,
      resource_id: req.body.resourceID,
      rating: req.body.rating
    })
    .then( (result) => {
      res.json(result);
    })
  })
  return router;
}
