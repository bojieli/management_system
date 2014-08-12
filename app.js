var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');
var config = require('./config');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var app = express();
global.orderID_increment = 0;
global.leftPadString = function (value,length){
  var valueString = value.toString();
  if(valueString.length >= length){
    return valueString.substr(0,length);
  }else{
    var pad = "";
    for(var i = 0;i < length - valueString.length; i++){
      pad = pad + "0";
    }
    return pad + valueString;
  }
}
global.formatDate = function(date){
  // return date.toString();
  return date.getFullYear() + '-' + leftPadString(date.getMonth() + 1,2) + '-'
  + leftPadString(date.getDay(),2) + '  ' + leftPadString(date.getHours(),2) + ':' 
  + leftPadString(date.getMinutes(), 2);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuration in session
app.use(require('cookie-parser')(config.session_secret));
app.use(session({
  secret: config.session_secret,
  cookie:{ maxAge:1800000 },
  key: 'sid',
  rolling:true,
  store: new MongoStore({
    db: config.db_name
  }),
  resave: true,
  saveUninitialized: true,
}));


routes(app);
app.listen(config.port);



/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {

        console.log('----------------error---------------------');
        console.log(err);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
