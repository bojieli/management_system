exports.load = function (req, res, next){
    var data = {
      wines : [{
        describe : '51度口子窖500ml',
        wechatPrice : 128
      },{
        describe : '42度口子窖500ml',
        wechatPrice : 98
      }],
      numberUnprocessed:50,
      numberProcessedToday: 80,
      urgentprocess : [{
          orderID : 409245928034545,
          note : '收货出现问题'
        },{
          orderID : 405245928034545,
          note : '发货出现问题'
      }],
      urgentprocessed : [{
        orderID : 409245928034545,
        note : '收货出现问题'
      },{
        orderID : 405245928034545,
        note : '发货出现问题'
      }],
      alldispatches:['1号车','2号车','3号车']
    }
    res.render('neworder',data);
}