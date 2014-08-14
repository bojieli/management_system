exports.authorize = function (req, res, next){
    if(req.session.user||req.path === '/login'){
      next();
    }else if(req.path === '/orderaction'){
    	next();
    }else{
      res.redirect('./login');
    }
}