"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  router.get("/:query", (req, res) => {
    if (req.params.query.trim() === ""){ //Checks if query is empty
      res.status(400);
    }else{
      let qArr = req.params.query.replace(/\s/g, "%'), UPPER('%");
        knex
        .raw(`select * from resources where UPPER(title) like any (array[UPPER('%${qArr}%')]) or UPPER(description) like any (array[UPPER('%${qArr}%')])`)
        .then( (results) => {
          console.log(results);
          res.json(results);
        });
    };
  });
return router;
}

