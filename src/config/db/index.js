const mongoose = require('mongoose');
require('dotenv').config();

async function connect() {
    try {
        await mongoose.connect(
            `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true,
            },
        );
        console.log('Connected successfully!');
    } catch (e) {
        console.log('Connect to db failure!');
        console.log(e.message);
        console.log('......STOP APP.....');
        process.exit(1);
    }
}

module.exports = { connect };
