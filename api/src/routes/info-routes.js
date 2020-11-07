let router = require('express').Router()
let infoController = require('../controllers/info-controller')

// Info routes: TODO
router.post('/', infoController.addInfo)

module.exports = router