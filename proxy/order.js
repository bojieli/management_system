var congfig = require('../config');
var errUtil = require('./wrap_error');
var models = require('../models');
var Order = models.Order;
var async = require('async');
var Wine = require('./wine');
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

exports.createOrderbyCS = function(customerService,info,cb){
  var orderID = getOrderID();
  var order = {};
  order = {
        orderID : orderID,
        openID : 'createdByCS',
        shopOnce : info.shopOnce,
        address : info.address,
        cashUse : 0,
        voucherUse : 0,
        status : 3,
        isFirst : false,
        totalPrice : info.totalPrice,
        customerService : customerService,
        dispatchCenter : info.dispatchCenter,
        notes : info.notes
      };
  Order.create(order, afterCreate);
  function afterCreate(err,order){
      if(err){
        errUtil.wrapError(err,congfig.errorCode_create,"createOrder()","/proxy/order",{req:req});
        return cb(err);
      }else{
        cb(err);
      }
    }
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
        {$set:{'status' : 2, 'customerService' : customerService}},
        function(err){
          if(err)
            return cb(err);
          cb(null,order[0]);
        });

    });
  }
}

exports.setStatus = function (orderID, status, cb){
  Order.update({'orderID' : orderID},{$set:{'status' : status}}, cb);
}

exports.setNotes = function(orderID , notes, cb){
  Order.update({'orderID' : orderID},{$set:{'notes' : notes}}, cb);
}

exports.setDispatchCenter = function(orderID, dispatchCenter, cb){
  Order.update({'orderID' : orderID},{$set:{'dispatchCenter' : dispatchCenter}}, cb);
}

exports.setShipStaff = function(orderID, shipStaff, cb){
  Order.update({'orderID' : orderID},{$set:{'shipStaff' : shipStaff}}, cb);
}
exports.setCustomerService = function(orderID, customerService, cb){
  Order.update({'orderID' : orderID},{$set:{'customerService' : customerService}}, cb);
}

exports.setShipDate = function(orderID, cb){
  Order.update({'orderID' : orderID},{$set:{'shipDate' : new Date()}}, cb);
}
exports.setReceiveDate = function(orderID, cb){
  Order.update({'orderID' : orderID},{$set:{'receiveDate' : new Date()}}, cb);
}

exports.findbyOrderID = function(orderID, cb){
  Order.findOne({'orderID' : orderID},cb);
}

exports.findbyTel = function(tel, cb){
 Order.find({'address.tel' : tel},
    'orderID date shipDate receiveDate dispatchCenter status', function(err, orders){
      if(err)
        return cb(err);
      var _orders = [];
      for (var i = 0; i < orders.length; i++) {
        var data = {};
        data.date = formatDate(orders[i].date);
        data.shipDate = formatDate(orders[i].shipDate);
        data.receiveDate = formatDate(orders[i].receiveDate);
        data.dispatchCenter = orders[i].dispatchCenter||'';
        data.orderID = orders[i].orderID;
        data.status = orders[i].status;
        _orders.push(data);
      };
      _orders.reverse();
      cb(null, _orders);
    })
}

exports.getNumberInQuestion = function(customerService,cb){
  Order.find({'status' : {$in: [21, 41]}, 'customerService' : customerService},
    {'_id' : 1}, function(err, orders){
    if(err) return cb(err);
    cb(null, orders.length);
  });
}
exports.findByStatus = function (customerService, status, cb){
  Order.find({'status' : status, 'customerService' : customerService},
    'orderID date shipDate receiveDate dispatchCenter status', function(err, orders){
      if(err)
        return cb(err);
      var _orders = [];
      for (var i = 0; i < orders.length; i++) {
        var data = {};
        data.date = formatDate(orders[i].date);
        data.shipDate = formatDate(orders[i].shipDate);
        data.receiveDate = formatDate(orders[i].receiveDate);
        data.dispatchCenter = orders[i].dispatchCenter||'';
        data.orderID = orders[i].orderID;
        data.status = orders[i].status;
        _orders.push(data);
      };
      _orders.reverse();
      //console.log(JSON.stringify(orders));
      cb(null, _orders);
    })
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

exports.generateDetail = function (order, cb){
  var data = {};
  var ids = [];
  for (var i = 0; i < order.shopOnce.length; i++) {
    ids.push(order.shopOnce[i].id);
  };
  Wine.findByIDs(ids, afterFind);
  function afterFind(err, _wines){
    if(err)
      return cb(err);
    //var _wines = results._findWineByIDs;
    for (var i = 0; i < order.shopOnce.length; i++) {
      var index = findWinebyid(order.shopOnce[i].id);
      order.shopOnce[i].describe = _wines[index].describe;
      order.shopOnce[i].wechatPrice = _wines[index].wechatPrice;
      delete order.shopOnce[i].id;
    };
    function findWinebyid(id){
      for (var i = 0; i < _wines.length; i++) {
        if(id ==_wines[i].id)
          return i;
      };
    }
    data.orderID = order.orderID;
    data.status = order.status;
    data.date = formatDate(order.date);
    data.shipDate = formatDate(order.shipDate);
    data.receiveDate = formatDate(order.receiveDate);
    data.isFirst = order.isFirst;
    data.address = order.address;
    data.notes = order.notes||'';
    data.cashNeeded = order.totalPrice;
    data.cashTotal = order.cashUse + order.voucherUse + order.totalPrice;
    data.coupon = order.cashUse;
    data.voucher = order.voucherUse;
    data.shopOnce = order.shopOnce;
    data.dispatchCenter = order.dispatchCenter;
    data.shipStaff = order.shipStaff;
    data.customerService = order.customerService;
    cb(null, data);
  }
}

exports.orderDelete = function(orderID, notes, cb){
  Order.update({orderID : orderID},{$set : {'status' : 42}}, cb);
}

//exports.findAbstract(orders, cb)

exports.unprocessedOperate = function(postData,cb){
  var statusAfter;
  switch(postData.method){
    case 'confirm' :
      statusAfter = 3;
      break;
    case 'delete' :
      statusAfter = 22;
      break;
    case 'wait' :
      statusAfter = 21;
      break;
  }
  if(postData.modifyinfo){
    console.log('begin update');
    var modifydata = postData.modifyinfo;
    postData.modifyinfo.status = statusAfter;
    Order.update({orderID : postData.orderID},{$set :{
      status : statusAfter,
      dispatchCenter: modifydata.dispatchCenter,
      notes : modifydata.notes,
      'address.area' : modifydata.address.area,
      'address.detail' : modifydata.address.detail,
      'address.name' : modifydata.address.name,
      'address.tel' : modifydata.address.tel
    }},afterUpdate);
  }else{
    Order.update({orderID : postData.orderID},{$set:{status:statusAfter}},afterUpdate);
  }

  function afterUpdate(err,order){
     if(err){
        errUtil.wrapError(err,congfig.errorCode_update,"unprocessedOperate()","/proxy/order",{postData:postData});
        return cb(err);
      }
      return cb(err);
  }

}




function getOrderID(){
  var date = new Date();

  var orderID_increment1 = ++ global.orderID_increment;
  if(global.orderID_increment > 9990)
    global.orderID_increment = 0;

  var datePart = '4' +
                    leftPadString(date.getUTCMonth() + 1,2) +
                    leftPadString(date.getUTCDate(),2) +
                    leftPadString(date.getUTCHours(),2) +
                    leftPadString(date.getUTCMinutes(),2) +
                    leftPadString(date.getUTCSeconds(),2) +
                    leftPadString(orderID_increment1,4)
  return 'k' + datePart;
}