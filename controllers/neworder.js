var async = require('async');
var Order = require('../proxy').Order;
var Wine = require('../proxy').Wine;
var DispatchCenter = require('../proxy').DispatchCenter;
var config = require('../config');
var wechatAPI = require('../common/api');


exports.load = function (req, res, next){
  var data = {};
  async.auto({
    _getnumberUnprocessed : function(callback){
      Order.getNumberbystatus(1, callback);
    },
    _getnumberQuestion : function(callback){
      Order.getNumberInQuestion(req.session.user,callback);
    },
    _getAllCenterInfo : function(callback){
      DispatchCenter.getAllCenterInfo(callback);
    },
    _wines : function(callback){
      Wine.findAllWines(callback);
    }
    },function(err, results){
      if(err){
        return next(err);
      }
      data.wines = results._wines;
      data.numberUnprocessed = results._getnumberUnprocessed;
      data.numberQuestion = results._getnumberQuestion;
      data.urgentprocess = [];
      data.urgentprocessed = [];
      data.alldispatches = results._getAllCenterInfo;;
      res.render('neworder',data);
    }
  )
}
//
exports.createOrder = function(req,res,next){
  var data = req.body;
  var totalPrice = 0;
  for(var i = 0;i < data.shopOnce.length;i++){
    totalPrice = totalPrice + data.shopOnce[i].wechatPrice * data.shopOnce[i].number;
  }
  var orderinfo = {
    shopOnce : data.shopOnce,
    address : {
    province : "安徽省",
    city : "阜阳市",
    area : data.address.area,
    detail : data.address.detail,
    name : data.address.name,
    tel : data.address.tel
  },
  totalPrice : totalPrice,
  dispatchCenter : data.dispatchCenter,
  notes : data.notes
  };
  Order.createOrderbyCS(req.session.user,orderinfo,afterCreate);

  function afterCreate(err,order){
    if(err){
      res.send({code : 'error'});
      return next(err);
    }else{
      res.send({code : 'ok'});
      async.auto({
        _getCenterInfo : function(callback){
            DispatchCenter.getCenterByAddress(order.dispatchCenter,callback);
          },
        _addNumberToday : function(callback){
            DispatchCenter.addNumberToday(order.dispatchCenter,callback);
          },
        _generateOrder : function(callback) {
            Order.generateDetail(order, callback);
          }
      },function(err,results){
         if(err){
            res.send({code:'error'});
            return next(err);
          }
          var dispatchDetail = results._getCenterInfo;
          var orderDetail = results._generateOrder ;

          var message = "编号:" + orderDetail.orderID
                          + "\n时间：" + orderDetail.date
                          + "\n联系人：" + orderDetail.address.name
                          + "\n手机号：" + orderDetail.address.tel
                          + "\n详情：";

          for(var i = 0;i < orderDetail.shopOnce.length;i++){
            message = message + "\n"+orderDetail.shopOnce[i].describe + " * " + orderDetail.shopOnce[i].number;
          }
          var article = {
            "title" : dispatchDetail.orderNumToday,
            "description" : message,
            "url" : config.host_519+'/orderaction?orderID=' + orderDetail.orderID,
            "picurl" : ''
          }
          wechatAPI.sendNews(dispatchDetail.shipHeadID,[article],function(err, message){
            if(err){
              err.message = message;
              return next(err);
            }
          });
      });
    }
  }
}