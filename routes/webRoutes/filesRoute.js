const router = require('express').Router();
const ctrl = require('../../controllers/filesController');
const { uploadFile } = require('../../middlewares/uploadMiddleware');
const { isLoggedIn } = require('../../middlewares/authMiddleware');

router.use(isLoggedIn);

router.post('/upload', 
  uploadFile, // This now includes the error handling wrapper
  ctrl.upload
);

router.get('/:fileId/download', ctrl.downloadUrl);
router.get('/', ctrl.getAccessibleFiles);
router.patch('/:fileId/access', ctrl.updateAccess);
router.patch('/:fileId/soft-delete', ctrl.softDeleteFile);
router.get('/getMyFiles', ctrl.getMyFiles);

module.exports = router;