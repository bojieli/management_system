var async = require('async');
var Order = require('../proxy').Order;


exports.load =  function (req, res, next){
  var data = {};
    async.auto({
      _getnumberUnprocessed : function(callback){
        Order.getNumberbystatus(1, callback);
      },
      _getnumberQuestion : function(callback){
        Order.getNumberbystatus(21,callback);
      },
      _orders : function(callback){
        Order.findByStatus(req.session.user, 3, callback);
      } 
      },function(err, results){
        if(err){
          return next(err);
        }
        data.numberUnprocessed = results._getnumberUnprocessed;
        data.numberQuestion = results._getnumberQuestion;
        data.orders = results._orders;
        data.shiporders = shiporders;
        data.urgentprocess = [];
        data.urgentprocessed = [];
        res.render('unshipped',data);
      }
    )
}