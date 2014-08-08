$('a.question_orderID').click(function(){
  var orderID = $('a.question_orderID > span').text();
  $.post('/orderdetail',
  {
    orderID : orderID
  },
  function(data,status){

  });
});


(function unprocessed_post(){

  var m_username;
  var m_usertel;
  var m_area;
  var m_detailOfLoc;
  var m_detailOfNotes;

  $("#username").change(function(){
    m_username = $(this).text();
  });

  $("#usertel").change(function(){
    m_usertel = $(this).text();
  });

  $("#area").change(function(){
    m_area = $(this).value();
  });

  $("detailOfLoc").change(function(){
    m_detailOfLoc = $(this).text();
  });

  $

  /* click check button*/

  $("button#check").click(function() {

    
    $.post(
      "dongdong_background_file",
      {
        address.name: m_username,
        address.tel: m_usertel
      },

      function(){
        $.get(
          "dongdong_background_file",
          function(data){
            $("#orderID").text(order.orderID);
          });        
      });
  });

});


/*
  $.post(
    'dongdong_background_file',
    DATA,
    function(data, status){
      $('#username').html(data);
      SHOW()
    },
    "text";
  );