"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.post("/", (req, res) => {
    console.log('req body comment: ' + req.body.comment);
    console.log('req body userID: ' + req.body.userID);
    console.log('req body resourceID: ' + req.body.resourceID);
    knex('comments')
    .insert({
      user_id: req.body.userID, //Need to get from req.session
      resource_id: req.body.resourceID, //Need to get from req.body
      comment: req.body.comment
    })
    .then( (result) => {
      res.json(result);
    })
  })
  return router;
}
