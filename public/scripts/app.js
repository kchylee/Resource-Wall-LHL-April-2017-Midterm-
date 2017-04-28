
// jquery document ready
$(() => {


  // Resource functions.
  const getUserResources = (userID) => {
    $.ajax({
      method: "GET",
      url: `/api/resources/json/${userID}`
    })
    .done( (data) => {
      //console.log("DATA from getUserResources: ", data);
    })
    .fail( (error) => {
      console.error(error);
    })
  };
  getUserResources(1);


  const getResource = (id) => {
    $.ajax({
      method: "GET",
      url: `/api/resources/${id}`
    })
    .done( (data) => {
      $("#update-form-title").val(data[0].title);
      $("#update-form-url").val(data[0].url);
      $("#update-form-description").val(data[0].description);
      $("#update-form-created_by").val(data[0].created_by);
      $("#update-form-resourceID").val(data[0].id);
    })
    .fail( (error) => {
      console.error(error);
    })
  };
  getResource(45);

  const insertResource = (formData) => {
    $.ajax({
      method: "POST",
      url: "/api/resources",
      data: formData
    })
    .done( (response) => {
      console.log("Response from insert: ", response);
    })
    .fail( (e) => {
      console.log("fail from insert: ", e);
    })
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
