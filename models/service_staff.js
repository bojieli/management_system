var mongoose = require('mongoose')
var Schema = mongoose.Schema;




var ServiceStaffSchema = new Schema({
  account : {type:String,default:""},
  password : {type:String,default:""},
  orderNumberTotal : {type:Number,default : 0},
  orderNumberToday : {type:Number,default : 0}
},{autoindex :  false});


mongoose.model('ServiceStaff',ServiceStaffSchema);