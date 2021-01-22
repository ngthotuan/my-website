require('dotenv').config();

const UrlShorten = require('../models/UrlShorten');

class UploadController {
    // GET /shorten
    index(req, res) {
        res.render('url-shorten', { title: 'Rút gọn liên kết' });
    }

    async shortLink(req, res, next) {
        let { fullUrl, shortUrl } = req.body;
        let errorMessage;
        try {
            if (shortUrl) {
                const urlShortenFind = await UrlShorten.findOne({
                    shortUrl: shortUrl,
                });
                if (urlShortenFind !== null) {
                    errorMessage = `Đường dẫn  https://nguyenthotuan.me/go/${shortUrl} đã tồn tại, sử dụng liên kết mặc định`;
                    shortUrl = undefined;
                }
            } else {
                shortUrl = undefined;
            }
            const urlShortenCreate = await UrlShorten.create({
                fullUrl,
                shortUrl,
            });

            res.render('url-shorten/success', {
                title: 'Rút gọn liên kết thành công',
                errorMessage: errorMessage,
                shortUrl: `https://nguyenthotuan.me/go/${urlShortenCreate.shortUrl}`,
            });
        } catch (e) {
            next(e);
        }
    }

    // POST /upload
}

module.exports = new UploadController();
