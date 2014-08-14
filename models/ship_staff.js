var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var ShipStaffSchema = new Schema({
  name : String,
  openID : String,
  tel : String,
},{autoindex :  false});


mongoose.model('ShipStaff',ShipStaffSchema);