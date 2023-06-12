const express = require('express')
const router = express.Router()
const auth = require('../controllers/auth.js')

router.post('/auth', auth.accessAdmin)

module.exports = router
