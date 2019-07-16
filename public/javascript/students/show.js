$(document).ready(function(){
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
})