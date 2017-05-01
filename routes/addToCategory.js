"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  router.post("/", (req, res) => {
        knex('cat_reso')
        .insert({
          cat_id: req.body.cat_id,
          resource_id: req.body.resourceID
        })
        .then(() => {
          res.redirect("/userhome");
        })
  });
  return router;
}
