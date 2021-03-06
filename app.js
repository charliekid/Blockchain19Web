var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// used for persistent log in
const session = require('express-session');
var crypto = require('crypto');
var authToken = {};
// for database
const mysql = require('mysql');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var dashboardRouter = require('./routes/dashboard');
var registrationRouter = require('./routes/registration');
var vaccineRegister = require('./routes/vaccineRegister');
var clinicAdmin = require('./routes/clinicAdmin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// enable session
app.use(session({
  //TODO need to figure out a better way to do this
  secret: '6wOBwJBStY',
}))

// making a db connection
const db = mysql.createConnection({
  host: 'klbcedmmqp7w17ik.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user: 'oumsisc1xcz8mi47',
  password: 'q27tr9h1q8kkedv4',
  database: 'slm3dzqcniu3ap83'
});
// connect to database and make it global so we can access it anywhere
db.connect((err) => {
  if (err) {
    console.log('error has occurred');
    throw err;
  }
  console.log('Connected to database');
});
global.db = db;


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/dashboard', dashboardRouter);
app.use('/registration',registrationRouter);
app.use('/vaccineRegister', vaccineRegister);
app.use('/clinicAdmin', clinicAdmin);
//app.use('/dashboards/clinic-dashboard', dashboardRouter);
//app.use('/dashboards/patient-dashboard', dashboardRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
