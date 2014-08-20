var mongoose = require('mongoose')
var Schema = mongoose.Schema;




var DispatchCenterSchema = new Schema({
  address : {type:String,default : ""},
  shipHeadID : {type:String,default : ""},
  orderNumToday :{type:Number,default : 0},
  orderNumTotal : {type:Number,default : 0}
},{autoindex :  false});


mongoose.model('DispatchCenter',DispatchCenterSchema);