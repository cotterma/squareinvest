const router = require('express').Router()

router.use(require('./user'))
router.use('/auth_api', require('./user_restricted'))
router.use('/auth_api', require('./document'))
router.use(require('./annonce'))
router.use('/auth_api', require('./annonce_restricted'))
router.use('/auth_api', require('./message'))
router.use(require('./demande'))
router.use(require('./auth'))

module.exports = router
