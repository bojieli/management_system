var config = require('../config');
var ServiceStaff = require('../proxy').ServiceStaff;

exports.load = function (req, res, next){
    res.render('login',{message:""});
}

exports.authorize = function (req, res, next){
    ServiceStaff.loginAuthorize(req.body.account,req.body.password,function(err,status){
      if(status){
        req.session.user = req.body.account;
        res.redirect('/unprocessed');
      }else{
        switch(err.errCode){
          case -3:
            res.render('login',{message:"数据库查询出错！"});
            next(err);
            break;
          case -2:
            res.render('login',{message:"密码输入错误！"});
            break;
          case -1:
            res.render('login',{message:"客服账号不存在！"});
            break;
        }

      }
    });
}
