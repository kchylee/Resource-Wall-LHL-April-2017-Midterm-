"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.post("/", (req, res) => {
    console.log("inside unlike")
    knex('likes')
    .where({
      user_id: 2, //Need to get from req.session
      resource_id: 1//Need to get from req.body
    })
    .del()
    .then( () => {
      res.end();
    })
  })
  return router;
}
