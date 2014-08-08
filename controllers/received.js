exports.load = function (req, res, next){
    var data = {
      numberUnprocessed:50,
      numberProcessedToday: 80,
      receiveorders:[{
        orderID : 'f2342523452345',
        status : '已收货',
        date: {
          year : 2014,
          month : 7,
          day : 24,
          hour : 17,
          minute : 30
        },
        dispatchCenter : '1号车'
        },{
          orderID : 'f23242523452345',
          date: {
            year : 2014,
            month : 7,
            day : 20,
            hour : 15,
            minute : 20
          },
          dispatchCenter : '2号车'
        },{
          orderID : 'f2332434523452345',
          date: {
            year : 2014,
            month : 7,
            day : 14,
            hour : 16,
            minute : 30
          },
          dispatchCenter : '3号车'
      }],

      urgentprocess : [{
          orderID : 409245928034545,
          notes : '收货出现问题'
        },{
          orderID : 405245928034545,
          notes : '发货出现问题'
      }],
      urgentprocessed : [{
        orderID : 409245928034545,
        notes : '收货出现问题'
      },{
        orderID : 405245928034545,
        notes : '发货出现问题'
      }]
    };
    res.render('received',data);
}