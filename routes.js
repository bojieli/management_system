var config = require('./config');
var ServiceStaff = require('./proxy').ServiceStaff;

module.exports = function (app) {

	app.all('*',function (req, res, next){
		if(req.session.user||req.path === '/login'){
			console.log(req.session.user);
			next();
		}
		else{
			res.redirect('./login');
		}
		//next();
	});

	app.get('/login', function (req, res, next){
		res.render('login',{message:""});
	})

	app.post('/login',function (req, res, next){
		ServiceStaff.loginAuthorize(req.body.account,req.body.password,function(err,status){
			if(status){
				req.session.user = req.body.account;
				res.redirect('./unprocessed');
			}else{
				switch(err.errCode){
					case config.errCode_find:
						res.render('login',{message:"数据库查 询出错！"});
						next(err);
						break;
					case config.errCode_password_error:
						res.render('login',{message:"密码输入错误！"});
						break;
					case config.errCode_account_notfound:
						res.render('login',{message:"客服账号不存在！"});
						break;
				}

			}
		});
	})
	app.get('/',function(req ,res, next){
		res.redirect('./unprocessed');
	})
	app.get('/unprocessed', function (req, res, next){
		var data = {
			orderID : 40725678234823,
			date:{
				year : 2014,
				month : 8,
				day : 25,
				hour : 7,
				minute : 15
			},
			isFirst : true,
			address : {
				name : "贺羽",
				tel : "18714456677",
				area : "颍东区",
				detail : "人民政府"
			},
			note : "加急快件",
			shopOnce :[{
				describe : "51度口子窖200ml装",
				wechatPrice : 128,
				number:3
			},{
				describe : "42度口子窖200ml装",
				wechatPrice : 168,
				number:4
			}],
			cashNeeded : 748,
			cashTotal : 1058,
			coupon : 300,
			voucher : 10,
			urgentprocess : [{
				orderID : 409245928034545,
				note : '收货出现问题'
			},{
				orderID : 405245928034545,
				note : '发货出现问题'
			}],
			urgentprocessed : [{
				orderID : 409245928034545,
				note : '收货出现问题'
			},{
				orderID : 405245928034545,
				note : '发货出现问题'
			}]
		};
		res.render('unprocessed',data);
	})
	app.get('/unshipped', function (req, res, next){
		var data = {
			unshiporders:[{
				orderID : 'f2342523452345',
				date: {
					year : 2014,
					month : 7,
					day : 24,
					hour : 17,
					minute : 30
				},
				dispatch : '1号车'
				},{
					orderID : 'f23242523452345',
					date: {
						year : 2014,
						month : 7,
						day : 20,
						hour : 15,
						minute : 20
					},
					dispatch : '2号车'
				},{
					orderID : 'f2332434523452345',
					date: {
						year : 2014,
						month : 7,
						day : 14,
						hour : 16,
						minute : 30
					},
					dispatch : '3号车'
			}],

			urgentprocess : [{
					orderID : 409245928034545,
					note : '收货出现问题'
				},{
					orderID : 405245928034545,
					note : '发货出现问题'
			}],
			urgentprocessed : [{
				orderID : 409245928034545,
				note : '收货出现问题'
			},{
				orderID : 405245928034545,
				note : '发货出现问题'
			}]
		};
		res.render('unshipped',data);
	})

	app.get('/shipped',function(req, res, next){
		var data = {
			shiporders:[{
				orderID : 'f2342523452345',
				date: {
					year : 2014,
					month : 7,
					day : 24,
					hour : 17,
					minute : 30
				},
				dispatch : '1号车'
				},{
					orderID : 'f23242523452345',
					date: {
						year : 2014,
						month : 7,
						day : 20,
						hour : 15,
						minute : 20
					},
					dispatch : '2号车'
				},{
					orderID : 'f2332434523452345',
					date: {
						year : 2014,
						month : 7,
						day : 14,
						hour : 16,
						minute : 30
					},
					dispatch : '3号车'
			}],

			urgentprocess : [{
					orderID : 409245928034545,
					note : '收货出现问题'
				},{
					orderID : 405245928034545,
					note : '发货出现问题'
			}],
			urgentprocessed : [{
				orderID : 409245928034545,
				note : '收货出现问题'
			},{
				orderID : 405245928034545,
				note : '发货出现问题'
			}]
		};
		res.render('shipped',data);
	})

	app.get('/received', function (req, res, next){
		var data = {
			receiveorders:[{
				orderID : 'f2342523452345',
				date: {
					year : 2014,
					month : 7,
					day : 24,
					hour : 17,
					minute : 30
				},
				dispatch : '1号车'
				},{
					orderID : 'f23242523452345',
					date: {
						year : 2014,
						month : 7,
						day : 20,
						hour : 15,
						minute : 20
					},
					dispatch : '2号车'
				},{
					orderID : 'f2332434523452345',
					date: {
						year : 2014,
						month : 7,
						day : 14,
						hour : 16,
						minute : 30
					},
					dispatch : '3号车'
			}],

			urgentprocess : [{
					orderID : 409245928034545,
					note : '收货出现问题'
				},{
					orderID : 405245928034545,
					note : '发货出现问题'
			}],
			urgentprocessed : [{
				orderID : 409245928034545,
				note : '收货出现问题'
			},{
				orderID : 405245928034545,
				note : '发货出现问题'
			}]
		};
		res.render('received',data);
	})

	app.get('/search', function (req, res, next){
		var data = {
			urgentprocess : [{
					orderID : 409245928034545,
					note : '收货出现问题'
				},{
					orderID : 405245928034545,
					note : '发货出现问题'
			}],
			urgentprocessed : [{
				orderID : 409245928034545,
				note : '收货出现问题'
			},{
				orderID : 405245928034545,
				note : '发货出现问题'
			}]
		}
		res.render('search',data);
	})

	app.get('/questionorder', function (req, res, next){
		var data = {
			questionorders:[{
				orderID : 'f2342523452345',
				date: {
					year : 2014,
					month : 7,
					day : 24,
					hour : 17,
					minute : 30
				},
				dispatch : '1号车'
				},{
					orderID : 'f23242523452345',
					date: {
						year : 2014,
						month : 7,
						day : 20,
						hour : 15,
						minute : 20
					},
					dispatch : '2号车'
				},{
					orderID : 'f2332434523452345',
					date: {
						year : 2014,
						month : 7,
						day : 14,
						hour : 16,
						minute : 30
					},
					dispatch : '3号车'
			}],

			urgentprocess : [{
					orderID : 409245928034545,
					note : '收货出现问题'
				},{
					orderID : 405245928034545,
					note : '发货出现问题'
			}],
			urgentprocessed : [{
				orderID : 409245928034545,
				note : '收货出现问题'
			},{
				orderID : 405245928034545,
				note : '发货出现问题'
			}]
		};
		res.render('questionorder',data);
	})


	app.get('/neworder', function (req, res, next){
		var data = {
			urgentprocess : [{
					orderID : 409245928034545,
					note : '收货出现问题'
				},{
					orderID : 405245928034545,
					note : '发货出现问题'
			}],
			urgentprocessed : [{
				orderID : 409245928034545,
				note : '收货出现问题'
			},{
				orderID : 405245928034545,
				note : '发货出现问题'
			}]
		}
		res.render('neworder',data);
	})
}