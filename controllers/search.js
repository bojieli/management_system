var async = require('async');
var Order = require('../proxy').Order;
var ServiceStaff = require('../proxy').ServiceStaff;
var DispatchCenter = require('../proxy').DispatchCenter;
var Wine = require('../proxy').Wine;


exports.load = function (req, res, next){
   var data = {};
    async.auto({
      _getnumberUnprocessed : function(callback){
        Order.getNumberbystatus(1, callback);
      },
      _getnumberQuestion : function(callback){
        Order.getNumberInQuestion(req.session.user,callback);
      }
      },function(err, results){
        if(err){
          console.log('---------shipped error---------------');
          console.log(err);
          return next(err);
        }
        data.numberUnprocessed = results._getnumberUnprocessed;
        data.numberQuestion = results._getnumberQuestion;
        data.urgentprocess = [];
        data.urgentprocessed = [];
        res.render('search',data);
      }
    )
}

exports.searchOrder = function(req, res, next){
  var order = {};
  var data = {};
  var rcv_data = req.body;
  if(rcv_data.searchmethod == 'orderid'){
     var data = {};
    async.auto({
      _getAllCenterInfo : function(callback){
        DispatchCenter.getAllCenterInfo(callback);
      },
      _order : function(callback){
        Order.findOneOrder(req.session.user, callback);
      },
      _generateOrder : ['_order', function(callback, results) {
        if(!results._order)
          return callback(null, null);
        Order.generateDetail(results._order, callback);
      }]
    },function(err, results){
      if(err){
        return next(err);
      }
      // data = results._generateOrder;
      if(!results._order){
        data.emptyflag = true;
        return res.render('order_detail',data);
      }
      data.emptyflag = false;
      data.order = results._generateOrder ;
      data.alldispatches = results._getAllCenterInfo;

      res.render('order_detail',data);
    });

  }else if(rcv_data.searchmethod == 'phonenum'){
    async.auto({
      _orders : function(callback){
        Order.findbyTel(rcv_data.inputnumber, callback);
      } 
      },function(err, results){
        if(err){
          console.log('---------shipped error---------------');
          console.log(err);
          return next(err);
        }
        if(results._orders.length==0)
          return res.render('searchresult_phonenum',[]);
        data.searchresults = results._orders;
        res.render('searchresult_phonenum',data);
      }
    )
  }
}

