
"use strict";

const express = require('express');
const routerResources  = express.Router();

module.exports = (knex) => {

  // insert a resource.
  routerResources.post("/", (req, res) => {
    knex("resources")
      .returning('*')
      .insert({
        url: req.body.url,
        title: req.body.title,
        description: req.body.description,
        created_by: req.body.createdBy
      })
      .then( (results) => {
        res.json(results);
    })
      .catch(function(e) {
        console.error(e);
      });
  });

  return routerResources;
}
