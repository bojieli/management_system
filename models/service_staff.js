var mongoose = require('mongoose')
var Schema = mongoose.Schema;




var ServiceStaffSchema = new Schema({
  account : String,
  password : String,
  orderNumberTotal : Number,
  orderNumberToday : Number
},{autoindex :  false});


mongoose.model('ServiceStaff',ServiceStaffSchema);