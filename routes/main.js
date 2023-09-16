const express = require('express');
const router = express.Router();
const mainController = require('../controller/main')
const {check} = require('express-validator')
const isAuth = require('../middleware/isAuth')

/* GET home page. */
router.get('/', mainController.index);
router.get('/login',mainController.login)
router.get('/register',mainController.register)
router.get('/reset',mainController.reset)
router.get('/reset/:token',mainController.resetPassword)

router.post('/register',check('email').isEmail(),mainController.register)
router.post('/login',mainController.login)
router.post('/logout',mainController.logout)
router.post('/reset',mainController.reset)
router.post('/reset/:token',mainController.resetPassword)

module.exports = router;
