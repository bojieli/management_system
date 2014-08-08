var config = require('../config');
var errUtil = require('./wrap_error');
var models = require('../models');
var ServiceStaff = models.ServiceStaff;

/** 根据客服的账户名查询客服信息
*/

exports.getStaffInfoByAccount = function(account,cb){
  ServiceStaff.findOne({ account : account},"orderNumberTotal orderNumberToday",staffFind);

  function staffFind(err,staff){
    if(err) {
      errUtil.wrapError(err,config.errorCode_find,"getStaffInfoByAccount()","/proxy/service_staff",{
        account:account
      });
      return cb(err,null);
    }else{
      if(staff){
        cb(err,staff);
      }else{
        cb({errCode : config.errorCode_account_notfound},{});
      }
    }
  }
}


exports.loginAuthorize = function(account,password,cb){
  //console.log("===========loginAuthorize========");
  ServiceStaff.findOne({account : account},"password",staffFind);

  function staffFind(err,staff){
    if(err) {
      errUtil.wrapError(err,config.errCode_find,"loginAuthorize()","/proxy/service_staff",{
        account:account,
        password:password
      });
      return cb(err,false);
    }else{
      if(staff){
        if(staff.password === password){
           cb(null,true);
        }else{
           cb({errCode : config.errCode_password_error},false);
        }
      }else{
        cb({errCode : config.errCode_account_notfound},false);
      }
    }
  }
}

exports.getOrderNumberToday = function (account,cb){
  ServiceStaff.findOne({'account' : account},'orderNumberToday', function(err, serviceStaff){
    if(err)
      return cb(err);
    if(serviceStaff){
     cb(null,serviceStaff.orderNumberToday);
    }else{
     cb(null);
    }
  });
}