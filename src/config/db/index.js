const mongoose = require('mongoose');
require('dotenv').config();

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

const getConnectionString = () => {
    return `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;
};

const connect = async () => {
    const messageId = setInterval(() => {
        console.log('Connecting to database...');
    }, 1000);
    try {
        await mongoose.connect(getConnectionString(), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
            serverSelectionTimeoutMS: 5000,
        });
        clearInterval(messageId);
        console.log('Connected database successfully!');
    } catch (e) {
        clearInterval(messageId);
        console.log(`Connect to database failure! Message: ${e.message}`);
    }
};

module.exports = { connect };
