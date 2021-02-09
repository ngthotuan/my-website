const nodeMailer = require('nodemailer');
require('dotenv').config();

class Mailer {
    constructor(
        name = process.env.NO_REPLY_EMAIL_NAME,
        email = process.env.NO_REPLY_EMAIL,
        password = process.env.NO_REPLY_PASSWORD,
        host = process.env.EMAIL_HOST,
        port = process.env.EMAIL_PORT,
    ) {
        this._name = name;
        this._email = email;
        this._password = password;
        this._host = host;
        this._port = port;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get host() {
        return this._host;
    }

    set host(value) {
        this._host = value;
    }

    get port() {
        return this._port;
    }

    set port(value) {
        this._port = value;
    }

    get email() {
        return this._email;
    }

    set email(value) {
        this._email = value;
    }

    get password() {
        return this._password;
    }

    set password(value) {
        this._password = value;
    }

    sendMail = (to, subject, htmlContent) => {
        const transporter = nodeMailer.createTransport({
            host: this.host,
            port: this.port,
            secure: this.port === '465',
            tls: {
                rejectUnauthorized: false,
            },
            auth: {
                user: this.email,
                pass: this.password,
            },
        });
        const options = {
            from: `${this.name} <${this.email}>`,
            to: to,
            subject: subject,
            html: htmlContent,
        };
        return transporter.sendMail(options);
    };
}

module.exports = new Mailer();
