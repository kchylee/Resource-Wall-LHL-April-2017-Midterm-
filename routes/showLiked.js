"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex('likes')
    .distinct('resource_id')
    .where({user_id: 2})
    .select()
    .then((result) => {
      res.json(result);
    })
  })
  return router;
}
