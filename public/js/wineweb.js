$(document).ready(function(){


  var flag = 0;

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

  /* listen if form info changed. S*/

  $(".editable").change(function(){
  	flag = 1;
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
  });

  /* listen E*/
});
