var async = require('async');
var Order = require('../proxy').Order;
var wechatAPI = require('../common/api');

// exports.load = function (req, res, next){
// 	var data = {};
//   	async.auto({
// 	    _order : function(callback){
// 	      Order.findbyOrderID(req.query.orderID, callback);
// 	    },
// 	    _generateOrder : ['_order', function(callback, results) {
// 	      if(!results._order)
// 	        return callback(null, null);
// 	      Order.generateDetail(results._order, callback);
// 	    }]
// 	  },function(err, results){
// 	    if(err){
// 	   	  //res.send();
// 	      return next(err);
// 	    }
// 	    if(results._order){
// 	    data.order = results._generateOrder ;
// 	    res.render('order_action',data);
// 	    }
// 	});
// }

exports.operate = function(req,res,next){
	var postData = req.body;
	async.auto({
		_setStatus : function(callback){
			if(postData.method == 'ship'){
				Order.setStatus(postData.orderID,4,callback);
			}else if(postData.method == "receive"){
				Order.setStatus(postData.orderID,5,callback);
			}
		},
		_updateShipDate : function(callback){
			if(postData.method == 'ship'){
				Order.setShipDate(postData.orderID,callback);
			}else if(postData.method == 'receive'){
				Order.setReceiveDate(postData.orderID,callback);
			}
		},
		_getOrder: function(callback){
				Order.findbyOrderID(postData.orderID, callback);
		}
	},function(err,results){
		var order = results._getOrder;
		if(err && order){
			res.send({code:"error"});
			return next(err);
		}
		var message;
		if(postData.method == 'ship'){
			message = "您的订单" + order.orderID + "已发货，预计到达时间为" + postData.arrivetime + "以后，如有特殊情况,请与快递员联系,联系电话：" + "187148888888";
		}else if(postData.method == 'receive'){
			message = "您的订单" + order.orderID + "已收货，如出现问题,请联系客服！";
		}
		wechatAPI.sendText(order.openID,message,function(err){
			if(err){
				next(err);
			}
			res.send({code: "ok"});
			console.log("send message");
		});

	});
}