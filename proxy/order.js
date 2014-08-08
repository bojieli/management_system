var congfig = require('../config');
var errUtil = require('./wrap_error');
var models = require('../models');
var Order = models.Order;
var async = require('async');
var Wine = require('../proxy').Wine;
var config = require('../config');


/**用户提交订单以后保存订单信息
* Callback:
* - err
* - order:
* req:传入的订单参数
*/

exports.createOrder = function(openID,info,cb){
  var orderID = getOrderID();
  var order = {};
  async.waterfall([
    function _isFirst (callback){
      Order.findOne({'address.tel' : info.address.tel}, callback);
    },
    function createorder(order, callback){
      var isFirst;
      if(order)
        isFirst = false;
      else
        isFirst = true;
      order = {
        orderID : orderID,
        openID : openID,
        shopOnce : info.shopOnce,
        address : info.address,
        cashUse : info.cashUse || 0,
        voucherUse : info.voucherUse || 0,
        status : 1,
        isFirst : isFirst,
        totalPrice : info.totalPrice,
      };
      Order.create(order, callback);
    }],
    function afterCreate(err,order){
      if(err){
        errUtil.wrapError(err,congfig.errorCode_create,"createOrder()","/proxy/order",{req:req});
        return cb(err);
      }else{
        cb(err,order);
      }
    }
  );
}
//1、查找status = 2，如果有直接返回
//2、查找status = 1, 并且放置customerService
exports.findOneOrder = function (customerService, cb){
  Order.findOne({'status' : 2, 'customerService' : customerService}, function(err, order){
    if(order){
      return cb(null, order);
    }
    findStatus1();
    
  });


  function findStatus1(){

    Order.find({'status' : 1},null,{sort : { date: 1}, limit : 1},function(err, order){
      if(order.length==0)
        return cb(null,null);
      Order.update({'orderID' : order[0].orderID},
        {'status' : 2, 'customerService' : customerService},
        function(err){
          if(err)
            return cb(err);
          cb(null,order[0]);
        });
      
    });
  }
}

exports.setStatus = function (orderID, status, cb){
  Order.update({'orderID' : orderID},{'status' : status}, cb);
}

exports.setNotes = function(orderID , notes, cb){
  Order.update({'orderID' : orderID},{'notes' : notes}, cb);
}

exports.setDispatchCenter = function(orderID, dispatchCenter, cb){
  Order.update({'orderID' : orderID},{'dispatchCenter' : dispatchCenter}, cb);
}

exports.setShipStaff = function(orderID, shipStaff, cb){
  Order.update({'orderID' : orderID},{'shipStaff' : shipStaff}, cb);
}
exports.setCustomerService = function(orderID, customerService, cb){
  Order.update({'orderID' : orderID},{'customerService' : customerService}, cb);
}

exports.setShipDate = function(orderID, cb){
  Order.update({'orderID' : orderID},{'shipDate' : new Date()}, cb);
}
exports.setReceiveDate = function(orderID, cb){
  Order.update({'orderID' : orderID},{'receiveDate' : new Date()}, cb);
}

exports.findbyOrderID = function(orderID, cb){
  Order.find({'orderID' : orderID},cb);
}

exports.getNumberbystatus = function(status, cb){
  Order.find({'status' : status},{'_id' : 1}, function(err, orders){
    if(err) return cb(err);
    cb(null, orders.length);
  });
}
exports.findUnshipped = function (cb){
  Order.find({'status' : 3},'orderID date dispatchCenter', cb);
}



function leftPadString(value,length){
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


function getOrderID(){
  var date = new Date();

  var orderID_increment1 = ++ global.orderID_increment;
  if(global.orderID_increment > 9990)
    global.orderID_increment = 0;

  var datePart = leftPadString(date.getUTCFullYear().toString(),1) +
                    leftPadString(date.getUTCMonth() + 1,2) +
                    leftPadString(date.getUTCDate(),2) +
                    leftPadString(date.getUTCHours(),2) +
                    leftPadString(date.getUTCMinutes(),2) +
                    leftPadString(date.getUTCSeconds(),2) +
                    leftPadString(orderID_increment1,4)
  return 'f' + datePart;
}