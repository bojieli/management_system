var async = require('async');
var Order = require('../proxy').Order;
var Wine = require('../proxy').Wine;
var DispatchCenter = require('../proxy').DispatchCenter;



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
      var alldispatches = [];
      for (var i = 0; i < results._getAllCenterInfo.length; i++) {
        alldispatches.push(results._getAllCenterInfo[i].address);
      };
      data.alldispatches = alldispatches;
      res.render('neworder',data);
    }
  )
}
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
  }
  Order.createOrderbyCS(req.session.user,orderinfo,function(err){
    if(err){
      res.send({code : 'error'});
      return next(err);
    }else{
      res.send({code : 'ok'});
    }
  });
}