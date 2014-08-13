var mongoose = require('mongoose')
var Schema = mongoose.Schema;




var DispatchCenterSchema = new Schema({
  address : String,
  shipHeadID : String
},{autoindex :  false});


mongoose.model('DispatchCenter',DispatchCenterSchema);