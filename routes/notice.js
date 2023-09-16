const express = require('express');
const router = express.Router();
const noticeController = require('../controller/notice')
const {check} = require('express-validator')
const isAuth = require("../middleware/isAuth");

router.get('/notice',isAuth,noticeController.notice)

router.post('/notice',isAuth,noticeController.notice)

module.exports = router
