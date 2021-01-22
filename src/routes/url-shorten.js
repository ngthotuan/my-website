const express = require('express');
const router = express.Router();

const urlShortenController = require('../app/controllers/URLShortenController');

router.get('/', (req, res, next) => urlShortenController.index(req, res, next));

router.post('/', (req, res, next) => urlShortenController.shortLink(req, res));

module.exports = router;
