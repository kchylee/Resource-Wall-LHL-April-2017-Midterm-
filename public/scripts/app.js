
// jquery document ready
$(() => {


  // Resource functions.
  function getResources () {
    console.log("I'm a placeholder for a function.");
  };

  function insertResource (formData) {
    $.ajax({
      method: "POST",
      url: "/api/resources/",
      data: formData
    })
      .done((data, status, obj) => {
        console.log("status: ", status);
        console.log("object: ", obj);
        console.log("data: ", data);
        })
      .fail((obj1, e, obj2) => {
        console.log(e);
      })
  };

  // ajax call to api/users. Adds DIVs to index.ejs
  // This example csn be used later to load the home page.
    function displayUsers() {
    $.ajax({
      method: "GET",
      url: "/api/users/"
    }).done((users) => {
      for(user of users) {
        $("<div>").text(user.first_name).appendTo($("body"));
      }
    });
  };

  // Insert resource. Catches the event from a form and inserts data in the DB
  const $insertResourceForm = $('#insert-resource');
  $insertResourceForm.on("submit", (event) => {
    event.preventDefault();
    //validate content here: URL, title and description.
    console.log(event);

    //All good after validation? then invoke the insertion, pass the form data.
    insertResource($(this).serialize());
  });  // ends insertResourceForm.on

  displayUsers();

// Ends jquery document ready.
});
