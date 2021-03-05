const express = require('express');
const router = express.Router();

const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');

const siteController = require('../app/controllers/SiteController');

const uploadStatic = 'uploads';

router.get('/', (req, res, next) => siteController.index(req, res, next));

router.get('/contact', (req, res, next) =>
    siteController.contact(req, res, next),
);

router.post('/contact', (req, res, next) =>
    siteController.postContact(req, res, next),
);

router.post('/subscribe', (req, res, next) =>
    siteController.postSubscribe(req, res, next),
);

router.get('/go/:shortUrl', (req, res, next) =>
    siteController.shorten(req, res, next),
);

router.get(`/${uploadStatic}/:type/:date/:fileName`, (req, res, next) =>
    siteController.shareFile(req, res, next),
);

router.get('/login', forwardAuthenticated, (req, res, next) =>
    siteController.getLogin(req, res, next),
);

router.get('/register', forwardAuthenticated, (req, res, next) =>
    siteController.getRegister(req, res, next),
);

router.post('/register', (req, res, next) =>
    siteController.postRegister(req, res, next),
);

router.post('/login', (req, res, next) =>
    siteController.postLogin(req, res, next),
);

router.get('/logout', (req, res, next) =>
    siteController.logout(req, res, next),
);

module.exports = router;
