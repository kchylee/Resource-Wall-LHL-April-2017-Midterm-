
// jquery document ready
$(() => {


  // Resource functions.
  function getResources () {
    console.log("I'm a placeholder for a function.");
  };

  const insertResource = (formData) => {
    $.ajax({
      method: "POST",
      url: "/api/resources",
      data: formData,
      success: function (data, status, obj) {
        //console.log("status: ", status);
        //console.log("object: ", obj);
        //console.log("data: ", data);
      },
      error: function (obj1, e, obj2) {
        console.log(e);
      }
    });
  };

  // Insert resource. Catches the event from a form and inserts data in the DB
  const $insertResourceForm = $('#insert-resource');
  $insertResourceForm.on("submit", (event) => {
    event.preventDefault();
    //validate content here: URL, title and description.


    //All good after validation? then invoke the insertion, pass the form data.
    insertResource($('#insert-resource').serialize());
  });  // ends insertResourceForm.on


// Ends jquery document ready.
});
