const request = require('request');
const XmlUtils = require('../../utils/XmlUtils');
const url = 'https://vnexpress.net/rss/tin-moi-nhat.rss';
require('dotenv').config();

const PORT = process.env.PORT || 3000;

class ReadArticleController {
    // GET /read-article
    index(req, res) {
        request(
            {
                url: `http://localhost:${PORT}${req.baseUrl}/api`,
                method: 'GET',
            },
            function (error, response, body) {
                if (error) {
                    console.log(error);
                    res.send(`${Date()} Server have an error while fetch data`);
                } else {
                    const { size, title, update, items } = JSON.parse(body);
                    res.render('read-article/news-vnexpress', {
                        size,
                        title,
                        update,
                        items,
                    });
                }
            },
        );
    }

    // GET /read-article/api
    getApi(req, res) {
        XmlUtils.fromUrl(url, (err, json) => {
            if (err || json === null) {
                res.status(500).json({
                    message: 'Server have an error',
                });
            } else {
                const { title, pubDate, item } = json['rss']['channel'][0];
                let itemCV = item.map((element) => {
                    const { title, description, pubDate, link } = element;
                    const detail = description[0];
                    let image, content;
                    if (detail.includes('<img src="')) {
                        image = detail.substring(
                            detail.indexOf('<img src="') + 10,
                            detail.lastIndexOf('" ></a>'),
                        );
                        content = detail.substring(
                            detail.indexOf('</br>') + 5,
                            detail.length,
                        );
                    } else {
                        image = 'none';
                        content = detail;
                    }
                    return {
                        pubDate: pubDate[0],
                        link: link[0],
                        title: title[0],
                        image: image,
                        content: content,
                    };
                });
                res.json({
                    title: `Get Data From ${title[0]}`,
                    size: item.length,
                    update: pubDate[0],
                    items: itemCV,
                });
            }
        });
    }
}
module.exports = new ReadArticleController();
