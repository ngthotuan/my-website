const bcrypt = require('bcryptjs');
const passport = require('passport');

const Subscriber = require('../models/Subscriber');
const ContactMessage = require('../models/ContactMessage');
const UrlShorten = require('../models/UrlShorten');
const mailer = require('../../utils/mailer');
const User = require('../models/User');

const fs = require('fs');
const path = require('path');
const createError = require('http-errors');
const FileUtils = require("../../utils/FileUtils");
const uploadDir = process.env.UPLOAD_PATH || 'uploads';

class SiteController {
    index(req, res) {
        res.render('index', { title: 'Home' });
    }

    contact(req, res) {
        res.render('contact', { title: 'Contact' });
    }

    async postContact(req, res, next) {
        const message = req.body;
        message['ip'] =
            req.headers['x-real-ip'] || req.connection.remoteAddress;
        const contactMessage = new ContactMessage(message);
        try {
            await contactMessage.save();
            try {
                const mailContent = fs.readFileSync(
                    path.join(
                        `${__dirname}/../../resources/template/email/reply.html`,
                    ),
                );
                await mailer.sendMail(
                    contactMessage.email,
                    `Reply: ${contactMessage.subject}`,
                    mailContent,
                );
                console.log(
                    `Sent mail contact to ${contactMessage.email} success`,
                );
            } catch (error) {
                console.log(
                    `Sent mail contact to ${contactMessage.email} error`,
                );
                console.log(error);
            }
            res.send('Tin nhắn của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ bạn sớm nhất có thể');
        } catch (e) {
            res.send(
                'Hệ thống gặp lỗi trong quá trình ghi nhận tin nhắn của bạn. Vui lòng thử lại sau',
            );
        }
    }

    async postSubscribe(req, res, next) {
        const emailExp = /^[^\s()<>@,;:\/]+@\w[\w.-]+\.[a-z]{2,}$/i;
        const data = {
            ip: req.headers['x-real-ip'] || req.connection.remoteAddress,
            email: req.body.subscriberEmail,
        };
        if (emailExp.test(data.email)) {
            try {
                const subscriber = new Subscriber(data);
                const isSubscribe = await Subscriber.findOne({
                    email: data.email,
                });
                if (isSubscribe) {
                    res.send('Bạn đã đăng ký theo dõi thông tin từ trước');
                } else {
                    await subscriber.save();
                    try {
                        const mailContent = fs.readFileSync(
                            path.join(
                                `${__dirname}/../../resources/template/email/welcome.html`,
                            ),
                        );
                        await mailer.sendMail(
                            subscriber.email,
                            'Cảm ơn bạn đã đăng ký theo dõi',
                            mailContent,
                        );
                        console.log(
                            `Sent mail welcome to ${subscriber.email} success`,
                        );
                    } catch (error) {
                        console.log(
                            `Sent mail welcome to ${subscriber.email} error`,
                        );
                        console.log(error);
                    }
                    res.send('Đăng ký nhận tin thành công. Chúng tôi đã gửi email chào mừng tới bạn');
                }
            } catch (e) {
                res.send(
                    'Hệ thống gặp lỗi trong quá trình ghi nhận email của bạn. Vui lòng thử lại sau',
                );
            }
        } else {
            res.send('Địa chỉ email không hợp lệ');
        }
    }

    // for shorten link /go/:shortUrl
    async shorten(req, res, next) {
        const urlShorten = await UrlShorten.findOne({
            shortUrl: req.params.shortUrl,
        });
        if (urlShorten == null) {
            next(
                createError(
                    404,
                    'Liên kết rút gọn không đúng hoặc đã bị gỡ bỏ',
                ),
            );
        }

        urlShorten.clicks++;
        urlShorten.save();

        res.redirect(urlShorten.fullUrl);
    }

    // send file upload to client
    // for /${uploadStatic}/:type/:date/:fileName
    shareFile(req, res, next) {
        const {type, date, fileName} = req.params;
        res.sendFile(
            path.join(uploadDir, type, FileUtils.genFileName(fileName, date)),
            (err) => {
                if( err ) {
                    next(createError(404, 'Không tìm thấy file'));
                }
            }
        );
    }

    // GET /register
    getRegister(req, res, next) {
        res.render('register', {
            title: 'Đăng ký',
        });
    }

    // POST /register
    postRegister(req, res, next) {
        const { name, email, password, password2 } = req.body;
        let errors = [];

        if (!name || !email || !password || !password2) {
            errors.push({ msg: 'Vui lòng nhập đầy đủ thông tin' });
        }

        if (password !== password2) {
            errors.push({ msg: 'Xác nhận mật khẩu không đúng' });
        }

        if (password.length < 6) {
            errors.push({ msg: 'Mật khẩu ít nhất 6 kí tự' });
        }

        if (errors.length > 0) {
            res.render('register', {
                errors,
                name,
                email,
                password,
                password2,
                title: 'Lỗi',
            });
        } else {
            User.findOne({ email: email }).then((user) => {
                if (user) {
                    errors.push({ msg: 'Email đã được sử dụng' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2,
                        title: 'Lỗi',
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password,
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser
                                .save()
                                .then((user) => {
                                    req.flash(
                                        'success_msg',
                                        'Ban đã đăng ký thành công. Đăng nhập ngay',
                                    );
                                    res.redirect('/login');
                                })
                                .catch((err) => console.log(err));
                        });
                    });
                }
            });
        }
    }

    // GET /login
    getLogin(req, res, next) {
        res.render('login', {
            title: 'Đăng nhập',
        });
    }

    // POST /login
    postLogin(req, res, next) {
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true,
        })(req, res, next);
    }

    // GET /logout
    logout(req, res, next) {
        req.logout();
        req.flash('success_msg', 'Bạn đã đăng xuất');
        res.redirect('/login');
    }
}

module.exports = new SiteController();
