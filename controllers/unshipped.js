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
      Order.findOrdersInUnship(req.session.user, callback);
    } 
    },function(err, results){
      if(err){
        console.log('---------shipped error---------------');
        console.log(err);
        return next(err);
      }
      data.numberUnprocessed = results._getnumberUnprocessed;
      data.numberQuestion = results._getnumberQuestion;
      var unshiporders = [];
      for (var i = 0; i < results._orders.length; i++) {
        var unshiporder = {};
        unshiporder.orderID = results._orders[i].orderID;
        unshiporder.status = '未发货';
        var date = {
          year : results._orders[i].date.getUTCFullYear(),
          month : results._orders[i].date.getUTCMonth() + 1,
          day : results._orders[i].date.getUTCDate(),
          hour : results._orders[i].date.getUTCHours(),
          minute : results._orders[i].date.getUTCMinutes()
        }
        unshiporder.date = date;
        unshiporder.dispatchCenter = results._orders[i].dispatchCenter||'';
        unshiporders.push(unshiporder);
      };
      data.unshiporders = unshiporders;
      data.urgentprocess = [];
      data.urgentprocessed = [];
      res.render('unshipped',data);
    }
  )
}