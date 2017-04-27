"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/search", (req, res) => {
    let resultArr = [];
    if (req.body.query.trim().length = ""){ //Checks if query is empty
      res.status(400);
    }else{
     queryArr = req.body.query.split(" "); //Splits query into array by space (if exists)
      queryArr.forEach((query) => {
        knex
        .select("*")
        .from("resources")
        .where(description, 'like', `%${query}%`)
        .orWhere(title, 'like', `%${query}%`)
        .orWhere(created_by, 'like', `%${query}%`)
        .then((results) => {
          resultArr.push(results);
          res.json(resultArr);
        });
      });
    }
  });
  return router;
}
