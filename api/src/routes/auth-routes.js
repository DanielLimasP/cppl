let router = require('express').Router()

let authController = require('../controllers/auth-controller')

router.post('/signin', authController.signin)
router.post('/signup', authController.signup)
router.post('/new-pin', authController.newPin)
router.post('/logout', authController.logout)

module.exports = router