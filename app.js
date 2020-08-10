const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const indexRouter = require('./backend/routes');
const users = require('./backend/routes/api/users');
const signup = require('./backend/routes/api/user');
const messages = require('./backend/routes/api/messages');

const app = express();

// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, 'backend/build')));
//
//     app.get('/', (req, res) => {
//         res.sendFile(path.join(__dirname, 'backend/build', 'index.html'));
//     });
// }

// view engine setup
app.set('views', path.join(__dirname, 'backend/views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(fileUpload());
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/xwww-
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'backend/public')));
app.use(passport.initialize());
require('./backend/config/passport')(passport);

app.use('/', indexRouter);
app.use('/api/users', users);
app.use('/api/user', signup);
app.use('/api/messages', messages);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
