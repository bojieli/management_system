var mongoose = require('mongoose')
var Schema = mongoose.Schema;

/*
* id:酒的编号
* visitNum:酒的访问次数
* purchase：酒的购买次数
*/

 var WineSchema = new Schema({
  id : {type:String,default:""},
  name : {type:String,default:""},
  describe : {type:String,default:""},
  marketPrice : {type:Number,default:0},
  wechatPrice : {type:Number,default:0},
  littlePic : {type:String,default:""},
  details :  {
      degree : {type:String,default:""},
      volume : {type:String,default:""},
      place : {type:String,default:""}
    },
  detail : {type:String,default:""},
  bigPic : {type:[String],default:[]},
  tag : {
    winetype : {type:String,default:""},
    isRecommend : {type:Boolean,default:false}
  },
  visitNum : {type:Number,default:0},
  purchaseNum : {type:Number,default:0}
 });

mongoose.model('Wine',WineSchema);
