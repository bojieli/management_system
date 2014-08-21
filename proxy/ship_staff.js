var config = require('../config');
var models = require('../models');
var ShipStaff = models.ShipStaff;

exports.vertify = function (shipStaff, cb){
	ShipStaff.findOne({'openID' : shipStaff},'_id',function(err, _shipStaff){
		if(err)
			cb(null);
		if(_shipStaff)
			cb(null, true);
		else
			cb(null, false);
	});
}
