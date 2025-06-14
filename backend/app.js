require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose = require('mongoose');
//var mongoDB = process.env.MONGODB_URI;  // mongodb://127.0.0.1/vaja4
var mongoDB = "mongodb+srv://janmilosic:jadztuk2003@cluster0.hl0dmtd.mongodb.net/cocktailBox?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var usersRouter = require('./routes/userRoutes');
var drinkRoutes = require('./routes/drinkRoutes');
var cocktailRoutes = require('./routes/cocktailRoutes');
var notificationRoutes = require('./routes/notificationRoutes');
var faceidRoutes = require('./routes/faceidRoutes');
var paketnikRoutes = require('./routes/paketnikRoutes');

var app = express();

var cors = require('cors');
/* var allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
app.use(cors({
  credentials: true,
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin)===-1){
      var msg = "The CORS policy does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
})); */
var allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://10.0.2.2:3001'];

app.use(cors({
  credentials: true,
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin)===-1){
      return callback(new Error("CORS blocked for origin: " + origin), false);
    }
    return callback(null, true);
  }
}));

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json({ limit: '150mb' }));
app.use(express.urlencoded({ limit: '150mb', extended: true }));

var session = require('express-session');
var MongoStore = require('connect-mongo');
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({mongoUrl: mongoDB})
}));

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

app.use('/users', usersRouter);
app.use('/drinks', drinkRoutes);
app.use('/cocktails', cocktailRoutes);
app.use('/notifications', notificationRoutes);
app.use('/faceid', faceidRoutes);
app.use('/paketniki', paketnikRoutes);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
