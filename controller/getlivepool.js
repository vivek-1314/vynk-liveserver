const express = require('express') ;
const { thoughtPool } = require("../server/mainpool"); 

const livepooldetails = (req, res) => {
    const thoughts = Array.from(thoughtPool.values());
    res.status(201).json(thoughts);
}

module.exports = {
    livepooldetails,
  };