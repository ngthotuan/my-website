const express = require('express');
const router = express.Router();

const multer = require('multer');
const uploadDir = 'user-upload';
const upload = multer({ dest: uploadDir });
const courseController = require('../app/controllers/CourseController');

router.get('/', (req, res, next) => courseController.index(req, res, next));

router.get('/create', (req, res, next) =>
    courseController.createCourse(req, res, next),
);

router.post('/create', upload.single('image'), (req, res, next) =>
    courseController.storeCourse(req, res, next),
);

router.get('/:slug', (req, res, next) =>
    courseController.showDetail(req, res, next),
);

module.exports = router;
