var config = require('../config')
var models = require('../models');
var Wine = models.Wine;


/* wine的数据类型
 var WineSchema = new Schema({
  id : String,
  name : String,
  describe : String,
  marketPrice : Number,
  wechatPrice : Number,
  littlePic : String,
  details : {
  	degree : Number,
  	volume : Number,
  	place : String
  },
  BigPic : [String]
  Tag : {
  	Type : String,
  	isRecommend : Boolean
  }
  visitNum : Number,
  purchaseNum : Number
 });
 */

/**
* 根据酒的id增加酒的访问量
* Callback:
* - err, 数据库异常
& @param {String} id
* @param {Function} cb
*/

exports.addVisit = function(id,cb){
	Wine.update({id : id},{$inc : {visitNum : 1}},afterUpdate);

  function afterUpdate(err){
    if(err){
      return cb(err);
    }else{
      cb(null);
    }
  }
}
/**
* 根据酒的id查找酒的详情
* Callback:
* - err, 数据库异常
* - wine,酒的详情
& @param {String} id
* @param {Function} cb
*/
exports.findByID = function(id,cb){
	Wine.findOne({id : id},wineFind);

  function wineFind(err,wine){
    if(err){
      return cb(err,{});
    }else{
      cb(err,wine);
    }
  }

}
exports.findByIDs = function(ids, cb){
  Wine.find({id: {$in: ids}},afterFind);
  function afterFind(err, wines) {
    if(err){
      return cb(err,null);
    }else{
      cb(err, wines);
    }
  }
}
/**
* 查找推荐的酒
* Callback:
* - err, 数据库异常
* - wines, 酒的集合
* @param {Function} cb
*/
exports.findRecommend = function(cb){
	Wine.find({"tag.isRecommend" : true} , winesFind);


  function winesFind(err,wines){
    if(err){
      return cb(err,{});
    }else{
      cb(err,wines);
    }
  }
}

exports.findAllWines = function(cb){
  Wine.find({},'id describe wechatPrice', cb);
}