$(function(){

  // var modify_flag = false;
  var username_maxLength = 5;
  var addressDetail_maxLength = 50;
  var notes_maxLength = 50;
  var searchorder_inputnum_maxLength = 15;

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

/*==========================unprocessed begin==================*/
   /* listen if form info changed. S*/
  // $(".editable").change(function(){
  //   modify_flag = true;
  // });

  function orderProcess(method){
    $('span.inputrequired,span.formaterror').hide();

    var orderID = $('span#orderID').text();
    var modifyinfo = {
        address: {
          area: $("select#order_address_area option:selected").text(),
          detail: $("#order_address_detail").val(),
          name: $("#order_username").val(),
          tel: $("#order_usertel").val()
        },
        dispatchCenter:$("select#dispatch option:selected").text(),
        notes: $("textarea#order_note").val() + ($("input[name = 'reasonoRadios']:checked",'div#reason_radios').val()||"")
                        + $('textarea#unprocessorder_delete_note').val()
      };

    var satify = true;

    nameverify = usernameVertify(modifyinfo.address.name);
    telverify = usertelVertify(modifyinfo.address.tel);
    areaverify = addressAreaVertify(modifyinfo.address.area);
    detailverify = addressDetailVertify(modifyinfo.address.detail);
    noteverify = noteVertify(modifyinfo.notes);
    dispatchverify = dispatchCenterVertify(modifyinfo.dispatchCenter);

    if(nameverify != 0){
      satify = false;
      if(nameverify == -1){
         $('input#order_username').nextAll('span.inputrequired').show();
      }else if(nameverify == 1){
       $('input#order_username').nextAll('span.formaterror').show();
      }
    }
    if(telverify != 0){
      satify = false;
      if(telverify == -1){
         $('input#order_usertel').nextAll('span.inputrequired').show();
      }else if(telverify == 1){
       $('input#order_usertel').nextAll('span.formaterror').show();
      }
    }
    if(areaverify != 0){
      satify = false;
      $('select#order_address_area').nextAll('span.inputrequired').show();
    }
    if(detailverify != 0){
      satify = false;
      if(detailverify == -1){
        $('textarea#order_address_detail').nextAll('span.inputrequired').show();
      }else if(detailverify == 1){
        $('textarea#order_address_detail').nextAll('span.formaterror').show();
      }
    }
    if(noteverify != 0){
      satify = false;
      $('textarea#order_note').siblings('span.formaterror').show();
    }
    if(dispatchverify != 0){
      satify = false;
      $('select#order_dispatch').siblings('span.inputrequired').show();
    }
    /*if(!noteVertify(modifyinfo.notes)){
      $('textarea#order_note').val("");
      $('textarea#unprocessorder_delete_note').val("");
      if($("input[name = 'reasonoRadios']:checked",'div#reason_radios').length != 0){
        $("input[name = 'reasonoRadios']:checked",'div#reason_radios').attr('checked',false);
      }
    }*/
    if(!satify){
      alert("提交的内容不符合条件！");
      return;
    }else{
      var postData = {
        orderID : orderID,
        modifyinfo : modifyinfo,
        method : method
      };

      $.post("/unprocessed",postData,function(data,status){
        if(status == 'success' && data.code == 'ok'){
          location.reload();
        }else{
          alert('确认订单出错,重新操作!');
        }
      });
    }
  }

  $("button#unprocessedorder_confirm").click(function() {
    orderProcess('confirm');
	});

  $("button#unprocessorder_delete_confirm").click(function(){
    orderProcess('delete');
  });

  $("button#unprocessedorder_wait").click(function(){
    orderProcess('wait');
  });
/*==========================unprocessed end==================*/

/*========================neworder begin=====================*/
  function createOrder(){
    $('span.inputrequired,span.formaterror').hide();
    var username =   $('input#order_username').val();
    var usertel = $('input#order_usertel').val();
    var area = $('select#order_address_area option:selected').text();
    var detail = $('textarea#order_address_detail').val();
    var notes = $('textarea#order_note').val();
    var dispatchCenter = $('select#order_dispatch option:selected').text();

    var wines =[];
    var winerows = $('tr.order_wineinfo');
    var wineinfo_right = true;
    for(var i = 0;i < winerows.length;i++){
      if($(winerows[i]).find('select.winedescribe option:selected').val().length != 0){
        var wineinfo = {
          id : $(winerows[i]).find('select.winedescribe option:selected').val(),
          wechatPrice : Number($(winerows[i]).find('select.winewechatprice option:selected').val()),
          number : Number($(winerows[i]).find('input.winenumber').val())
        };

        wines.push(wineinfo);
      }
    }

    //begin vertify
    var satify = true;

    nameverify = usernameVertify(username);
    telverify = usertelVertify(usertel);
    areaverify = addressAreaVertify(area);
    detailverify = addressDetailVertify(detail);
    noteverify = noteVertify(notes);
    dispatchverify = dispatchCenterVertify(dispatchCenter);
    winesverify = winesInfoVerify(wines);

    if(nameverify != 0){
      satify = false;
      if(nameverify == -1){
        $('input#order_username').nextAll('span.inputrequired').show();
      }else if(nameverify == 1){
        $('input#order_username').nextAll('span.formaterror').show();
      }
    }
    if(telverify != 0){
      satify = false;
      if(telverify == -1){
        $('input#order_usertel').nextAll('span.inputrequired').show();
      }else if(telverify == 1){
        $('input#order_usertel').nextAll('span.formaterror').show();
      }
    }
    if(areaverify != 0){
      satify = false;
      $('select#order_address_area').nextAll('span.inputrequired').show();
    }
    if(detailverify != 0){
      satify = false;
      if(detailverify == -1){
        $('textarea#order_address_detail').nextAll('span.inputrequired').show();
      }else if(detailverify == 1){
        $('textarea#order_address_detail').nextAll('span.formaterror').show();
      }
    }
    if(noteverify != 0){
      satify = false;
      $('textarea#order_note').siblings('span.formaterror').show();
    }
    if(dispatchverify != 0){
      satify = false;
      $('select#order_dispatch').siblings('span.inputrequired').show();
    }
    if(winesverify != 0){
      satify = false;
      if(winesverify == -1){
        $('li#wineinfo_head>span.inputrequired').show();
      }else{
        $('li#wineinfo_head>span.formaterror').show();
      }
    }


    if(!satify){
      alert("提交订单内容不满足条件！");
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
      if(status == 'success' && data.code == 'ok'){
          alert("创建订单成功！");
          location.reload();
      }else{
          alert('提交订单出错,请重新提交!');
      }
    });
  }
  }

  $('button#order_wine_add').click(function(){
    var insert_tr = $('tr.order_wineinfo').first().clone();
    insert_tr.find('option.hidden_option').attr('selected','selected').end().find('input.winenumber').val("");
    $('tbody.all_wineinfo').append(insert_tr);
    $('tbody.all_wineinfo').children().last().find('select.winedescribe').focus();
  });


  $("button#neworder_confirm").click(createOrder);


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

/*========================neworder end=====================*/


/*============searchorder begin======================*/
$('button#searchorder_search').click(function(){
  var searchmethod = $("input[name='searchorder_searchmethod']:checked","div#searchorder_methodselect").val();
  var inputnumber = $("input[name='searchorder_inputnumber']").val();
  if(!searchorderInputVertify(searchmethod,inputnumber)){
    alert('请输入正确的订单号或者订单联系电话');
  }else{
    $.post('/search',{
      searchmethod : searchmethod,
      inputnumber : inputnumber
    },function(data,status){
      if(status == 'success'){
        $('div#searchorder_result').append(data);
      }else{
        alert("提交查询出错,请重新提交！");
      }
    });
  }
});
/*============searchorder end======================*/

/*=============vertifymethod begin=======================*/
 function usernameVertify(username){
    return username.length == 0 ? -1 :(username.length <= username_maxLength ? 0 : 1);
  }

  function usertelVertify(usertel){
    var phoneregex = /^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/;
    var landlineregex = /^(\d{3}-?\d{7,8})|(\d{4}-?\d{7,8})$/;
    var landlineregex_noprex = /^\d{7,8}$/;
    return usertel.length == 0 ? -1:(phoneregex.test(usertel) || landlineregex.test(usertel)||landlineregex_noprex.test(usertel) ? 0 :1);
  }

  function addressDetailVertify(detail){
    return detail.length == 0 ? -1 :(detail.length <= addressDetail_maxLength ? 0 : 1);
  }

  function addressAreaVertify(area){
    return area.length == 0 ? -1 : 0;
  }

  function dispatchCenterVertify(dispatchCenter){
    return dispatchCenter.length == 0 ? -1 : 0;
  }

  function noteVertify(notes){
    return notes.length > notes_maxLength ? -1 : 0;
  }

  function winesInfoVerify(wines){
    if(wines.length == 0){
      return -1;
    }
    for(var i = 0;i < wines.length;i++){
      if(isNaN(wines[i].number) || Number(wines[i].number)%1 !== 0 || Number(wines[i].number) <1){
        return 1;
      }
    }
    return 0;
  }

  function searchorderInputVertify(method,inputnumber){
    return method == 'phonenum' ? usertelVertify(inputnumber) :
     (inputnumber.length > 0 && inputnumber.length <= searchorder_inputnum_maxLength);
  }
/*=============vertifymethod end=======================*/
});
