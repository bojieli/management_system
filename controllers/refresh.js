var async = require('async');
var Order = require('../proxy').Order;


exports.load = function (req, res, next){
  var data = {};
  async.auto({
    _getnumberUnprocessed : function(callback){
      Order.getNumberbystatus(1, callback);
    },
    _getnumberQuestion : function(callback){
      Order.getNumberInQuestion(req.session.user,callback);
    },
    },function(err, results){
      if(err){
        return next(err);
      }
      data.numberUnprocessed = results._getnumberUnprocessed;
      data.numberQuestion = results._getnumberQuestion;
      data.urgentprocess = [];
      data.urgentprocessed = [];
      res.send(data);
    }
  )
}