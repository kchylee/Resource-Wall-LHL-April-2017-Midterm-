"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.post("/", (req, res) => {
    console.log('req body comment: ' + req.body.comment);
    knex('comments')
    .insert({
      user_id: 2, //Need to get from req.session
      resource_id: 1, //Need to get from req.body
      comment: req.body.comment
    })
    .then( (result) => {
      res.end();
    })
  })
  return router;
}
