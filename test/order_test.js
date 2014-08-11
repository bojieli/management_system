var Order = require('../proxy').Order;
var _Order = require('../models').Order;


// Order.findOneOrder(function(err, order){
// 	console.log(order);
// })


// Order.getNumberbystatus(1,function(err,num){
// 	console.log(num);
// })

global.orderID_increment = 0;

var info = {
	shopOnce : [
		{
			id : 'fy20140716001',
			number : 2
		},
		{
			id : 'fy20140716002',
			number : 8
		},
		{
			id : 'fy20140716003',
			number : 8
		}
	],
	address : {
    province : '安徽',
    city : '阜阳',
    area : '蜀山区',
    detail : 'String',
    name : '贺羽',  //收件人
    tel : '13966666666'
  },
  cashUse : 0,
  voucherUse : 0,
  totalPrice : 20
}
var openID = 'owaixtwzZUF3Qma5s8xH0N__mwK0c';

// for(var i = 0; i< 5 ; i++){
// 	Order.createOrder(openID,info,function(err,order){
// 		console.log(JSON.stringify(order));
// 	})
// }
// _Order.update({'status' : 3},{'dispatchCenter': '阜阳市中心3号车'},
// 	{ multi: true },function (err, numberAffected, raw){
// 		console.log(numberAffected);
// 	})
// var count = 0;

// setInterval(function(){
// 	Order.createOrder(openID,info,function(err,order){
// 		console.log('count : '+count + '  ' + JSON.stringify(order.orderID));
// 		count++;
// 	});
// },5000);

// setInterval(function(){
// 	_Order.update({'status' : 3}, {'status' : 4},{ multi: true },function(err, number){
// 		console.log('ship:    ' + number);
// 	});
// },10000);

// setInterval(function(){
// 	_Order.update({'status' : 4}, {'status' : 5},{ multi: true },function(err, number){
// 		console.log('receive:    ' + number);
// 	});
// },15000);


Order.createOrder(openID,info,function(err,order){
	console.log(order.date.toLocaleString());
	console.log(order.date.getHours());
})

