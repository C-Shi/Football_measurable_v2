$(document).ready(function() {
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
  // Ajax Request For Changing Role
  $('input.custom-control-input[type="checkbox"]').on('change', function(evt) {
    var input = $(this);
    var data = {};
    var isChecked = input.prop('checked')
    data[input.attr('name')] = isChecked;
    $.post({
      url: "/users/" + input.attr('data-user-id') + "/role/update?_method=PUT",
      data: data
    })
    .done(function(response) {
      console.log(response);
    })
    .fail(function(response, text, xhr) {
      var alert = $('<div>').addClass('alert alert-danger').attr('role', 'alert');
      switch (response.status) {
        case 403: 
          alert.html('<strong>Unauthorized: </strong> You Cannot Perform This Action With Your Current Role');
          break;
        case 400:
          alert.html('<strong>Bad Request: </strong> Server Cannot Parse Your Request');
          break;
        default: 
          alert.html('<strong>Internal Server Error: </strong>Unable to Update User Role');
      }
      setTimeout(function(){
        input.prop('checked', !input.prop('checked'));
        $('.container.flash').append(alert);
      }, 200);
      setTimeout(function(){
        alert.remove();
      }, 2000)
    })
  })

  // Wanring for disabled button
  $('.custom-switch').off('click').on('click', function(evt) {
    if($(this).children('input').prop('disabled')) {
      var alert = $('<div>').addClass('alert alert-info').attr('role', 'alert').html("<strong>Warning: </strong> Cannot change developer's role, or yourself");
      $('.container.flash').append(alert);
      setTimeout(() => {
        alert.remove();
      }, 2000);
    }
  })

  // initialize modal
  $('[data-toggle="modal"]').on('click', function(){
    var name = $(this).attr('data-user-name');
    var id = $(this).attr('data-user-id');
    // set the form user name
    $("#delete-user-name").text(name);
    // set the url
    $("#deleteUserModal form").attr('action', "/users/" + id + "/delete?_method=delete")
  })

  // check for correct name
  $('#deleteUserModal input').on('keyup', function() {
    if ($(this).val() == $("#delete-user-name").text()) {
      $('#delete-user-btn').removeClass('d-none');
    } else {
      $('#delete-user-btn').addClass('d-none');
    }
  })
})