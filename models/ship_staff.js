var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ShipStaffSchema = new Schema({
  openID : String,
  dispatch : String,//所属的快递点地址
  name : String,
  tel : String
}, { autoIndex: false });

mongoose.model('ShipStaff',ShipStaffSchema);