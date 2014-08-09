$(document).ready(function(){



  var flag = 0;
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
    alert('click');
    var orderID = $(this).children('span').text();
    getOrderDetail(orderID);
  });

  $('li.order_abstract_item').click(function(){
     alert('click');
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
          alert('确认订单出错');
        }
      }
    });
    alert("orderID"+orderID);
    // alert("modifyinfo"+modifyinfo.address.area+modifyinfo.address.detail+modifyinfo.address.name+modifyinfo.address.tel + modifyinfo.dispatchCenter + modifyinfo.notes);
    alert(method);
  }
  /* listen if form info changed. S*/
  $(".editable").change(function(){
  	modify_flag = true;
  });

  /* click check button*/


  $("button#check").click(function() {


    if (flag){
    
    $.post(
      "/orderdetail",
      {
      	/* Data form description:
		   1. area, dispatch -- value
		   2. Is textarea form - text?
		   3. TODO! address.xxx right?
      	*/
      	address: {
      		//area: $("#area").value(),
      		detail: $("#detailOfLoc").text(),
        	name: $("#username").text(),
        	tel: $("#usertel").text()
        },
        //dispatchCenter: $("#dispatch").value(),
        notes: $("#detailOfNotes").text()
      
      },
      function(data, status){
      	if(status == 'success'){
      	alert('get data status is success!');
      	$.get("/unprocessed");
      	}
      });
	}
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
