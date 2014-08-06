module.exports = function (app) {
	
	app.all('*',function (req, res, next){
		/*if(!req.session.user)
			res.redirect('/login');
		else
			next();*/
		next();
	});
	app.get('/login', function (req, res, next){
		res.send('login');
	})
	app.get('/unprocessed', function (req, res, next){
		res.send('unprocessed');
	})
	app.get('/unshipped', function (req, res, next){
		res.send('unshipped');
	})
	app.get('/received', function (req, res, next){
		res.send('received');
	})
	app.get('/questionorder', function (req, res, next){
		res.send('questionorder');
	})
	app.get('/questionorder', function (req, res, next){
		res.send('questionorder');
	})
	app.get('/search', function (req, res, next){
		res.send('search');
	})
	app.get('/neworder', function (req, res, next){
		res.send('neworder');
	})
}