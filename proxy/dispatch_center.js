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
		var alldispatches = [];
	      for (var i = 0; i < dispatchCenters.length; i++) {
	        alldispatches.push(dispatchCenters[i].address);
	      };
	    cb(err,alldispatches);
    }
  }
}

exports.getCenterByAddress = function(address,cb){
  DispatchCenter.findOne({address : address},afterFind);
  function afterFind(err,dispatchCenter){
    if(err) {
      errUtil.wrapError(err,config.errorCode_find,"getCenterByAddress()","/proxy/dispatch_center",{});
      return cb(err,null);
    }else{
      return cb(err,dispatchCenter);
    }
  }
}

exports.addNumberToday = function(address, cb){
  DispatchCenter.update({address : address},
    {$inc:{orderNumToday : 1}} , function(err){

      if(err)
        return cb(err);
      cb(null);
    })
}