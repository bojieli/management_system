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
  status : Number, 
  totalPrice : Number //指的是货到付款时需要支付的现金
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