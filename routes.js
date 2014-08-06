module.exports = function (app) {

	//app.all('')
	//   /
	app.get('/getOrder',function(req, res, next){
		var orderID = req.query.orderID;
		//console.log(orderID);
		res.send({message : 'OK', error : 0});
	})
}