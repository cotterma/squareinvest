const express = require('express')
const router = express.Router()
const annonce = require('../controllers/annonce.js')

router.post('/annonce', annonce.newAnnonce)
router.delete('/annonce/:id', annonce.deleteAnnonce)
router.put('/annonce/:id', annonce.updateAnnonce)

module.exports = router
