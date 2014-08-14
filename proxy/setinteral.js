var DispatchCenter = require('../models').DispatchCenter;

module.exports = function(){
  setInterval(function(){
    var TimeNow = new Date();
    var hour = TimeNow.getHours();
    var minutes = TimeNow.getMinutes();
    if(hour == 0 && minutes >=30 && minutes <= 59){//每天凌晨00:30-00:59分之间更新一次数据库
      DispatchCenter.update({},{$set:{orderNumToday : 0}},afterUpdate);
    }
  },1800000);
  function afterUpdate(err){
    if(err) {
      errUtil.wrapError(err,config.errCode_update,"setInterval()","/proxy/setinterval");
       return next(err);
    }
  }
}