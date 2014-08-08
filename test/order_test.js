var Order = require('../proxy').Order;


// Order.findOneOrder(function(err, order){
// 	console.log(order);
// })


// Order.getNumberbystatus(1,function(err,num){
// 	console.log(num);
// })



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

for(var i = 0; i< 10 ; i++){
	Order.createOrder(openID,info,function(err,order){
		console.log(JSON.stringify(order));
	})
}
