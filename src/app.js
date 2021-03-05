const createError = require('http-errors');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const moment = require('moment-timezone');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('cookie-session');
require('dotenv').config();
const app = express();

// Passport Config
require('./config/passport')(passport);
const route = require('./routes');
const db = require('./config/db');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//connect to db
db.connect().then().catch(createError);

app.use('/assets', express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressLayouts);
app.set('layout', './layouts/full-layout');
app.set('layout extractScripts', true); // for specific page script
// Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    }),
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use('/', (req, res, next) => {
    res.locals.moment = moment;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user;
    String.prototype.format = function (jsonFormat) {
        let formatted = this;
        for (let key in jsonFormat) {
            if (jsonFormat.hasOwnProperty(key)) {
                formatted = formatted.replace(
                    new RegExp(`{${key}}`, 'g'),
                    jsonFormat[key],
                );
            }
        }
        return formatted;
    };
    global.__basedir = path.resolve('.');
    next();
});

// Init route
route(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', { title: err.message });
});

module.exports = app;
