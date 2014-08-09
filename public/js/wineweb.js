$(document).ready(function(){
  var modify_flag = false;

  function getOrderDetail(orderID){
    $.post('/orderdetail',
    {
      orderID : orderID
    },
    function(data,status){
      if(status == 'success'){
        $('div#detail_modal div.modal-body').html(data);
        $('div#detail_modal').modal('show');
        $('div#alert_delete').css('z-index',2000);
      }else{
        $('div#detail_modal div.modal-body').text('查找订单出错');
        $('div#detail_modal').modal('show');
      }
    });
  }

  $('a.question_orderID').click(function(){
    var orderID = $(this).children('span').text();
    getOrderDetail(orderID);
  });

  $('li.order_abstract_item').click(function(){
    var orderID =  $(this).find('span.orderID_abstract').text();
    getOrderDetail(orderID);
  });

  function orderProcess(method){
    var orderID = $('span#orderID').text();
    var modifyinfo = modify_flag ? {
        address: {
          area: $("select#area option:selected").text(),
          detail: $("#detailOfLoc").text(),
          name: $("#username").val(),
          tel: $("#usertel").val()
        },
        dispatchCenter:$("select#dispatch option:selected").text(),
        notes: $("#detailOfNotes").val()
      } : null;

    var postData = {
      orderID : orderID,
      modifyinfo : modifyinfo,
      method : method
    }

    $.post("/unprocessed",postData,function(data,status){
      if(status == 'success'){
        if(data.code == 'ok'){
          location.reload();
        }else{
          alert('确认订单出错,重新操作!');
        }
      }
    });

  }
  /* listen if form info changed. S*/
  $(".editable").change(function(){
  	modify_flag = true;
  });

  /* click check button*/

  $("button#order_confirm").click(function() {
    orderProcess('confirm');
	});

  $("button#order_delete").click(function(){
    orderProcess('delete');
  });

  $("button#order_wait").click(function(){
    orderProcess('wait');
  });
  /* listen E*/
});
