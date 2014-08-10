var async = require('async');
var Order = require('../proxy').Order;
var ServiceStaff = require('../proxy').ServiceStaff;
var DispatchCenter = require('../proxy').DispatchCenter;
var Wine = require('../proxy').Wine;


exports.load = function (req, res, next){
   var data = {};
    async.auto({
      _getnumberUnprocessed : function(callback){
        Order.getNumberbystatus(1, callback);
      },
      _getnumberQuestion : function(callback){
        Order.getNumberbystatus(21,callback);
      }
      },function(err, results){
        if(err){
          console.log('---------shipped error---------------');
          console.log(err);
          return next(err);
        }
        data.numberUnprocessed = results._getnumberUnprocessed;
        data.numberQuestion = results._getnumberQuestion;
        data.urgentprocess = [];
        data.urgentprocessed = [];
        res.render('search',data);
      }
    )
}

exports.searchOrder = function(req, res, next){
  var order = {};
  var data = {};
  var rcv_data = req.body;
  console.log('-----------------');
  console.log(rcv_data);
  if(rcv_data.searchmethod == 'orderid'){
    async.auto({
      _order : function(callback){
        Order.findbyOrderID(rcv_data.inputnumber, callback);
      },
      _getAllCenterInfo : function(callback){
        DispatchCenter.getAllCenterInfo(callback);
      },
      _findWineByIDs : ['_order', function(callback, results) {
        order = results._order;
        if(!order)
          return callback(null, null);
        var ids = [];
        for (var i = 0; i < order.shopOnce.length; i++) {
          ids.push(order.shopOnce[i].id);
        };
        Wine.findByIDs(ids, callback);
      }],
      _changeShopOnce : ['_findWineByIDs', function(callback, results){
        if(!order)
          return callback(null, order);
        var _wines = results._findWineByIDs;
        for (var i = 0; i < order.shopOnce.length; i++) {
          var index = findWinebyid(order.shopOnce[i].id);
          order.shopOnce[i].describe = _wines[index].describe;
          order.shopOnce[i].wechatPrice = _wines[index].wechatPrice;
          delete order.shopOnce[i].id;
        };
        callback();

        function findWinebyid(id){
          for (var i = 0; i < _wines.length; i++) {
            if(id ==_wines[i].id)
              return i;
          };
        }
      }]
    },function(err, results){
      if(err){
        console.log('---------unprocessed error---------------');
        console.log(err);
        return next(err);
      }

      if(!order){
        //data.emptyflag = true;
        return res.render('unprocessed',data);
      }
      data.orderID = order.orderID;
      data.status = order.status;

      var date = {
        year : order.date.getUTCFullYear(),
        month : order.date.getUTCMonth() + 1,
        day : order.date.getUTCDate(),
        hour : order.date.getUTCHours(),
        minute : order.date.getUTCMinutes()
      }
      data.date = date;

      var shipDate = {
        year : order.shipDate.getUTCFullYear(),
        month : order.shipDate.getUTCMonth() + 1,
        day : order.shipDate.getUTCDate(),
        hour : order.shipDate.getUTCHours(),
        minute : order.shipDate.getUTCMinutes()
      }
      data.shipDate = shipDate;

      var receiveDate = {
        year : order.receiveDate.getUTCFullYear(),
        month : order.receiveDate.getUTCMonth() + 1,
        day : order.receiveDate.getUTCDate(),
        hour : order.receiveDate.getUTCHours(),
        minute : order.receiveDate.getUTCMinutes()
      }
      data.receiveDate = receiveDate;

      data.isFirst = order.isFirst;
      data.address = order.address;
      data.notes = order.notes||'';
      data.cashNeeded = order.totalPrice;
      data.cashTotal = order.cashUse + order.voucherUse + order.totalPrice;
      data.coupon = order.cashUse;
      data.voucher = order.voucherUse;
      data.shopOnce = order.shopOnce;
      var alldispatches = [];
      for (var i = 0; i < results._getAllCenterInfo.length; i++) {
        alldispatches.push(results._getAllCenterInfo[i].address);
      };
      data.alldispatches = alldispatches
      console.log('---------------data-----------------');
      console.log(JSON.stringify(data));
      res.render('unprocessed',data);
    });

  }
}