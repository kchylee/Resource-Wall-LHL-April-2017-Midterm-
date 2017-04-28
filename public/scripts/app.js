
// jquery document ready
$(() => {

  // ajax call to api/users. Adds DIVs to index.ejs
  // This example csn be used later to load the home page.
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.first_name).appendTo($("body"));
    }
  });
  //Fills drop down menu with category options
  $.ajax({
      method: "GET",
      url: "/api/category",
  }).done((category) => {
    for (cat of category) {
      $("<option>").text(cat.cat_name).appendTo($("body").find("select"));
    }
  });

  // Resource functions.
  const getResources = () => {
    console.log("I'm a placeholder for a function.");
  }

  const insertResource = (formData) => {
    $.ajax({
      method: "POST",
      url: "/api/resources",
      data: formData,
      success: function (data, status, obj) {
        console.log("status: ", status);
        console.log("object: ", obj);
        console.log("data: ", data);
        },
        error: function (obj1, e, obj2) {
          console.log(e);
        }

    });
  }

  // Insert resource. Catches the event from a form and inserts data in the DB
  let $insertResourceForm = $('#insert-resource');
  $insertResourceForm.on("submit", (event) => {
    event.preventDefault();
    //validate content here: URL, title and description.


    //All good after validation? then invoke the insertion, pass the form data.
    insertResource($(this).serialize());
  })  // ends insertResourceForm.on

  const addComment = (formData) => {
    $.ajax({
      method: "POST",
      url: "/api/comments",
      data: string,
      success: function(userId, resID, text){
        knex('comments').insert({user_id: userId, resource_id: resID, comment: text});
      }
    })
  }







// Ends jquery document ready.
});
