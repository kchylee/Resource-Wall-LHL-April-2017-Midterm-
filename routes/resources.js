
"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  // insert a resource.
  router.post("/", (req, res) => {
    knex("resources")
      .returning('*')
      .insert({
        url: req.body.url,
        title: req.body.title,
        description: req.body.description,
        created_by: req.body.createdBy
      }).then( (res) => {
          console.log("Response: ", res);
      }).catch( (e) => {
        console.error(e);
      });
    });


  // get resources
  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("resources")
      .then( (results) => {
        res.json(results);
      })
      .catch((e) => {
        console.error(e);
      })
  });

  return router;
}
