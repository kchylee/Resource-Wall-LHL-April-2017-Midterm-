"use strict";

const express = require('express');
const router  = express.Router();
const tableUsers = "users";

module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
    })
      .catch( (e) => {
        console.error(e);
      })
  });

  // Update a user.
  router.put("/update", (req, res) => {
    knex(tableUsers)
    .where({
      id: req.body.id,
    })
    .update({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      handle: req.body.handle,
      password: req.body.password
    })
    .then( (results) => {
      res.status(200).send(results);
    }, (rej) => {
      res.status(400).send(rej);
    })
  });

  // "Delete" a user.
  router.delete("/", (req, res) => {
    knex(tableUsers)
    .where({
      id: req.body.id,
    })
    .update({
      archived: 1,
    })
    .then( (results) => {
      res.status(200).send(results);
    }, (rej) => {
      res.status(400).send(rej);
    })
  });

  // insert a user.
  router.post("/", (req, res) => {
    knex(tableUsers)
      .returning('*')
      .insert({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        handle: req.body.handle,
        password: req.body.password,
        archived: 0
      }).then( (results) => {
          //console.log("Response: ", res);
          res.status(200).send(results);
      }, (rej) => {
        res.status(500).send(rej);
      });
    });

  // get a user through its ID. Returns JSON.
  router.get("/:id", (req, res) => {
    knex
      .select("*")
      .where('id', "=", req.params.id)
      .from(tableUsers)
      .then( (results) => {
        res.status(200).json(results);
      }, (rej) => {
        res.status(400).send(rej);
      });
  });

  return router;
}
