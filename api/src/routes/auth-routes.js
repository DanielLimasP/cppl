let router = require('express').Router()

let userController = require('../controllers/auth-controller')

router.post('/signin', userController.signIn)
router.post('/new-pin', userController.signUp)
router.post('/logout', userController.logOut)

module.exports = router