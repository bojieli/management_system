var congfig = require('../config');
var models = require('../models');
var Order = models.Order;
var DispatchCenter = models.DispatchCenter;
var ShipStaff = models.ShipStaff;
var async = require('async');
var Wine = require('./wine');
var config = require('../config');

exports.createOrderbyCS = function(customerService,info,cb){
  var orderID = getOrderID();
  var order = {};
  async.auto({
    _getWineInfo : function(callback){
      var ids = [];
      for (var i = 0; i < info.shopOnce.length; i++) {
        ids.push(info.shopOnce[i].id);
      };
      Wine.findByIDs(ids,callback);
    },
    _createorder :["_getWineInfo", function(callback,results){
      var wines = results._getWineInfo;

      for (var i = 0; i < info.shopOnce.length; i++) {
        var index = findWinebyid(info.shopOnce[i].id);
        info.shopOnce[i].describe = wines[index].describe;
        info.shopOnce[i].wechatPrice = wines[index].wechatPrice;
        info.shopOnce[i].littlePic = config.small_dir + wines[index].littlePic;
      }

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
      Order.create(order, callback);

      function findWinebyid(id){
        for (var i = 0; i < wines.length; i++) {
          if(id == wines[i].id)
            return i;
        }
      }
    }]},
    function (err,results){
      if(err){
        return cb(err);
      }
      cb(null,results._createorder);
    });
}
//1、查找status = 2，如果有直接返回
//2、查找status = 1, 并且放置customerService
exports.findOneUnprocessOrder = function (customerService, cb){
  Order.findOne({'status' : 2, 'customerService' : customerService}, function(err, order){
    if(err){
      return cb(err);
    }
    if(order){
      return cb(null, order);
    }
    findStatus1();
  });


  function findStatus1(){

    Order.find({'status' : 1},null,{sort : { date: 1}, limit : 1},function(err, order){
        if(err){
          return cb(err);
        }
      if(order.length == 0)
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
 Order.find({'address.tel' : tel},null,{sort:{date : -1}},function(err, orders){
      if(err)
        return cb(err);
      var _orders = [];
      for (var i = 0; i < orders.length; i++) {
        var data = {};
        data.date = formatDate(orders[i].date);
        data.shipDate = formatDate(orders[i].shipDate);
        data.receiveDate = formatDate(orders[i].receiveDate);
        data.dispatchCenter = orders[i].dispatchCenter;
        data.orderID = orders[i].orderID;
        data.status = orders[i].status;
        _orders.push(data);
      }
      cb(null, _orders);
  });
}

exports.getNumberInQuestion = function(customerService,cb){
  Order.find({'status' : {$in: [21, 41]}, 'customerService' : customerService},
    {'_id' : 1}, function(err, orders){

    if(err)
      return cb(err);

    cb(null, orders.length);
  });
}

exports.findByStatus = function (customerService, status, cb){
  Order.find({'status' : status, 'customerService' : customerService},
    null, function(err, orders){
      if(err)
        return cb(err);
      var _orders = [];
      for (var i = 0; i < orders.length; i++) {
        var data = {};
        data.date = formatDate(orders[i].date);
        data.shipDate = formatDate(orders[i].shipDate);
        data.receiveDate = formatDate(orders[i].receiveDate);
        data.dispatchCenter = orders[i].dispatchCenter;
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
  data.orderID = order.orderID;
  data.status = order.status;
  data.date = formatDate(order.date);
  data.shipDate = formatDate(order.shipDate);
  data.receiveDate = formatDate(order.receiveDate);
  data.isFirst = order.isFirst;
  data.address = order.address;
  data.notes = order.notes;
  data.cashNeeded = order.totalPrice;
  data.cashTotal = order.cashUse + order.voucherUse + order.totalPrice;
  data.coupon = order.cashUse;
  data.voucher = order.voucherUse;
  data.shopOnce = order.shopOnce;
  data.dispatchCenter = order.dispatchCenter;
  data.customerService = order.customerService;
  ShipStaff.findOne({openID : order.shipStaff},function(err,ship_staff){
    if(err){
      return cb(err);
    }
    data.shipStaff = ship_staff;
    cb(null, data);  
  });
  
}


exports.orderDelete = function(orderID, notes, cb){
  Order.update({orderID : orderID},{$set : {'status' : 42,notes : notes}}, cb);
}

//exports.findAbstract(orders, cb)

exports.unprocessedOperate = function(postData,customerservice,cb){
  var statusAfter;
  switch(postData.method){
    case 'confirm' :
    case 'wait' :
      if(postData.method == 'confirm'){
        statusAfter = 3;
      }else{
        statusAfter = 21;
      }
      var modifydata = postData.modifyinfo;
      Order.update({orderID : postData.orderID},{$set :{
        status : statusAfter,
        customerService : customerservice,
        dispatchCenter: modifydata.dispatchCenter,
        notes : modifydata.notes,
        'address.area' : modifydata.address.area,
        'address.detail' : modifydata.address.detail,
        'address.name' : modifydata.address.name,
        'address.tel' : modifydata.address.tel
        }},afterUpdate);
      break;
    case 'delete' :
      statusAfter = 22;
      var modifydata = postData.modifyinfo;
      Order.update({orderID : postData.orderID},{$set :{
        status : statusAfter,
        customerService : customerservice,
        notes : modifydata.notes
        }},afterUpdate);
      break;

  }

  function afterUpdate(err){
     if(err){
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