var ServiceStaff = require('../models').ServiceStaff;
var DispatchCenter = require('../models').DispatchCenter;
var ShipStaff = require('../models').ShipStaff;

// var servicestaff = new ServiceStaff({
//   account : 'chendongdong',
//   password : '000000',
//   orderNumberTotal : 100,
//   orderNumberToday : 50
// });

// servicestaff.save();


// servicestaff = new ServiceStaff({
//   account : 'heyu',
//   password : '123456',
//   orderNumberTotal : 500,
//   orderNumberToday : 100
// });
// servicestaff.save();

// var dispatchcenter = new DispatchCenter({
//   address: "阜阳1号车",
//   shipHeadID : "owaixtwzZUF3Qma5s8xH0N__mwK0"
// });

// dispatchcenter.save();

// dispatchcenter = new DispatchCenter({
//   address: "阜阳2号车",
//   shipHeadID : "owaixt4mctd2ZtHxa3dyAKTvFMIo"
// });

// dispatchcenter.save();

// dispatchcenter = new DispatchCenter({
//   address: "阜阳3号车",
//   shipHeadID : "owaixt5-8dmxzD5ASjETEL9JcyqY"
// });

// dispatchcenter.save();


var shipStaff = new ShipStaff({
  openID : "owaixtwzZUF3Qma5s8xH0N__mwK0",
  dispatch : "阜阳1号车",
  name : "贺羽",
  tel : "18715000001"
});
shipStaff.save();

shipStaff = new ShipStaff({
  openID : "owaixt4mctd2ZtHxa3dyAKTvFMIo",
  dispatch : "阜阳2号车",
  name : "陈冬冬",
  tel : "18715000002"
});
shipStaff.save();

shipStaff = new ShipStaff({
  openID : "owaixt5-8dmxzD5ASjETEL9JcyqY",
  dispatch : "阜阳3号车",
  name : "鲍建敏",
  tel : "18715000003"
});
shipStaff.save();