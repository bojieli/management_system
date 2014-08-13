var mongoose = require('mongoose')
var Schema = mongoose.Schema;




var DispatchCenterSchema = new Schema({
  address : String,
  shipHeadID : String,
  orderNumToday : Number
},{autoindex :  false});


mongoose.model('DispatchCenter',DispatchCenterSchema);