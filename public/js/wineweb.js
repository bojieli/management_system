$(function(){

  // var modify_flag = false;
  var username_maxLength = 5;
  var addressDetail_maxLength = 50;
  var notes_maxLength = 50;
  var searchorder_inputnum_maxLength = 16;

  var deletereason_maxLength = 56;
  //var flag_deleteinfo = false;

  function getOrderDetail(orderID){
    $.post('/orderdetail',
    {
      orderID : orderID
    },
    function(data,status){
      if(status == 'success'){
        //populate data
        $('div#detail_modal div.modal-body').html(data);
        $('div#detail_modal').modal('show');

        if($('div#unprocess_alert_delete').length > 0){
          $('div#unprocess_alert_delete').css('z-index',2000);
        }
        if($('div#unship_alert_delete').length > 0){
          $('div#unship_alert_delete').css('z-index',2000);
        }
        if($('div#ship_alert_delete').length > 0){
          $('div#ship_alert_delete').css('z-index',2000);
        }
      }else{
        $('div#detail_modal div.modal-body').text('查找订单出错');
        $('div#detail_modal').modal('show');
      }
    });
  }

  $(document).on('click','a.urgent-unprocess,a.urgent-processed',function(){
    var orderID = $(this).children('span.urgent_orderID').text();
    getOrderDetail(orderID);
  });

  $(document).on('click','li.order_abstract_item',function(){
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
    var domParent = $("div#unprocess_panel");

    var orderID = domParent.find('span.orderID').text();
    var areaDOM = domParent.find("select.order_address_area option:selected");
    var detailDOM = domParent.find("textarea.order_address_detail");
    var nameDOM = domParent.find("input.order_username");
    var telDOM = domParent.find("input.order_usertel");
    var dispatchDOM = domParent.find("select.order_dispatch option:selected");
    var noteDOM = domParent.find("textarea.order_note") ;

    var modifyinfo = {
        address: {
          area: areaDOM.text(),
          detail: detailDOM.val(),
          name: nameDOM.val(),
          tel: telDOM.val()
        },
        dispatchCenter: dispatchDOM.text(),
        notes: noteDOM.val()
      };
    var deletereason = "";
    if(method == 'delete'){
      deletereason = (domParent.next().find("input[name = 'reasonoRadios']:checked").val()||"")
                        + domParent.next().find('textarea.delete_note').val();
    }

    nameverify = usernameVertify(modifyinfo.address.name);
    telverify = usertelVertify(modifyinfo.address.tel);
    areaverify = addressAreaVertify(modifyinfo.address.area);
    detailverify = addressDetailVertify(modifyinfo.address.detail);
    noteverify = noteVertify(modifyinfo.notes);
    dispatchverify = dispatchCenterVertify(modifyinfo.dispatchCenter);

    var satify = true;

    if(nameverify != 0){
      satify = false;
      if(nameverify == -1){
        nameDOM.nextAll('span.inputrequired').show();
      }else if(nameverify == 1){
        nameDOM.nextAll('span.formaterror').show();
      }
    }
    if(telverify != 0){
      satify = false;
      if(telverify == -1){
        telDOM.nextAll('span.inputrequired').show();
      }else if(telverify == 1){
        telDOM.nextAll('span.formaterror').show();
      }
    }
    if(areaverify != 0){
      satify = false;
      areaDOM.nextAll('span.inputrequired').show();
    }
    if(detailverify != 0){
      satify = false;
      if(detailverify == -1){
        detailDOM.nextAll('span.inputrequired').show();
      }else if(detailverify == 1){
        detailDOM.nextAll('span.formaterror').show();
      }
    }
    if(noteverify != 0){
      satify = false;
      noteDOM.siblings('span.formaterror').show();
    }

    if(method == 'confirm'){//只有在确认订单那的时候必须选择快递中心
      if(dispatchverify != 0){
        satify = false;
        dispatchDOM.parent().siblings('span.inputrequired').show();
      }
    }

    if(method == 'delete'){
      var reasonvertify = deletereasonVertify(deletereason);

      if(reasonvertify != 0){
        satify = false;
      }else{
        modifyinfo.notes = modifyinfo.notes + deletereason;
      }
    }
    /*if(!noteVertify(modifyinfo.notes)){
      $('textarea#order_note').val("");
      $('textarea#unprocessorder_delete_note').val("");
      if($("input[name = 'reasonoRadios']:checked",'div#reason_radios').length != 0){
        $("input[name = 'reasonoRadios']:checked",'div#reason_radios').attr('checked',false);
      }
    }*/
    if(!satify){
      if(method == 'delete'){
        alert('请选择删除原因或填写其他信息，且长度不能超过50！');
      }else{
        alert("提交的内容不符合条件！");
      }
      return;
    }else{
      var postData = {
        orderID : orderID,
        modifyinfo : modifyinfo,
        method : method
      };

      $.post("/unprocessed",postData,function(data,status){
        if(status == 'success' && data.code == 'ok'){
          if(method == 'delete'){
            $("div#unprocess_alert_delete").modal('hide');
          }
          location.reload();
        }else{
          switch(method){
            case 'confirm':
              alert('确认订单出错,重新操作!');
              break;
            case  'delete':
              alert('删除订单出错,请重新尝试!');
              break;
            case 'wait':
              alert('稍后处理订单出错,请重新尝试!');
              break;
          }
        }
      });
    }
  }

  $(document).on('click',"button#unprocess_order_confirm",function(){
    orderProcess('confirm');
  });

  $(document).on('click',"button#unprocess_order_delete_confirm",function(){
    orderProcess('delete');
  });

  $(document).on('click',"button#unprocess_order_wait",function(){
    orderProcess('wait');
  });
/*==========================unprocessed end==================*/

/*========================neworder begin=====================*/

  function createOrder(){
    $('span.inputrequired,span.formaterror').hide();
    var domParent = $('div#new_panel');

    var username = domParent.find('input.order_username').val();
    var usertel = domParent.find('input.order_usertel').val();
    var area = domParent.find('select.order_address_area option:selected').text();
    var detail = domParent.find('textarea.order_address_detail').val();
    var notes = domParent.find('textarea.order_note').val();
    var dispatchCenter = domParent.find('select.order_dispatch option:selected').text();

    var wines =[];
    var winerows = domParent.find('tr.order_wineinfo');
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
        domParent.find('input.order_username').nextAll('span.inputrequired').show();
      }else if(nameverify == 1){
        domParent.find('input.order_username').nextAll('span.formaterror').show();
      }
    }
    if(telverify != 0){
      satify = false;
      if(telverify == -1){
        domParent.find('input.order_usertel').nextAll('span.inputrequired').show();
      }else if(telverify == 1){
        domParent.find('input.order_usertel').nextAll('span.formaterror').show();
      }
    }
    if(areaverify != 0){
      satify = false;
      domParent.find('select.order_address_area').nextAll('span.inputrequired').show();
    }
    if(detailverify != 0){
      satify = false;
      if(detailverify == -1){
        domParent.find('textarea.order_address_detail').nextAll('span.inputrequired').show();
      }else if(detailverify == 1){
        domParent.find('textarea.order_address_detail').nextAll('span.formaterror').show();
      }
    }

    if(noteverify != 0){
      satify = false;
      domParent.find('textarea.order_note').siblings('span.formaterror').show();
    }

    if(dispatchverify != 0){
      satify = false;
      domParent.find('select.order_dispatch').siblings('span.inputrequired').show();
    }
    if(winesverify != 0){
      satify = false;
      if(winesverify == -1){
        domParent.find('li.wineinfo_head>span.inputrequired').show();
      }else{
        domParent.find('li.wineinfo_head>span.formaterror').show();
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

  $('button#order_wine_delete').click(function(){
    if($('tr.order_wineinfo').length > 1){
      $(this).parent().prev().find('tr.order_wineinfo').last().remove();
    }
  });

  $("button#neworder_confirm").click(createOrder);


  $("button#neworder_delete").click(function(){
    var deleteconfirm = confirm("所有订单信息将被清空,确定删除？");
    if(deleteconfirm){
      location.reload();
    }
  });

  // $('input#username').change(function(){
  //   var username = $(this).val();
  //   if(username.length > username_maxLength){
  //     alert('用户名最大长度为5');
  //     $(this).val("");
  //   }
  // });

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

/*============unshiporder begin====================*/
$(document).on('click',"button#unship_order_delete_confirm",function(){
  var parentDOM = $('div#unship_panel');
  var orderID = parentDOM.find('span.orderID').text();
  var deletereason = (parentDOM.next().find("input[name = 'reasonoRadios']:checked").val()||"")
                        + parentDOM.next().find('textarea.delete_note').val();
  var reasonvertify = deletereasonVertify(deletereason);
  if(reasonvertify != 0){
    alert('请选择删除原因或填写其他信息，且长度不能超过50！');
  }else{
    $.post('/orderdelete',{
      orderID : orderID,
      notes : deletereason
    },function(data,status){
      if(status == 'success' && data.code =='ok'){
        $("div#unship_alert_delete").modal('hide');
        $('div#detail_modal').modal('hide');
        $('div#detail_modal div.modal-body').html("");
        location.reload();
      }else{
        alert("删除订单出错，请重新尝试！");
      }
    });
  }
});
/*============unshiporder end======================*/

/*============shiporder begin====================*/
$(document).on('click',"button#ship_order_delete_confirm",function(){
  var parentDOM = $('div#ship_panel');
  var orderID = parentDOM.find('span.orderID').text();
  var deletereason = (parentDOM.next().find("input[name = 'reasonoRadios']:checked").val()||"")
                        + parentDOM.next().find('textarea.delete_note').val();

  var reasonvertify = deletereasonVertify(deletereason);
  if(reasonvertify != 0){
    alert('请选择删除原因或填写其他信息，且长度不能超过50！');
  }else{
    $.post('/orderdelete',{
      orderID : orderID,
      notes : deletereason
    },function(data,status){
      if(status == 'success' && data.code =='ok'){
        $("div#ship_alert_delete").modal('hide');
        location.reload();
      }else{
        alert("删除订单出错，请重新尝试！");
      }
    });
  }
});
/*============shiporder end======================*/



/*=============vertifymethod begin=======================*/
 function usernameVertify(username){
    return username.length == 0 ? -1 :(username.length <= username_maxLength ? 0 : 1);
  }

  function usertelVertify(usertel){
    var phoneregex = /^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/;
    var landlineregex = /^(\d{3}-\d{7,8})|(\d{4}-\d{7,8})$/;
    return usertel.length == 0 ? -1:((phoneregex.test(usertel) || landlineregex.test(usertel)) ? 0 :1);
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
    return notes.length <= notes_maxLength ? 0 : -1;
  }
  function deletereasonVertify(reason){
    return reason.length == 0 ? -1 : (reason.length <= deletereason_maxLength ? 0 : 1);
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
    return method == 'phonenum' ? usertelVertify(inputnumber) == 0:
     (inputnumber.length > 0 && inputnumber.length <= searchorder_inputnum_maxLength);
  }
/*=============vertifymethod end=======================*/


/* AutoRefresh right sidebar Begin*/

setInterval(function(){
    $.post('/refresh',function(data,status){
      var li_undo = $("li.urgent-unprocess-template");
      var li_done = $("li.urgent-processed-template");

      if(status == 'success'){
        $('span#unprocessed_number').text(data.numberUnprocessed > 0 ? data.numberUnprocessed : "");
        $('span#numberquestion').text(data.numberQuestion > 0 ? data.numberQuestion : "");

        for(var i = 0;i < data.urgentprocess.length;i++){
          var addli_undo = li_undo.clone();
          addli_undo.find('span.question_id').text(data.urgentprocess[i].orderID);
          addli_undo.find('.question_description').text(data.urgentprocess[i].notes);
          addli_undo.css('display', 'list-item');
          addli_undo.removeClass('urgent-unprocess-template');
          $('ul#danger_todo').append(addli_undo);
        }

        for(var i = 0;i < data.urgentprocessed.length;i++){
          var addli_done = li_done.clone();
          addli_done.find('.question_id').text(data.urgentprocessed[i].orderID);
          addli_done.find('.question_description').text(data.urgentprocessed[i].notes);
          addli_done.css('display', 'list-item');
          addli_done.removeClass('urgent-processed-template');
          $('ul#danger_done').append(addli_done);
        }

      };
    });
}, 30000);



/* AutoRefreshTime right sidebar End*/

/* */
});
