$(document).ready(function(){
  // control delete student form
  $('#delete-student-confirm').on('input', function(e){
    if($(this).attr('data-name') === $(this).val()) {
      $('#delete-student-btn').removeClass('d-none');
      $('#delete-student-comment-error').addClass('d-none');
      $('#delete-student-comment-success').removeClass('d-none');
    } else {
      $('#delete-student-btn').addClass('d-none');
      $('#delete-student-comment-error').removeClass('d-none');
      $('#delete-student-comment-success').addClass('d-none');
    }
  })

  $('#year-option-dropdown').ready(function(){
    var currentYear = new Date().getFullYear();
    var studentId = $('#year-option-dropdown').attr('data-student-id');
    for(var i = currentYear; i > 2017; i-- ) {
      var link = $('<a>').addClass('dropdown-item').attr('href', '/students/' + studentId + '?year=' + i).text(i);
      $('#year-option-dropdown').append(link);
    }
  })
})