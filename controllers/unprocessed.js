var async = require('async');
var Order = require('../proxy').Order;
var ServiceStaff = require('../proxy').ServiceStaff;
var DispatchCenter = require('../proxy').DispatchCenter;
var Wine = require('../proxy').Wine;
var wechatAPI = require('../common/api');

exports.load = function(req,res,next){

    var data = {};
    async.auto({
      _getnumberUnprocessed : function(callback){
        Order.getNumberbystatus(1, callback);
      },
      _getnumberQuestion : function(callback){
        Order.getNumberInQuestion(req.session.user,callback);
      },
      _getnumberProcessedToday : function(callback){
        ServiceStaff.getOrderNumberToday(req.session.user, callback);
      },
      _getAllCenterInfo : function(callback){
        DispatchCenter.getAllCenterInfo(callback);
      },
      _order : function(callback){
        Order.findOneOrder(req.session.user, callback);
      },
      _generateOrder : ['_order', function(callback, results) {
        if(!results._order)
          return callback(null,{});
        Order.generateDetail(results._order, callback);
      }]
    },function(err, results){
      if(err){
        return next(err);
      }
      // data = results._generateOrder;
      data.numberUnprocessed = results._getnumberUnprocessed;
      data.numberProcessedToday = results._getnumberProcessedToday;
      data.numberQuestion = results._getnumberQuestion;
      data.urgentprocess = [];
      data.urgentprocessed = [];
      if(!results._order){
        data.emptyflag = true;
        return res.render('unprocessed',data);
      }
      data.emptyflag = false;
      data.order = results._generateOrder ;
      data.alldispatches = results._getAllCenterInfo;

      res.render('unprocessed',data);
    });
}

exports.unprocessedOperate = function(req,res,next) {
  var postData = req.body;
  Order.unprocessedOperate(postData,function(err){
    if(err){
      res.send({code:'error'});
      return next(err);
    }

    if(postData.method == 'confirm'){
        async.auto({
          _getCenterInfo : function(callback){
            DispatchCenter.getCenterByAddress(postData.modifyinfo.dispatchCenter,callback);
          },
          _order : function(callback){
            Order.findbyOrderID(postData.orderID, callback);
          },
          _generateOrder : ['_order', function(callback, results) {
            if(!results._order)
              return callback(null, {});
            Order.generateDetail(results._order, callback);
          }]
        },function(err, results){
          if(err){
            return next(err);
          }
          if(!results._order){
            return next({"notfound": "orderfinderror"});
          }

          var orderDetail = results._generateOrder ;
          var dispatchDetail = results._getCenterInfo;
          var message = "订单编号：\n" + orderDetail.orderID
                        + "\n订单时间\：" + orderDetail.date
                        + "\n联系人：" + orderDetail.address.name
                        + "\n联系方式：\n" + orderDetail.address.tel
                        + "\n订单详情：";
          for(var i = 0;i < orderDetail.shopOnce.length;i++){
            message = message + "\n\t"+orderDetail.shopOnce[i].describe + "\t,数量：" + orderDetail.shopOnce[i].number;
          }
          wechatAPI.sendText(dispatchDetail.shipHeadID,message,function(err, message){
            if(err){
              err.message = message;
              next(err);
            }
          });
        });

      }
    res.send({code:'ok'});});
}