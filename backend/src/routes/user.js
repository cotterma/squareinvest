const express = require('express')
const router = express.Router()
const user = require('../controllers/user.js')

router.post('/register', user.register)
router.post('/login', user.login)
router.post('/confirmMail', user.confirmMail)

module.exports = router
