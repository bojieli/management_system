var mongoose = require('mongoose')
var Schema = mongoose.Schema;

/*
* openID:所对应的用户
* shopList:所有的购物历史，一次购物历史信息如下{
*           shopOnce:一次的购买物品
*           address:地址信息
*           date: 时间
            cashUse:
            voucherUse:现金券和代金券的使用
            statue:是否已经确认收到，由后台人员修改
            totalPrice:商品总价
*         }
*/

var OrderSchema = new Schema({
  orderID : {type:String,default : ""},
  openID : {type:String,default : ""},
  shopOnce : [{
    id : {type:String,default : ""},
    wechatPrice :{type:Number,default:0},
    describe : {type:String,default : ""},
    littlePic : {type:String,default : ""},//小图路径，config.small_dir + Wines[index].littlePic
    number : {type:Number,default:0}
  }],
  address : {
    province : {type:String,default : ""},
    city : {type:String,default : ""},
    area : {type:String,default : ""},
    detail : {type:String,default : ""},
    name : {type:String,default : ""},  //收件人
    tel : {type:String,default : ""}
  },
  date : { type : Date, default : Date.now }, //下单时间
  shipDate : { type : Date, default : Date.now }, //派送时间
  receiveDate : { type : Date, default : Date.now }, //收货时间

  cashUse : {type:Number,default:0},
  voucherUse : {type:Number,default:0},

  status : {type:Number,default:1},  //订单状态，状态码见下面

  isFirst : {type:Boolean,default:true}, // 是否是首次下单
  totalPrice : {type:Number,default:0}, //指的是货到付款时需要支付的现金

  customerService : {type : String, default : ''}, // 处理该订单的客服
  shipStaff: {type : String, default : ''},// 派送该订单的快递
  dispatchCenter: {type : String, default : ''},// 派送该订单的快递中心
  notes : {type : String, default : ''} // 备注
},{ autoindex : false });
/*
订单的生命周期：

status:

1 下单

2 未处理订单
  21 疑难订单（沟通不顺畅，电话打不通等等）
  22 删除订单（号码有误，地址有误）

3 未发货订单

4 已发货订单
  41 暂时无法派送订单
  42 派送失败，取消订单

5 已收货订单

*/


mongoose.model('Order',OrderSchema);