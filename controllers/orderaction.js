var async = require('async');
var Order = require('../proxy').Order;

exports.load = function (req, res, next){
	var data = {};
  	async.auto({
	    _order : function(callback){
	      Order.findbyOrderID(req.query.orderID, callback);
	    },
	    _generateOrder : ['_order', function(callback, results) {
	      if(!results._order)
	        return callback(null, null);
	      Order.generateDetail(results._order, callback);
	    }]
	  },function(err, results){
	    if(err){
	   	  //res.send();
	      return next(err);
	    }
	    if(results._order){
	    data.order = results._generateOrder ;
	    res.render('order_action',data);
	    }
	});
}