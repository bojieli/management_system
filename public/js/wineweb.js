$(function(){

  var modify_flag = false;
  var username_maxLength = 5;
  var addressDetail_maxLength = 50;
  var notes_maxLength = 50;

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
          name: $("#order_username").val(),
          tel: $("#order_usertel").val()
        },
        dispatchCenter:$("select#dispatch option:selected").text(),
        notes: $("#detailOfNotes").val() + ($("input[name = 'reasonoRadios']:checked",'div#reason_radios').val()||"")
                        + $('textarea#unprocessorder_delete_note').val()
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

  $("button#unprocessedorder_confirm").click(function() {
    orderProcess('confirm');
	});

  $("button#unprocessorder_delete_confirm").click(function(){
    orderProcess('delete');
  });

  $("button#unprocessedorder_wait").click(function(){
    orderProcess('wait');
  });

  $('button#order_wine_add').click(function(){
    var insert_tr = $('tr.order_wineinfo').first().clone();
    insert_tr.find('option.hidden_option').attr('selected','selected').end().find('input.winenumber').val("");
    $('tbody.all_wineinfo').append(insert_tr);
    $('tbody.all_wineinfo').children().last().find('select.winedescribe').focus();
  });
  /*new order*/
  $("button#neworder_confirm").click(function(){
    var username =   $('input#order_username').val();
    var usertel = $('input#order_usertel').val();
    var area = $('select#order_address_area option:selected').text();
    var detail = $('textarea#order_address_detail').val();
    var notes = $('textarea#order_note').val();
    var dispatchCenter = $('select#order_dispatch option:selected').text();
    var alertString = "";
    //begin vertify
    if(!usernameVertify(username)){
      alertString = alertString + "用户名不能为空,且长度应小于5\n";
      $('input#order_username').val("");
    }
    if(!usertelVertify(usertel)){
      alertString = alertString + "联系电话不能为空或格式不正确\n";
      $('input#order_usertel').val("");
    }
    if(!addressDetailVertify(detail)){
      alertString = alertString + "地址详情不能为空,且长度应小于50\n";
      $('textarea#order_address_detail').val("");
    }
    if(!noteVertify(notes)){
       alertString = alertString + "备注信息长度应小于50\n";
      $('textarea#order_note').val("");
    }

    var wines =[];
    var winerows = $('tr.order_wineinfo');
    var wineinfo_right = true;
    for(var i = 0;i < winerows.length;i++){
      alert('wineinfo'+$(winerows[i]).find('input.winenumber').val());
      var wineinfo = {
        id : $(winerows[i]).find('select.winedescribe option:selected').val(),
        wechatPrice : Number($(winerows[i]).find('select.winewechatprice option:selected').val()),
        number : Number($(winerows[i]).find('input.winenumber').val())
      };
      if(!wineinfoVertify(wineinfo)){
        if(wineinfo_right){
         alertString = alertString + "酒的数量最少为1,且为整数\n";
        }
        wineinfo_right = false;
        $(winerows[i]).find('input.winenumber').val("");
      }else{
          wines.push(wineinfo);
      }
    }

    if(alertString.length > 0){
      alert(alertString);
      return;
    }else{
      var postData = {
        address : {
          area : area,
          tel : usertel,
          name : username,
          detail : detail
        },
        notes : notes,
        dispatchCenter : dispatchCenter,
        shopOnce : wines
      }
      alert(area+usertel+username+detail+notes+dispatchCenter+wines);
      $.post('/neworder',postData,function(data,status){
      if(status == 'success'){
        if(data.code == 'ok'){
          location.reload();
        }else{
          alert('提交订单出错,请重新提交!');
        }
      }
    });
  }
});


  $('input#username').change(function(){
    var username = $(this).val();
    if(username.length > username_maxLength){
      alert('用户名最大长度为5');
      $(this).val("");
    }
  });

  /* listen E*/
  $('tbody.all_wineinfo').on('change','select.winedescribe',function(){
    var selectedIndex = $(this).children('option:selected').index();
    $(this).parent().next().children('select.winewechatprice').children().eq(selectedIndex).siblings().attr('disabled',true).end().attr('selected','selected');
  });
  $('tbody.all_wineinfo').on('blur','select.winedescribe',function(){
    $(this).parent().parent().find('input.winenumber').focus();
  });

  function usernameVertify(username){
    if(username.length > username_maxLength || username.length <=0){
      return false;
    }else{
      return true;
    }
  }

  function usertelVertify(usertel){
    var phoneregex = /^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/;
    var landlineregex = /^(\d{3}-?\d{7,8})|(\d{4}-?\d{7,8})$/;
    var landlineregex_noprex = /^\d{7,8}$/;
    return phoneregex.test(usertel) || landlineregex.test(usertel)||landlineregex_noprex.test(usertel);
  }

  function addressDetailVertify(detail){
    if(detail.length > addressDetail_maxLength || detail.length <=0){
      return false;
    }else{
      return true;
    }
  }

  function noteVertify(notes){
    if(notes.length > notes_maxLength){
      return false;
    }else{
      return true;
    }
  }

  function wineinfoVertify(wineinfo){
    if(isNaN(wineinfo.number)){
      return false;
    }
    var number = Number(wineinfo.number);
    return typeof number == 'number' && isFinite(number)
                  && number % 1 === 0 && number >=1;
  }

});
