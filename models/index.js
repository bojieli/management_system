var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.db,function dberr(err){
  if(err){
    console.error('connect to %s error',config.db,err.message);
    process.exit(1);
  }
});


//different models
require('./order');

exports.Order = mongoose.model('Order');