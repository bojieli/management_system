var async = require('async');
var Order = require('../proxy').Order;
var DispatchCenter = require('../proxy').DispatchCenter;



exports.load = function(req, res, next){
  var data = {};
  async.auto({
    _getnumberUnprocessed : function(callback){
      Order.getNumberbystatus(1, callback);
    },
    _getnumberQuestion : function(callback){
     Order.getNumberInQuestion(req.session.user,callback);
    },
    _orders : function(callback){
      Order.findByStatus(req.session.user, 4, callback);
    } 
    },function(err, results){
      if(err){
        console.log(err);
        return next(err);
      }
      data.numberUnprocessed = results._getnumberUnprocessed;
      data.numberQuestion = results._getnumberQuestion;
      data.orders = results._orders;
      console.log('-------------orders----------------');
      console.log(JSON.stringify(data.orders));
      data.urgentprocess = [];
      data.urgentprocessed = [];
      res.render('shipped',data);
    }
  )
}