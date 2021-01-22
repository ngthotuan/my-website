const express = require('express');
const router = express.Router();

const readArticleController = require('../app/controllers/ReadArticleController');

router.get('/', (req, res, next) =>
    readArticleController.index(req, res, next),
);

router.get('/api', (req, res, next) =>
    readArticleController.getApi(req, res, next),
);

module.exports = router;
