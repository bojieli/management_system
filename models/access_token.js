var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config');

 var AccessTokenSchema = new Schema({
  id : {type: Number, default : 1919},
  accessToken : {type:String,default : ""}
 });

mongoose.model('AccessToken',AccessTokenSchema);