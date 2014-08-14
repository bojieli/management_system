var async = require('async');
var Order = require('../proxy').Order;

exports.orderDelete = function (req, res, next){
	Order.orderDelete(req.body.orderID, req.body.notes, function(err,numberAffected){
		if(err){
      res.send({code : "error"});
			next(err);
    }else{
      res.send({code : "ok"});
      async.auto({
          _order : function(callback){
            Order.findbyOrderID(req.body.orderID, callback);
          },
          _generateOrder : ['_order', function(callback, results) {
            if(!results._order)
              return callback(null, {});
            Order.generateDetail(results._order, callback);
          }]
        },function(err, results){
          var orderDetail = results._generateOrder ;
          var openID = results._order.openID;
          var deletereason = results._order.notes;
          var message = "编号:" + orderDetail.orderID
                          + "\n时间：" + orderDetail.date
                          + "\n联系人：" + orderDetail.address.name
                          + "\n手机号：" + orderDetail.address.tel
                          + "\n详情：";
          for(var i = 0;i < orderDetail.shopOnce.length;i++){
            message = message + "\n"+orderDetail.shopOnce[i].describe + " * " + orderDetail.shopOnce[i].number;
          }

          message = message + "\n订单因如下原因被取消,如有问题,请自行联系客服:\n" + deletereason;

          var article = {
            "title" : "订单被取消",
            "description" : message,
            "url" : "",
            "picurl" : ''
          }

          wechatAPI.sendNews(openID,[article],function(err, message){
            if(err){
              err.message = message;
              next(err);
            }
          });
        });
    }
	})
}