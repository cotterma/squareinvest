const express = require('express')
const router = express.Router()
const demande = require('../controllers/demande.js')

router.post('/demande', demande.sendDemand)

module.exports = router