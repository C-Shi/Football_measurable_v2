$(document).ready(function(){
  // logout handler
  $('#logout').on('click', function(e){
    e.preventDefault()
    $('#logout-form').submit()
  })
})