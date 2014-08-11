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
        Order.getNumberbystatus(21,callback);
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
        if(_orders.length==0)
          return res.render('searchresult_phonenum',[]);
        var searchresults = [];
        for (var i = 0; i < results._orders.length; i++) {
          var searchresult = {};
          searchresult.orderID = results._orders[i].orderID;
          searchresult.status = results._orders[i].status;
          var result_date;
          switch(searchresult.status){
            case 1 :
            case 2 :
            case 21:
            case 22:
            case 3:
            result_date = results._orders[i].date;
            break;
            case 4 :
            case 41 :
            case 42 :
            result_date = results._orders[i].shipDate;
            break;
            case 5 :
            result_date = results._orders[i].receiveDate;
            break;
          }
          searchresult.date = formatDate(result_date);
          searchresult.dispatchCenter = results._orders[i].dispatchCenter||'';
          searchresults.push(searchresult);
        };
        data.searchresults = searchresults;
        res.render('searchresult_phonenum',data);
      }
    )
  }
}

