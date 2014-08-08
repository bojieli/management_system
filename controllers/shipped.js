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
        Order.getNumberbystatus(21,callback);
      },
      _orders : function(callback){
        Order.findOrdersInShipped(req.session.user, callback);
      } 
      },function(err, results){
        if(err){
          console.log('---------shipped error---------------');
          console.log(err);
          return next(err);
        }
        data.numberUnprocessed = results._getnumberUnprocessed;
        data.numberQuestion = results._getnumberQuestion;
        var shiporders = [];
        for (var i = 0; i < results._orders.length; i++) {
          var shiporder = {};
          shiporder.orderID = results._orders[i].orderID;
          shiporder.status = '已发货';
          var date = {
            year : results._orders[i].shipDate.getUTCFullYear(),
            month : results._orders[i].shipDate.getUTCMonth() + 1,
            day : results._orders[i].shipDate.getUTCDate(),
            hour : results._orders[i].shipDate.getUTCHours(),
            minute : results._orders[i].shipDate.getUTCMinutes()
          }
          shiporder.date = date;
          shiporder.dispatchCenter = results._orders[i].dispatchCenter||'';
          shiporders.push(shiporder);
        };
        data.shiporders = shiporders;
        data.urgentprocess = [];
        data.urgentprocessed = [];
        console.log('---------data---------------');
        console.log(JSON.stringify(data));
        res.render('shipped',data);
      }
    )

    
  }