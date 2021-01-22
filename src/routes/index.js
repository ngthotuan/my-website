const siteRouter = require('./site');
const uploadRouter = require('./upload');
const urlShortenRouter = require('./url-shorten');
const readArticleRouter = require('./read-article');
const courseRouter = require('./course');

function route(app) {
    app.use('/', siteRouter);
    app.use('/upload', uploadRouter);
    app.use('/url-shorten', urlShortenRouter);
    app.use('/read-article', readArticleRouter);
    app.use('/courses', courseRouter);
}

module.exports = route;
