"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  router.post("/add_res", (req, res) => {
  //Gets req.body.cat_id from dropdown of existing categories.
  //Create dropdown menu in html using <select> and <option>. Submit using <input type="submit">
        knex('cat_reso').insert({cat_id: req.body.cat_id, resource_id: req.body.reso_id});
        alert(`Resource ${req.body.name} added!`);
  });
  return router;
}
