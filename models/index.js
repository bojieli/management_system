var mongoose = require('mongoose');
var config = require('../config');

mongoose.connectSet(config.db, function dberr(err){
  if(err){
    console.error('connect to %s error',config.db,err.message);
    process.exit(1);
  }
  console.log('Connected to mongodb via mongoose');
});


//different models
require('./order');
require('./service_staff');
require('./dispatch_center');
require('./wine');
require('./ship_staff');
require('./access_token');


exports.Order = mongoose.model('Order');
exports.ServiceStaff = mongoose.model('ServiceStaff');
//exports.ShipStaff = mongoose.model('ShipStaff');
exports.DispatchCenter = mongoose.model('DispatchCenter');
exports.Wine = mongoose.model('Wine');
exports.ShipStaff = mongoose.model('ShipStaff');
exports.AccessToken = mongoose.model('AccessToken');