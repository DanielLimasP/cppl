let router = require('express').Router()

let userController = require('../controllers/user-controller')

router.post('/signin', userController.signIn)
router.post('/new-pin', userController.signUp)
router.post('/logout', userController.logOut)

module.exports = router