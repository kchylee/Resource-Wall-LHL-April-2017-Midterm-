
// jquery document ready
$(() => {

  //Fills drop down menu with category options
  $.ajax({
      method: "GET",
      url: "/api/category",
  }).done((category) => {
    for (cat of category) {
      $(`<option value=${cat.id}>`).text(cat.cat_name).appendTo($("body").find("select"));
    }
  });

  //Searches database by matching queries with resource titles and description
  //and then appends search result to body
  const searchRes = (searchFormData) => {
    console.log(searchFormData);
    $.ajax({
      method: "GET",
      url: `/api/search/${searchFormData}`,
    }).done( (result) => {
      $("<h2>").text("Results:").appendTo($("#search_results"));
      result.rows.forEach( (row) => {
        $("<div>").text(row.title).appendTo($("#search_results"));
      })
    })
      .fail( (e) => {
        console.error(e);
      })
  }

  //Sends an ajax POST request to write to likes table in the database
  //and then sets the Font Awesome color to red
  const addLike = () => {
    $.ajax({
      method: "POST",
      url: "/api/like",
      data: {
        userID: $('input[name="userID"]').val(),
        resourceID: $('.resourceID').val()
      }
    }).done( (result) => {
      console.log(result);
      $('.resourceID').siblings('.fa-heart').css('color', 'red');
    })
  }

  //Sends an ajax POST request to delete from likes table in the database
  //and then executes showLiked() to update the colour of hearts
  const unLike = () => {
    $.ajax({
      method: "POST",
      url: "/api/unlike"
    }).done( () => {
      showLiked();
    })
  }

  //Sends an ajax POST request to write to comments table in the database
  //and then resets and hides input field
  //followed by appending comments to modal window
  const addComment = () => {
    $.ajax({
      method: "POST",
      url: "/api/comment",
      data: $("#add_comment").serialize()
    }).done( (result) => {
      $('input[name="comment"]').trigger('reset');
      $('#add_comment').slideUp();
      $('<div>').text(result.rows[0].comment).appendTo($('.modal-body'));
    })
  }

  //Sends an ajax POST request to write to ratings table
  //and then highlights stars
  const addRating = (rating) =>{
    $.ajax({
      method: "POST",
      url: "/api/rating",
      data: {
        userID: $('input[name="userID"]').val(),
        resourceID: $('.resourceID').val(),
        rating: $('.star_rating').val()
      }
    }).done( (result) => {
      $(`.star_rating .star value="${result[0].rating}"] ~ button:before`).css('color', 'gold');
    })
  }

  //Searches database for resources
  $('#search').on('submit', () => {
    event.preventDefault();
    searchRes($("#query").val());
  });

  //Toggle search field
  $('#searchToggle').on('click', () => {
    event.preventDefault();
    $('#search').slideToggle();
  });

  //Like button
  $('.like').on('submit', (event) => {
    event.preventDefault();
      addLike();
  });

  //Show comment box
  $('.show_comment_field').on('click', () => {
    event.preventDefault();
    $('#add_comment').slideToggle();
  });

  //Submit comment
  $('#add_comment').on('submit', (event) => {
    event.preventDefault();
    addComment();
  });

  //Add rating
  $('.star_rating').on('submit', (rating) => {
    event.preventDefault();
    addRating(rating);
  });

  //Coded by Carlos
  //Helper functions
  const validateURL = (url) => {
    let res = new RegExp('(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})', 'i');
    return res.test(url);
  }

  // runs js searcher (jquery plugin)
  $("#resource-container").searcher({
      itemSelector: ".resource",
      textSelector: "div",
      inputSelector: "#resourcesearchinput",
      toggle: function(item, containsText) {
          // use a typically jQuery effect instead of simply showing/hiding the item element
          if (containsText)
              $(item).fadeIn();
          else
              $(item).fadeOut();
      }
  });

  // runs js searcher (jquery plugin)
  $("#user-resource-container").searcher({
      itemSelector: ".resource",
      textSelector: "div",
      inputSelector: "#resourcesearchinput",
      toggle: function(item, containsText) {
          // use a typically jQuery effect instead of simply showing/hiding the item element
          if (containsText)
              $(item).fadeIn();
          else
              $(item).fadeOut();
      }
  });


  // Helpers end

  // Resource functions.
  const getUserResources = (userID) => {
    $.ajax({
      method: "GET",
      url: `/api/resources/json/${userID}`
    })
    .done( (data) => {

      let colsPerRow = 4;
      let numOfRowsToCreate = Math.ceil(data.length / colsPerRow);
      let arrIndex = 0;
      for (let rows = 1; rows <= numOfRowsToCreate; rows++) {

        $resourcerow = $("<div>").addClass("row");

        for (let cols = 1; cols <= colsPerRow; cols++) {
          if (data[arrIndex] === undefined) {
            break;
          }
          $resourcecol = $("<div>").addClass("col-xs-2 col-md-3").appendTo($resourcerow);
          $resourcedata = $("<div>").addClass("resourcedata").appendTo($resourcecol);

          $resource = $("<div>").addClass("resource")
                      .attr({
                        'data-toggle': 'modal',
                        'data-target': '#update-resource-modal',
                        'data-id': data[arrIndex].id,
                        id: data[arrIndex].id
                      }).appendTo($resourcedata)

          $resource.append($("<div>").addClass("title").text(data[arrIndex].title));
          $resource.append($("<div>").addClass("url").text(data[arrIndex].url));
          $resource.append($("<div>").addClass("description").text(data[arrIndex].description));
          arrIndex += 1
        }
        $("#user-resource-container").append($resourcerow);
      }

    })
    .fail( (error) => {
      console.error(error);
    })
  };
  getUserResources($("#nav-container-div")[0].dataset.userid);

  const getResourceToUpdate = (id) => {
    $.ajax({
      method: "GET",
      url: `/api/resources/${id}`
    })
    .done( (data) => {
      var modal = $('#update-resource-modal');
      modal.find('#title').val(data[0].title)
      modal.find('#url').val(data[0].url)
      modal.find('#description').val(data[0].description)
    })
    .fail( (error) => {
      console.error(error);
    })
  };

  const insertResource = (formData) => {
    $.ajax({
      method: "POST",
      url: "/api/resources",
      data: formData
    })
    .done( (response) => {
      //console.log("Response from insert: ", response);
    })
    .fail( (e) => {
      console.error("fail from insert: ", e);
    })
  };

  const deleteResource = (formData) => {
    $.ajax({
      method: "DELETE",
      url: "/api/resources",
      data: formData
    })
    .done( (response) => {

    })
    .fail( (e) => {
      console.error("fail from delete: ", e);
    })

  };

  const getAllResources = () => {
    $.ajax({
      method: "GET",
      url: "/api/resources"
    })
    .done( (data) => {

      let colsPerRow = 4;
      let numOfRowsToCreate = Math.ceil(data.length / colsPerRow);
      let arrIndex = 0;
      for (let rows = 1; rows <= numOfRowsToCreate; rows++) {

        $resourcerow = $("<div>").addClass("row");

        for (let cols = 1; cols <= colsPerRow; cols++) {
          if (data[arrIndex] === undefined) {
            break;
          }
          $resourcecol = $("<div>").addClass("col-xs-2 col-md-3").appendTo($resourcerow);
          $resourcedata = $("<div>").addClass("resourcedata").appendTo($resourcecol);

          $resource = $("<div>").addClass("resource")
                      .attr({
                        'data-toggle': 'modal',
                        'data-target': '#resourceModal',
                        'data-id': data[arrIndex].id,
                        id: data[arrIndex].id
                      }).appendTo($resourcedata)

          $resource.append($("<div>").addClass("title").text(data[arrIndex].title));
          $linked = $("<div>").addClass("url").text(data[arrIndex].url);
          $link = $('<a>').attr("href", data[arrIndex].url).attr("target", "_blank").append($linked);
          $resource.append($link);
          $resource.append($("<div>").addClass("description").text(data[arrIndex].description));
          $resource.append($("<div>").addClass("handle").text('by @' + data[arrIndex].handle));
          //$resource.append($("<div>").addClass("stats").text("Loved by:"));
          arrIndex += 1
        }
        $("#resource-container").append($resourcerow);
      }
    })
    .fail( (error) => {
      console.error(error);
    })
  };
  getAllResources();

  // Insert resource. Catches the event from a form and inserts data in the DB
  $('#insert-resource').on('submit', (event) => {
    event.preventDefault();
    //validate content here: URL, title and description.
    if (( validateURL($('#insert-resource')[0].elements.url.value) === false ) || ( $('#insert-resource')[0].elements.title.value === "" )) {
      console.log("Did not pass validation");
    } else {
      //All good after validation? then invoke the insertion, pass the form data.
      insertResource($('#insert-resource').serialize());
    }
  });  // ends insertResourceForm.on

  // gets all details of a single resource and updates the modal window.
  const getResourceDeetsForModal = (id) => {
    $.ajax({
      method: "GET",
      url: `/api/resources/${id}`
    })
    .done( (data) => {
      var modal = $('#resourceModal');
      modal.find('.modal-title').text(data[0].title)
      modal.find('.modal-body h5').text(data[0].url)
      modal.find('.modal-body h6').text(data[0].description)
      modal.find('.resourceID').val(data[0].id)
    })
    .fail( (error) => {
      console.error(error);
    })
  };

  // Handles the modal displaying the details about the resource.
  $('#resourceModal').on('show.bs.modal', function (event) {
    let divResource = $(event.relatedTarget) // Button that triggered the modal
    let resourceID = divResource.data('id') // Extract info from data-* attributes
    // with the ID I can get the data from the db.
    // call the function that makes the ajax call to the route in the api. The function will update the modal elements.
    getResourceDeetsForModal(resourceID);
  });

  // Handles the modal that inserts a new resource.
  $('#new-resource-modal').on('show.bs.modal', function (event) {
    // call the function that makes the ajax call to the route in the api. The function will update the modal elements.
    insertResource();
  });

  // Handles the modal that updates a resource.
  $('#update-resource-modal').on('show.bs.modal', function (event) {
    let divResource = $(event.relatedTarget) // Button that triggered the modal
    let resourceID = divResource.data('id') // Extract info from data-* attributes
    // call the function that makes the ajax call to the route in the api. The function will update the modal elements.
    getResourceToUpdate(resourceID);
  })


  // End resources functions

// Ends jquery document ready.
});
