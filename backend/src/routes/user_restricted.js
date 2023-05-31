const express = require('express')
const router = express.Router()
const user = require('../controllers/user.js')

router.get('/users', user.getAllUsers)
router.get('/limitedusers', user.getLimitedUsers)
router.get('/whoami', user.whoami)
router.delete('/user/:email', user.deleteUser)
router.put('/user/mail', user.updateMail)
router.put('/user/password', user.updatePassword)
router.put('/user/pref', user.updatePref)

module.exports = router
