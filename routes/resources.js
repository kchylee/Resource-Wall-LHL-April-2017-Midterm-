
"use strict";

const express = require('express');
const router  = express.Router();
const tableResources = "resources";

module.exports = (knex) => {

  // insert a resource.
  router.post("/", (req, res) => {
    knex(tableResources)
      .returning('*')
      .insert({
        url: req.body.url,
        title: req.body.title,
        description: req.body.description,
        created_by: req.body.createdBy
      }).then( (results) => {
          //console.log("Response: ", res);
          res.status(200).send(results);
      }, (rej) => {
        res.status(500).send(rej);
      });
    });

  // Update a resource.
  router.put("/update", (req, res) => {
    knex(tableResources)
    .where({
      id: req.body.id,
      created_by: req.body.created_by
    })
    .update({
      url: req.body.url,
      title: req.body.title,
      description: req.body.description
    })
    .then( (results) => {
      //console.log("Res after update: ", res)
      res.status(200).send(results);
    }, (rej) => {
      //console.error("Error when trying to update: ", rej);
      res.status(400).send(rej);
    })
  });

  // get all resources for the user. JSON format.
  router.get("/json/:userid", (req, res) => {
    knex
      .select("*")
      .where('created_by', "=", req.params.userid)
      .from(tableResources)
      .then( (results) => {
        res.status(200).json(results);
      }, (rej) => {
        res.status(400).send(rej);
      });
  });

  // get a resource through its ID. Returns JSON.
  router.get("/:id", (req, res) => {
    knex
      .select("*")
      .where('id', "=", req.params.id)
      .from(tableResources)
      .then( (results) => {
        res.status(200).json(results);
      }, (rej) => {
        res.status(400).send(rej);
      });
  });

  // "Delete" a resource.
  router.delete("/", (req, res) => {
    knex(tableResources)
    .where({
      id: req.body.id,
      created_by: req.body.created_by
    })
    .update({
      archived: 1,
    })
    .then( (results) => {
      //console.log("Res after update: ", res)
      res.status(200).send(results);
    }, (rej) => {
      //console.error("Error when trying to update: ", rej);
      res.status(400).send(rej);
    })
  });

  // get all resources.
  router.get("/", (req, res) => {
    knex
      .select("*")
      .from(tableResources)
      .then( (results) => {
        res.status(200).json(results);
      }, (rej) => {
        res.status(400).send(rej);
      })
  });

  return router;
}
