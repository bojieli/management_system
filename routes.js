var access = require('./controllers/access');
var login = require('./controllers/login');
var unprocessed = require('./controllers/unprocessed');
var unshipped = require('./controllers/unshipped');
var shipped = require('./controllers/shipped');
var received = require('./controllers/received');
var search = require('./controllers/search');
var questionorder = require('./controllers/questionorder');
var neworder = require('./controllers/neworder');
var orderdetail = require('./controllers/orderdetail');

module.exports = function (app) {

	app.all('*',access.authorize)

	app.get('/',function(req ,res, next){
		res.redirect('./unprocessed');
	})

	app.get('/login',login.load);

	app.post('/login',login.authorize);

	app.get('/unprocessed',unprocessed.load);

	app.post('/unprocessed',unprocessed.unprocessedOperate);

	app.get('/unshipped',unshipped.load);

	app.get('/shipped',shipped.load);

	app.get('/received', received.load);

	app.get('/search',search.load);

	app.post('/search',search.searchOrder);

	app.get('/questionorder',questionorder.load);

	app.get('/neworder', neworder.load);

	app.post('/neworder',neworder.createOrder);

	app.post('/orderdetail', orderdetail.load);
}
