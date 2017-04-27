"use strict";

const express = require('express');
const routerUsers  = express.Router();

module.exports = (knex) => {

  routerUsers.get("/", (req, res) => {
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

  return routerUsers;
}
