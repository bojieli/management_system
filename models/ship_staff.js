var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ShipStaffSchema = new Schema({
  openID : {type:String,default:""},
  dispatch : {type:String,default:""},//所属的快递点地址
  name : {type:String,default:""},
  tel : {type:String,default:""}
}, { autoIndex: false });

mongoose.model('ShipStaff',ShipStaffSchema);