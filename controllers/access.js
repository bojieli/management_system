exports.authorize = function (req, res, next){
    if(req.session.user||req.path === '/login'){
      req.session.user = req.session.user;//重新创建session,使得inactive connection以后30min失效
      next();
    }else if(req.path === '/orderaction'){
    	next();
    }else{
      res.redirect('./login');
    }
}