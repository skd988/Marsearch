const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const indexRouter = require('./routes/index');
const userApiRouter = require('./routes/api/users_api');
const imageApiRouter = require('./routes/api/images_api');
const registerRouter = require('./routes/register');
const user_sequelize = require('./users_database')
const image_sequelize = require('./images_database')

user_sequelize.sync().then(()=>{ console.log("Connected to users database successfully")});
image_sequelize.sync().then(()=>{ console.log("Connected to images database successfully")});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//enable sessions
const secret = '2282343532';
app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: false,
  //cookie: {secure: true}
}))

app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/users/api', userApiRouter);
app.use('/images/api', imageApiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.error.message = err.message;
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

