$(() => {
  $.ajax({
    method: "POST",
    url: "/api/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.first_name).appendTo($("body"));
    }
  });;
});
