const router = require('express').Router()

const { fileUploadController, fileList, updateFile, deleteFile } = require('../controllers/file')

router.get('/file', fileList)
router.post('/file', fileUploadController)
router.put('/file/:id', updateFile)
router.delete('/file/:id', deleteFile)

module.exports = router