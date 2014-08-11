var async = require('async');
var Order = require('../proxy').Order;
var ServiceStaff = require('../proxy').ServiceStaff;
var DispatchCenter = require('../proxy').DispatchCenter;
var Wine = require('../proxy').Wine;

exports.load = function(req,res,next){
  var data = {};
  async.auto({
    _getAllCenterInfo : function(callback){
      DispatchCenter.getAllCenterInfo(callback);
    },
    _order : function(callback){
      Order.findbyOrderID(req.body['orderID'], callback);
    },
    _generateOrder : ['_order', function(callback, results) {
      if(!results._order)
        return callback(null, null);
      Order.generateDetail(results._order, callback);
    }]
  },function(err, results){
    if(err){
      return next(err);
    }
    if(!results._order){
      data.emptyflag = true;
      return res.render('order_detail',data);
    }
    data.emptyflag = false;
    data.order = results._generateOrder ;
    data.alldispatches = results._getAllCenterInfo;
    res.render('order_detail',data);
  });
}