var async = require('async');
var Order = require('../proxy').Order;

exports.orderDelete = function (req, res, next){
	Order.orderDelete(req.body.orderID, req.body.notes, function(err){
		if(err)
			next(err);
	})
}