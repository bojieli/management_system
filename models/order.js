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
  orderID : String,
  openID : String,
  confirmTel : String,
  shopOnce : [{
    id : String,
    number : Number
  }],
  address : {
    province : String,
    city : String,
    area : String,
    detail : String,
    name : String,  //收件人
    tel : String
  },
  date : { type : Date, default : Date.now },
  cashUse : Number,
  voucherUse : Number,
  status : Number, //(0:未收货,1:已收货,未处理，)
  totalPrice : Number
},{ autoindex : false });

mongoose.model('Order',OrderSchema);