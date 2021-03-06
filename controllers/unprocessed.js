var async = require('async');
var Order = require('../proxy').Order;
var ServiceStaff = require('../proxy').ServiceStaff;
var DispatchCenter = require('../proxy').DispatchCenter;
var Wine = require('../proxy').Wine;
var config = require('../config');
var wechatAPI = require('../common/api');
var config = require('../config');

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
        Order.findOneUnprocessOrder(req.session.user, callback);
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
  Order.unprocessedOperate(postData,req.session.user,function(err){
    if(err){
      res.send({code:'error'});
      return next(err);
    }
    //????????????????????????????????????????????????????????????????????????????????????
    if(postData.method == 'confirm' || postData.method == 'delete'){
        async.auto({
          _getCenterInfo : function(callback){
            DispatchCenter.getCenterByAddress(postData.modifyinfo.dispatchCenter,callback);
          },
          _order : function(callback){
            Order.findbyOrderID(postData.orderID, callback);
          },
          _addNumberToday : function(callback){
            DispatchCenter.addNumberToday(postData.modifyinfo.dispatchCenter,callback);
          },
          _generateOrder : ['_order', function(callback, results) {
            if(!results._order)
              return callback(null, {});
            Order.generateDetail(results._order, callback);
          }]
        },function(err, results){
          if(err){
            res.send({code:'error'});
            return next(err);
          }
          if(!results._order){
            return next({"notfound": "orderfinderror"});
          }

          var orderDetail = results._generateOrder ;

          if(postData.method == 'confirm'){
            var dispatchDetail = results._getCenterInfo;
            var message = "??????:" + orderDetail.orderID
                          + "\n?????????" + orderDetail.date
                          + "\n????????????" + orderDetail.address.name
                          + "\n????????????" + orderDetail.address.tel
                          + "\n?????????";

            for(var i = 0;i < orderDetail.shopOnce.length;i++){
              message = message + "\n"+orderDetail.shopOnce[i].describe + " * " + orderDetail.shopOnce[i].number;
            }
            var article = {
              "title" : dispatchDetail.orderNumToday,
              "description" : message,
              "url" : config.host_519+"/orderaction?orderID=" + orderDetail.orderID,
              "picurl" : ''
            }
            wechatAPI.sendNews(dispatchDetail.shipHeadID,[article],function(err, message){
              if(err){
                err.message = message;
                return next(err);
              }
            });
          }else{
            var openID = results._order.openID;
            var deletereason = results._order.notes;
            var message = "??????:" + orderDetail.orderID
                          + "\n?????????" + orderDetail.date
                          + "\n????????????" + orderDetail.address.name
                          + "\n????????????" + orderDetail.address.tel
                          + "\n?????????";
            for(var i = 0;i < orderDetail.shopOnce.length;i++){
              message = message + "\n"+orderDetail.shopOnce[i].describe + " * " + orderDetail.shopOnce[i].number;
            }

            message = message + "??????????????????????????????,????????????,?????????????????????:\n" + deletereason;
            var article = {
              "title" : "???????????????",
              "description" : message,
              "url" : "",
              "picurl" : ''
            }

            wechatAPI.sendNews(openID,[article],function(err, message){
              if(err){
                err.message = message;
                return next(err);
              }
            });
          }

        });

    }
    res.send({code:'ok'});});
}