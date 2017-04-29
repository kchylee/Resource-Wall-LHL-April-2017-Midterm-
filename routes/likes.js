"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.post("/", (req, res) => {
    knex('likes')
    .insert({
      user_id: req.session.userId,
      resource_id: req.body.reso_id
    })
    res.status(200);
    })
  };
  return router;
}
