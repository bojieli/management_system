var config = require('../config')
var models = require('../models');
var AccessToken = models.AccessToken;
exports.getAccessToken = function(cb){
  AccessToken.findOne({id: 1919},function(err,doc){
    if(err){
      return cb(err);
    }
    cb(null,doc);
  });
}

exports.setAccessToken = function(accessToken,cb){
  AccessToken.update({id: 1919},
  	{$set:{accessToken : accessToken}},{upsert:true},function(err){
    if(err){
    	return cb(err);
    }
    cb();
  });
}