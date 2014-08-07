var Order = require('../proxy').Order;

/*
Order.findOneOrder(function(err, order){
	console.log(order);
})
*/

Order.getNumberbystatus(1,function(err,num){
	console.log(num);
})