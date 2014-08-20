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

var bunyan = require("bunyan");
var errlog = bunyan.createLogger({
  name : "kf-519-today",
  level : "error",
  path : '../log/error-management.log'
});


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

var MongoClient = require('mongodb').MongoClient;
MongoClient.connect(config.db_native, function(err, session_store) {
  if (err) {
     console.error('Failed to connect to mongodb for session store');
     return;
  }
  console.log('Connected to mongodb session store');

  app.use(session({
    secret: config.session_secret,
    key: 'sid',
    store: new MongoStore({ db: session_store }),
    resave: true,
    rolling: true,
    saveUninitialized: true,
  }));

  /// we should initialize the session store before declaring routes
  routes(app);

  /// catch 404 and forward to error handler
  /// this should be executed after any other app.use() as this is a catch-all fallback
  app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
  });

  /// listen after everything is ready...
  /// do not expose inconsistent startup states to user
  app.listen(config.port, function (err) {
    console.log("kf listening on port %d", config.port);
    console.log("God bless love....");
    //throw new Error('dgjalsjgldjslgasljgldsjgldasj');
    //test.test();
  });
});

require('./proxy/setinteral')();//每天定时更新数据库数据
/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      console.log(err);
      console.log(err.stack);
      errlog.error(err);
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
