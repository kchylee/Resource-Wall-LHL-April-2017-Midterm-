"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.post("/", (req, res) => {
    console.log("Star: " + req.body.star);
    knex('ratings')
    .returning("*")
    .insert({
      user_id: req.body.userID, //Need to get from req.session
      resource_id: req.body.resourceID,//Need to get from req.body
      rating: req.body.rating
    })
    .then( (result) => {
      res.json(result);
    })
  })
  return router;
}
