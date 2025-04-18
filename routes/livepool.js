const express = require('express');
const { livepooldetails } = require('../controller/getlivepool');
const router = express.Router();

router.get('/getlivepooldetails', livepooldetails);

module.exports = router;
