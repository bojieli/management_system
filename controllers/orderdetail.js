exports.load = function(req,res,next){
  //console.log('==========='+req.body['orderID']);
  var data = {
      orderID : 40725678234823,
      date:{
        year : 2014,
        month : 8,
        day : 25,
        hour : 7,
        minute : 15
      },
      isFirst : true,
      address : {
        name : "贺羽",
        tel : "18714456677",
        area : "颍东区",
        detail : "人民政府"
      },
      notes : "加急快件",
      shopOnce :[{
        describe : "51度口子窖200ml装",
        wechatPrice : 128,
        number:3
      },{
        describe : "42度口子窖200ml装",
        wechatPrice : 168,
        number:4
      }],
      cashNeeded : 748,
      cashTotal : 1058,
      coupon : 300,
      voucher : 10,
      alldispatches:['1号车','2号车','3号车']
    };
  res.render('order_unprocessed',data);
}