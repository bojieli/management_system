var async = require('async');
var Order = require('../proxy').Order;


exports.load = function (req, res, next){
   var data = {};
    async.auto({
      _getnumberUnprocessed : function(callback){
        Order.getNumberbystatus(1, callback);
      },
      _getnumberQuestion : function(callback){
        Order.getNumberbystatus(21,callback);
      },
      _orders : function(callback){
        Order.findOrdersInReceived(req.session.user, callback);
      }
      },function(err, results){
        if(err){
          console.log('---------shipped error---------------');
          console.log(err);
          return next(err);
        }
        data.numberUnprocessed = results._getnumberUnprocessed;
        data.numberQuestion = results._getnumberQuestion;
        var receiveorders = [];
        for (var i = 0; i < results._orders.length; i++) {
          var receiveorder = {};
          receiveorder.orderID = results._orders[i].orderID;
          receiveorder.status = results._orders[i].status;
          var date = {
            year : results._orders[i].receiveDate.getUTCFullYear(),
            month : results._orders[i].receiveDate.getUTCMonth() + 1,
            day : results._orders[i].receiveDate.getUTCDate(),
            hour : results._orders[i].receiveDate.getUTCHours(),
            minute : results._orders[i].receiveDate.getUTCMinutes()
          }
          receiveorder.date = date;
          receiveorder.dispatchCenter = results._orders[i].dispatchCenter||'';
          receiveorders.push(receiveorder);
        };
        data.receiveorders = receiveorders;
        data.urgentprocess = [];
        data.urgentprocessed = [];
        res.render('received',data);
      }
    )
}