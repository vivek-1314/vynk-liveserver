const express = require('express') ;
const { thoughtPool } = require("../server/mainpool"); 

const livepooldetails = (req, res) => {
    const arr = [];

    for (const [socketId, thought] of thoughtPool) {
      arr.push({
        socketId,
        thought: thought.thought
      });
    }
  
    res.status(200).json({
      size: arr.length,
      arr
    });
}

module.exports = {
    livepooldetails,
  };