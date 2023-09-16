const express = require('express');
const router = express.Router();
const msgController = require('../controller/msg')
const {check} = require('express-validator')
const isAuth = require("../middleware/isAuth");

router.get('/msg',isAuth,msgController.msg)

router.post('/msg',isAuth,msgController.msg)
router.post('/send',isAuth,msgController.send)

module.exports = router
