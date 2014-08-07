var ServiceStaff = require('../models').ServiceStaff;
var DispatchCenter = require('../models').DispatchCenter;

var servicestaff = new ServiceStaff({
  account : 'chendongdong',
  password : '123456',
  orderNumberTotal : 100,
  orderNumberToday : 50
});

servicestaff.save();


servicestaff = new ServiceStaff({
  account : 'heyu',
  password : '123456',
  orderNumberTotal : 500,
  orderNumberToday : 100
});
servicestaff.save();

var dispatchcenter = new DispatchCenter({
  address: "阜阳1号车"
});

dispatchcenter.save();

dispatchcenter = new DispatchCenter({
  address: "阜阳2号车"
});

dispatchcenter.save();

dispatchcenter = new DispatchCenter({
  address: "阜阳3号车"
});

dispatchcenter.save();
