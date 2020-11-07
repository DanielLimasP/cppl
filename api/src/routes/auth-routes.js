let router = require('express').Router()

let authController = require('../controllers/auth-controller')

router.post('/signin', authController.signin)
router.post('/new-pin', authController.signup)
router.post('/logout', authController.logout)

module.exports = router