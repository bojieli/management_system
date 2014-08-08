$('a.question_orderID').click(function(){
  var orderID = $('a.question_orderID > span').text();
  $.post('/orderdetail',
  {
    orderID : orderID
  },
  function(data,status){

  });
});