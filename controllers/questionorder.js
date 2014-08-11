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
        Order.findOrdersInQuestion2(req.session.user, callback);
      },
      _orders4 : function(callback){
        Order.findOrdersInQuestion4(req.session.user, callback);
      }
      },function(err, results){
        console.log('---------results---------------');
        console.log(results);
        console.log(JSON.stringify(results));
        if(err){
          console.log('---------shipped error---------------');
          console.log(err);
          return next(err);
        }
        data.numberUnprocessed = results._getnumberUnprocessed;
        data.numberQuestion = results._getnumberQuestion;
        var questionorders = [];
        for (var i = 0; i < results._orders.length; i++) {
          var questionorder = {};
          questionorder.orderID = results._orders[i].orderID;
          questionorder.status = results._orders[i].status;
          var date = {
            year : results._orders[i].date.getFullYear(),
            month : results._orders[i].date.getMonth() + 1,
            day : results._orders[i].date.getDate(),
            hour : results._orders[i].date.getHours(),
            minute : results._orders[i].date.getMinutes()
          }
          questionorder.date = date;
          questionorder.dispatchCenter = results._orders[i].dispatchCenter||'';
          questionorders.push(questionorder);
        };
        for (var i = 0; i < results._orders4.length; i++) {
          var questionorder = {};
          questionorder.orderID = results._orders4[i].orderID;
          questionorder.status = results._orders[i].status;
          var date = {
            year : results._orders4[i].shipDate.getFullYear(),
            month : results._orders4[i].shipDate.getMonth() + 1,
            day : results._orders4[i].shipDate.getDate(),
            hour : results._orders4[i].shipDate.getHours(),
            minute : results._orders4[i].shipDate.getMinutes()
          }
          questionorder.date = date;
          questionorder.dispatchCenter = results._orders4[i].dispatchCenter||'';
          questionorders.push(questionorder);
        };
        data.questionorders = questionorders;
        data.urgentprocess = [];
        data.urgentprocessed = [];
        res.render('questionorder',data);
      }
    )
}