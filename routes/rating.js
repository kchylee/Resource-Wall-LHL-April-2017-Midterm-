"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.post("/", (req, res) => {
    console.log('req body star: ' + req.body.star);
    knex('ratings')
    .returning("*")
    .insert({
      user_id: 2, //Need to get from req.session
      resource_id: 1,//Need to get from req.body
      rating: req.body.star
    })
    .then( (result) => {
      res.status(200).send(result);
    })
  })
  return router;
}
