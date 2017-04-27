
"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  // insert a resource.
  router.post("/", (req, res) => {
    knex("resources")
      insert({

      })
      .then((results) => {
        res.json(results);
    });
  });

  return router;
}
