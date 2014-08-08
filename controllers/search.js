exports.load = function (req, res, next){
    var data = {
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
      }]
    }
    res.render('search',data);
}