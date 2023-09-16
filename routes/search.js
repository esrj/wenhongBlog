const express = require('express');
const router = express.Router();
const searchController = require('../controller/search')
const {check} = require('express-validator')
const isAuth = require("../middleware/isAuth");


router.post('/search',searchController.search)

module.exports = router
