const express = require('express');
const router = express.Router();
const profileController = require('../controller/profile')
const {check} = require('express-validator')
const isAuth = require("../middleware/isAuth");

router.get('/profile/:id',isAuth,profileController.profile)
router.get('/single/:id',isAuth,profileController.single)
router.get('/edit/:id',isAuth,profileController.edit)
router.get('/follow/:id',isAuth,profileController.follow)
router.get('/disfollow/:id',isAuth,profileController.disfollow)
router.get('/fans/:id',isAuth,profileController.fans_list)
router.get('/follows/:id',isAuth,profileController.follow_list)

router.post('/edit/:id',isAuth,profileController.edit)
router.post('/delete_account',isAuth,profileController.delete_account)
router.post('/fans/:id',isAuth,profileController.fans_list)
router.post('/follows/:id',isAuth,profileController.follow_list)
router.post('/like/:id',isAuth,profileController.like)


module.exports = router
