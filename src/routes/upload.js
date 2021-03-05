const express = require('express');
const router = express.Router();

const multer = require('multer');
const uploadDir = 'user-upload';
const upload = multer({ dest: uploadDir });

const uploadController = require('../app/controllers/UploadController');

router.get('/', (req, res, next) => uploadController.getUpload(req, res, next));

router.post('/', upload.single('file'), (req, res) =>
    uploadController.uploadSingle(req, res),
);

module.exports = router;
