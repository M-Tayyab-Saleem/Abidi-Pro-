// routes/file.routes.js
const router = require('express').Router();
const ctrl   = require('../../controllers/filesController');
router.post('/',                ctrl.register);
router.get('/:fileId/download', ctrl.downloadUrl);
router.patch('/:fileId/soft-delete', ctrl.softDeleteFile);
module.exports = router;
