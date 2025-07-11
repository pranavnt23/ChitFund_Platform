const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../controllers/userController');

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, 'uploads/'),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

router.post('/register', upload.single('asset_doc'), userController.registerUser);
router.get('/schemes/:username', userController.getUserSchemes);

module.exports = router;
