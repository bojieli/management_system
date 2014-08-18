var async = require('async');
var Order = require('../proxy').Order;

exports.load =  function (req, res, next){
   var data = {};
    async.auto({
      _getnumberUnprocessed : function(callback){
        Order.getNumberbystatus(1, callback);
      },
      _getnumberQuestion : function(callback){
        Order.getNumberInQuestion(req.session.user,callback);
      },
      _orders : function(callback){
        Order.findByStatus(req.session.user, 21, callback);
      },
      _orders4 : function(callback){
        Order.findByStatus(req.session.user, 41, callback);
      }
      },function(err, results){
        if(err){
          return next(err);
        }
        data.numberUnprocessed = results._getnumberUnprocessed;
        data.numberQuestion = results._getnumberQuestion;
        var questionorders = [];

        data.orders = results._orders.concat(results._orders4);
        data.urgentprocess = [];
        data.urgentprocessed = [];
        res.render('questionorder',data);
      }
    )
}