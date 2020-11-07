const router = require('express').Router
const infoController = require('../controllers/info-controller')

// Info routes: TODO
router.post('add-info', infoController.addInfo)
