$(document).ready(function(){

    // console.log("ARTICLES"+ articles)
$.getJSON("/articles", function(data) {
// // //     // console.log(data);
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
      }
    });

//     $.each(data, function(i, value){
//      $("#articles").append(`<p data-id= ${data[i]._id} ><br> ${data[i].title} <br> ${data[i].link}</p>`)
//      console.log(data)
//     });
// });

    

// $('#a').click(function(event) { 

//     var url = $(this).attr('href');
//     window.open(url,"_blank"); 
//     event.preventDefault(); 
// });
// $(document).ready(function(){
//     $("a").trigger("click");
//     var url = $(this).attr('href');
//     window.location=url;
// });
// $.getJSON("/articles", function(data) {
    $(document).on("click"), ".scrape", function(event){
        $.ajax("/api/scrape", {
            type: "GET",
            data: results
        }).then(function(){
            console.log("Scrape completed");
            location.reload();
        })
    }

$(document).on("click", ".btn-info", function(){
    console.log("HI")
    
    $("#notes").empty();
    const thisId = $(this).attr("data-id");
    console.log("THISID" + thisId)
// console.log(data[1]._id)
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    .then(function(data) {
        console.log(data);
        $("#notes").append("<h2>" + data.title + "</h2>");
        $("#notes").append("<input id='titleinput' name='title' >");
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        if (data.Note) {
            $("#titleinput").val(data.Note.title);
            $("#bodyinput").val(data.Note.body);
          }
        });
    });
    
    $(document).on("click", "#savenote", function() {
      var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
          title: $("#titleinput").val(),
          body: $("#bodyinput").val()
        }
      })
    .then(function(data){

        console.log(data);
        $("#notes").empty();
    })
    $("#titleinput").val("");
    $("#bodyinput").val("");
});
});