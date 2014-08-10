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
      Order.getNumberbystatus(21,callback);
    },
    _getAllCenterInfo : function(callback){
      DispatchCenter.getAllCenterInfo(callback);
    },
    _wines : function(callback){
      Wine.findAllWines(callback);
    } 
    },function(err, results){
      if(err){
        console.log('---------shipped error---------------');
        console.log(err);
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

exports.createNewOrder = function (req, res, next){
  Order.createOrderbyCS (req.session.user, req.body, function(err, order){
    if(err)
      return next(err);
    //发送给快递
  })
}