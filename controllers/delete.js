var async = require('async');
var Order = require('../proxy').Order;

exports.orderDelete = function (req, res, next){
  console.log("=============delete"+JSON.stringify(req.body));
	Order.orderDelete(req.body.orderID, req.body.notes, function(err){
		if(err){
      res.send({code : "error"});
			next(err);
    }else{
      res.send({code : "ok"});
    }
	})
}