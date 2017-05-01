"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.post("/", (req, res) => {
    knex('comments')
    .insert({
      user_id: req.body.userID,
      resource_id: req.body.resourceID,
      comment: req.body.comment
    })
    .then( (result) => {
      res.json(result);
    })
  })
  return router;
}
