$(document).ready(function(){
  // sending ajax request to fetch student data with javascript
  $('#studentTable').DataTable({
      ajax: '/students/datatable',
      columns: [
        { data: "name" },
        { data: "school" },
        { data: "grade" },
        { data: "position" },
        { data: "more", searchable: false, sortable: false}, 
      ]
  });
})