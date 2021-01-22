const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactMessage = new Schema(
    {
        ip: String,
        name: String,
        email: String,
        subject: String,
        message: String,
    },
    { timestamps: true },
);

module.exports = mongoose.model('ContactMessage', ContactMessage);
