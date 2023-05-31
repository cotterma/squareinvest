const express = require('express')
const router = express.Router()
const annonce = require('../controllers/annonce.js')

router.get('/annonces', annonce.getAnnonces)
router.get('/annonce/:id', annonce.getAnnonce)

module.exports = router
