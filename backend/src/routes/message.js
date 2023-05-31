const express = require('express')
const router = express.Router()
const message = require('../controllers/message.js')

router.post('/msg', message.sendMsg)
router.get('/msg/:username', message.getMsgs)

module.exports = router
