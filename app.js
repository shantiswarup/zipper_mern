var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db = require("./db");
var indexRouter = require('./routes/index');
var uploadRouter = require('./routes/upload');

var app = express();
global.__basedir = __dirname;
var env = process.env.NODE_ENV || 'dev';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//add a unique id to each request
app.use(function(req, res, next) {
  req.id = Date.now();
  next();
});

app.use('/', indexRouter);
app.use('/upload', uploadRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { message: err, status:  err.status || 500 } );
});
if (env == 'prod') {
  db.sequelize.sync();
} else if (env == 'dev') {
  db.sequelize.sync({ force: true }).then(() => {
    console.log("Drop and re-sync db.");
  });
}

module.exports = app;
