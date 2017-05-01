
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

  const addLike = () => {
    $.ajax({
      method: "POST",
      url: "/api/like"
    }).done( () => {
      $('button[name="like"]').find('.fa-heart').css('color', 'red'); //NEEDS WORK; heart should be highlighted according to Like table
    })
  }

  const unLike = () => {
    $.ajax({
      method: "POST",
      url: "/api/unlike"
    }).done( () => {
      $('button[name="like"]').find('.fa-heart').css('color', 'black');
    })


  }

  const addComment = () => {
    $.ajax({
      method: "POST",
      url: "/api/comment",
      data: $("#add_comment").serialize()
    }).done( () => {
      $('input[name="comment"]').trigger('reset');
      $('#add_comment').slideUp();
    })
  }

  const addRating = (rating) =>{
    $.ajax({
      method: "POST",
      url: "/api/rating",
      data: rating
    }).done( (result) => {
      $(`.star_rating button[name="star" value="${result}"] ~ button:before`).css('color', 'gold');
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
    $('form #search').slideUp();
  });

  //Like button
  $('button[name="like"]').on('click', () => {
    event.preventDefault();
    if($('button[name="like"]').find('.fa-heart').css('color') === 'red'){
      unlike();
    }else{
      addLike();
    }
  });


  //Show comment box
  $('button[name="show_comment_field"]').on('click', () => {
    event.preventDefault();
    $('#add_comment').slideToggle();
  });

  //Submit comment
  $('#add_comment').on('submit', (event) => {
    event.preventDefault();
    addComment();
  });
  //Add rating
  $('button[name="star"]').on('click', (event) => {
    event.preventDefault();
    addRating($('button[name="star"]').val());
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


  // Helpers end

  // Resource functions.
  const getUserResources = (userID) => {
    $.ajax({
      method: "GET",
      url: `/api/resources/json/${userID}`
    })
    .done( (data) => {
      $.each(data, (index, arrvalue) => {
        $temprow = $("<tr>").attr("data-id", arrvalue.id).appendTo($("#table-resources"));
        $.each(arrvalue, (key, objvalue) => {
          $("<td>").text(objvalue).appendTo($temprow);
        })
      });

    })
    .fail( (error) => {
      console.error(error);
    })
  };

  const getResourceToUpdate = (id) => {
    $.ajax({
      method: "GET",
      url: `/api/resources/${id}`
    })
    .done( (data) => {
      var modal = $('#update-resource-modal');
      modal.find('#title').value(data[0].title)
      modal.find('#url').value(data[0].url)
      modal.find('#description').value(data[0].description)

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
          $resource.append($("<div>").addClass("url").text(data[arrIndex].url));
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
      modal.find('#resourceID').val(data[0].id)
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

  // Handles the modal that updates a new resource.
  $('#new-resource-modal').on('show.bs.modal', function (event) {
    let divResource = $(event.relatedTarget) // Button that triggered the modal
    let resourceID = divResource.data('id') // Extract info from data-* attributes
    // call the function that makes the ajax call to the route in the api. The function will update the modal elements.
    getResourceToUpdate(resourceID);
  })


  // End resources functions

// Ends jquery document ready.
});
