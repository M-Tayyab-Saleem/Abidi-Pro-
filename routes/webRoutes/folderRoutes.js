// routes/folder.routes.js
const router = require('express').Router();
const ctrl   = require('../../controllers/folderController');
router.get('/:id/contents', ctrl.getContents);
router.post('/',            ctrl.create);
module.exports = router;