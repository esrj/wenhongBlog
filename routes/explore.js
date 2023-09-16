const express = require('express');
const router = express.Router();
const exploreController = require('../controller/explore')
const {check} = require('express-validator')
const isAuth = require("../middleware/isAuth");

router.get('/explore',isAuth,exploreController.explore)



module.exports = router
