"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  router.post("/category", (req, res) => {
        knex('category').insert({cat_name: req.body.name, user_id: req.session.user_id});
        alert(`Category ${req.body.name} created!`);
  });
  return router;
}
