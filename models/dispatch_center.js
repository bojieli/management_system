var mongoose = require('mongoose')
var Schema = mongoose.Schema;




var DispatchCenterSchema = new Schema({
  address : String,
  shipHeadID : String,
  orderNumToday : {type:Number,default : 0},
  orderNumTotal : {type:Number,default : 0}
},{autoindex :  false});


mongoose.model('DispatchCenter',DispatchCenterSchema);