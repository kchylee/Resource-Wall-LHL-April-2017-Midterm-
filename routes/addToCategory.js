"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  router.post("/", (req, res) => {
  //Gets req.body.cat_id from dropdown of existing categories.
  //Create dropdown menu in html using <select> and <option>. Submit using <input type="submit">
    console.log("cat_id: " + req.body.cat_id);
    console.log("reso_id: " + req.body.reso_id);
        knex('cat_reso')
        .insert({
          cat_id: req.body.cat_id,
          resource_id: req.body.reso_id
        })
        .then((result) => {
          console.log(result);
        })
    res.redirect("/");
  });
  return router;
}
