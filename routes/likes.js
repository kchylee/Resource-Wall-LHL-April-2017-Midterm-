"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.post("/", (req, res) => {
    console.log('userID: ' + req.body.userID);
    console.log('resourceID: ' + req.body.resourceID);
    knex('likes')
    .returning('*')
    .insert({
      user_id: req.body.userID, //Need to get from req.session
      resource_id: req.body.resourceID//Need to get from req.body
    })
    .then( (result) => {
      console.log('like result: ' + result);
      res.json(result);
    })
  })
  return router;
}
