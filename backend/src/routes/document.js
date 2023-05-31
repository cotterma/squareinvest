const express = require('express')
const router = express.Router()
const document = require('../controllers/document.js')

router.get('/documents', document.getDocumentsUser)
router.get('/documents/:mail', document.getUserDocument)
router.post('/upload_doc', document.upload)
router.delete('/files/:path', document.delete)

module.exports = router
