var congfig = require('../config');
var errUtil = require('./wrap_error');
var models = require('../models');
var DispatchCenter = models.DispatchCenter;

exports.getAllCenterInfo = function(cb) {
  DispatchCenter.find({},afterFind);

  function afterFind(err,dispatchCenters){
    if(err) {
      errUtil.wrapError(err,config.errorCode_find,"getAllCenterInfo()","/proxy/dispatch_center",{});
      return cb(err,null);
    }else{
        cb(err,dispatchCenters);
    }
  }
}