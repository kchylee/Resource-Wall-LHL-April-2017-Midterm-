

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
      $('button[name="resource_id"]').find('.fa-heart').css('color', 'red'); //NEEDS WORK; heart should be highlighted according to Like table
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

  //Like button
  $('button[name="like"]').on('click', () => {
    event.preventDefault();
    addLike();
  })

  //Show comment box
  $('button[name="show_comment_field"]').on('click', () => {
    event.preventDefault();
    $('#add_comment').slideToggle();
  })

  //Submit comment
  $('#add_comment').on('submit', (event) => {
    event.preventDefault();
    addComment();
  })
  //Add rating
  $('button[name="star"]').on('click', (event) => {
    event.preventDefault();
    addRating($('button[name="star"]').val());
  }


  //helpers

  const validateURL = (url) => {
    let res = new RegExp('(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})', 'i');
    return res.test(url);
  }

  // Resource functions.
  const getUserResources = (userID) => {
    $.ajax({
      method: "GET",
      url: `/api/resources/json/${userID}`
    })
    .done( (data) => {
      //console.log("DATA from getUserResources: ", data);
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
  getUserResources(1);

  const getResourceToUpdate = (id) => {
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

  // Insert resource. Catches the event from a form and inserts data in the DB

  const $insertResourceForm = $('#insert-resource');
  $insertResourceForm.on('submit', (event) => {

    event.preventDefault();
    //validate content here: URL, title and description.
    if (( validateURL($('#insert-resource')[0].elements.url.value) === false ) || ( $('#insert-resource')[0].elements.title.value === "" )) {
      console.log("Did not pass validation");
    } else {
      //All good after validation? then invoke the insertion, pass the form data.
      insertResource($('#insert-resource').serialize());
    }


  });  // ends insertResourceForm.on


// Ends jquery document ready.
});
