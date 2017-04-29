"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/search/:query", (req, res) => {
    // let qStr = req.query;
    // console.log('qStr: ' + qStr);
    // let resultArr = [];
    if (req.params.query.trim() === ""){ //Checks if query is empty
      res.status(400);
    }else{
     let queryArr = req.params.query.split(" "); //Splits query into array by space (if exists)
      queryArr.forEach((query) => {
        console.log("inside for loop:" + query);
        knex
        .raw(`select * from resources where UPPER(title) like UPPER('%${query}%') or UPPER(description) like UPPER('%${query}%')`)
        .then((results) => {
          // res.redirect("/");
          res.json(results.rows);
        });
      });
    }

  });
  return router;
}
