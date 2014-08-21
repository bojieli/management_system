var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.db, function dberr(err){
  if(err){
    console.error('connect to %s error',config.db,err.message);
    process.exit(1);
  }
  console.log('Connected to mongodb via mongoose');
});


//different models

require('./wine');
require('./order');
require('./service_staff');
require('./access_token');
require('./dispatch_center');
require('./ship_staff');


exports.Wine = mongoose.model('Wine');
exports.Order = mongoose.model('Order');
exports.ServiceStaff = mongoose.model('ServiceStaff');
exports.AccessToken = mongoose.model(config.accessToken);
exports.DispatchCenter = mongoose.model('DispatchCenter');
exports.ShipStaff = mongoose.model('ShipStaff');
