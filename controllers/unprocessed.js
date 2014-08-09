var async = require('async');
var Order = require('../proxy').Order;
var ServiceStaff = require('../proxy').ServiceStaff;
var DispatchCenter = require('../proxy').DispatchCenter;
var Wine = require('../proxy').Wine;

exports.load = function(req,res,next){

    var data = {};
    var order = {};
    async.auto({
      _getnumberUnprocessed : function(callback){
        Order.getNumberbystatus(1, callback);
      },
      _getnumberQuestion : function(callback){
        Order.getNumberbystatus(21,callback);
      },
      _getnumberProcessedToday : function(callback){
        ServiceStaff.getOrderNumberToday(req.session.user, callback);
      },
      _getAllCenterInfo : function(callback){
        DispatchCenter.getAllCenterInfo(callback);
      },
      _findOneOrder : function(callback){
        Order.findOneOrder(req.session.user, callback);
      },
      _getAllCenterInfo : function(callback){
        DispatchCenter.getAllCenterInfo(callback);
      },
      _findWineByIDs : ['_findOneOrder', function(callback, results) {

        order = results._findOneOrder;
        if(!order)
          return callback(null, null);

        var ids = [];
        for (var i = 0; i < order.shopOnce.length; i++) {
          ids.push(order.shopOnce[i].id);
        };
        Wine.findByIDs(ids, callback);
      }],
      _changeShopOnce : ['_findWineByIDs', function(callback, results){
        if(!order)
          return callback(null, order);
        var _wines = results._findWineByIDs;
        for (var i = 0; i < order.shopOnce.length; i++) {
          var index = findWinebyid(order.shopOnce[i].id);
          order.shopOnce[i].describe = _wines[index].describe;
          order.shopOnce[i].wechatPrice = _wines[index].wechatPrice;
          delete order.shopOnce[i].id;
        };
        callback();

        function findWinebyid(id){
          for (var i = 0; i < _wines.length; i++) {
            if(id ==_wines[i].id)
              return i;
          };
        }
      }]
    },function(err, results){
      if(err){
        console.log('---------unprocessed error---------------');
        console.log(err);
        return next(err);
      }


      data.numberUnprocessed = results._getnumberUnprocessed;
      data.numberProcessedToday = results._getnumberProcessedToday;
      data.numberQuestion = results._getnumberQuestion;
      data.urgentprocess = [];
      data.urgentprocessed = [];

      if(!order){
        data.emptyflag = true;
        return res.render('unprocessed',data);
      }
      data.emptyflag = false;
      data.orderID = order.orderID;
      var date = {
        year : order.date.getUTCFullYear(),
        month : order.date.getUTCMonth() + 1,
        day : order.date.getUTCDate(),
        hour : order.date.getUTCHours(),
        minute : order.date.getUTCMinutes()
      }
      data.date = date;
      data.isFirst = order.isFirst;
      data.address = order.address;
      data.notes = order.notes||'';
      data.cashNeeded = order.totalPrice;
      data.cashTotal = order.cashUse + order.voucherUse + order.totalPrice;
      data.coupon = order.cashUse;
      data.voucher = order.voucherUse;
      data.shopOnce = order.shopOnce;
      var alldispatches = [];
      for (var i = 0; i < results._getAllCenterInfo.length; i++) {
        alldispatches.push(results._getAllCenterInfo[i].address);
      };
      data.alldispatches = alldispatches
      res.render('unprocessed',data);
    });

}

exports.unprocessedOperate = function(req,res,next) {
  console.log('======unprocessed.operate======='+JSON.stringify(req.body));
  var postData = req.body;
  Order.unprocessedOperate(postData,function(err){
    if(err){
      res.send({code:'error'})
      next(err);
    }
    res.send({code:'ok'});});
}




// var data = {
//       numberUnprocessed:50,    //getNumberbystatus
//       numberProcessedToday: 80,  //getnumberProcessedToday


//       orderID : 40725678234823,
//       date:{
//         year : 2014,
//         month : 8,
//         day : 25,
//         hour : 7,
//         minute : 15
//       },
//       isFirst : true,
//       address : {
//         name : "贺羽",
//         tel : "18714456677",
//         area : "颍东区",
//         detail : "人民政府"
//       },
//       note : "加急快件",
//       cashNeeded : 748,
//       cashTotal : 1058,
//       coupon : 300,     //现金券
//       voucher : 10,                  //findOneOrder




//       shopOnce :[{
//         describe : "51度口子窖200ml装",
//         wechatPrice : 128,
//         number:3
//       },{
//         describe : "42度口子窖200ml装",
//         wechatPrice : 168,
//         number:4
//       }],                        //after findOneOrder findWines



//       urgentprocess : [{
//         orderID : '409245928034545',
//         note : '收货出现问题'
//       },{
//         orderID : '405245928034545',
//         note : '发货出现问题'
//       }],
//       urgentprocessed : [{
//         orderID :'409245928034545',
//         note : '收货出现问题'
//       },{
//         orderID : '405245928034545',
//         note : '发货出现问题'
//       }],


//       alldispatches:['1号车','2号车','3号车'] //find getAllCenterInfo
//     };

