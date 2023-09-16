const express = require('express');
const router = express.Router();
const blogController = require('../controller/blog')
const {check} = require('express-validator')
const isAuth = require("../middleware/isAuth");

router.get('/upload',isAuth,blogController.upload)

router.post('/upload',isAuth,blogController.upload)
router.post('/load',blogController.load)
router.post('/comment',blogController.comment)
router.post('/show_comment/:id',blogController.show_comment)



module.exports = router
