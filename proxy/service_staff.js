var config = require('../config');
var models = require('../models');
var ServiceStaff = models.ServiceStaff;

/** 根据客服的账户名查询客服信息
*/

exports.getStaffInfoByAccount = function(account,cb){
  ServiceStaff.findOne({ account : account},"orderNumberTotal orderNumberToday",staffFind);

  function staffFind(err,staff){
    if(err) {
      return cb(err,null);
    }else{
      if(staff){
        cb(err,staff);
      }else{
        var error = new Error();
        error.describe = "kefu account not found";
        cb(error,{});
      }
    }
  }
}


exports.loginAuthorize = function(account,password,cb){
  //console.log("===========loginAuthorize========");
  ServiceStaff.findOne({account : account},"password",staffFind);

  function staffFind(err,staff){
    if(err) {
      return cb({errCode : -3},false);
    }else{
      if(staff){
        if(staff.password === password){
           cb(null,true);
        }else{
           cb({errCode : -2},false);
        }
      }else{
        cb({errCode : -1},false);//account not found
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