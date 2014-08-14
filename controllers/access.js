var ShipStaff = require('../proxy').ShipStaff;
var shipLogin = require('../util_plugin/login');


exports.authorize = function (req, res, next){
    if(req.session.user||req.path === '/login'){
      req.session.user = req.session.user;//重新创建session,使得inactive connection以后30min失效
      next();
    }else if(req.path === '/orderaction'){
    	if(req.session.openID){
    		ShipStaff.vertify(req.session.openID, function(err, vertify){
    			if(vertify)
    				next();
    			else
    				res.send('无法访问！');
    		})
    	}else{
    		console.log('------------------------');
    		shipLogin(req, res);
    	}
    }else if(req.path === '/shiplogin'){
    	next();
    }else{
      res.redirect('./login');
    }
}