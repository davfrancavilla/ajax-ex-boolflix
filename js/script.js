$(document).ready(function(){

    var source = $("#template").html();
    var template = Handlebars.compile(source);

    $("#search").click(function(){
        getMovies();
    });

    $("#movie-name").keydown(function (event) {
        if (event.which == 13 || event.keyCode == 13) {
            getMovies();
        }
    });


    // functions

    function getMovies() {
        $("#movies-list").empty();
        var movieName = $("#movie-name").val();
        if (movieName.length > 0) {
            $("#query").val("");
            $.ajax({
                url: "https://api.themoviedb.org/3/search/movie",
                method: "GET",
                data: {
                    api_key: "75a1a0a4142f1e4570128b8bfcc69bbf",
                    include_adult: "false",
                    language: "it-IT",
                    query: movieName
                },
                success: function (element) {
                    if (element.results.length == 0){
                        $("#movies-list").append("Nessun risultato");
                    } else {
                        for (var i = 0; i < element.results.length; i++) {
                            var movie = {
                                title: element.results[i].title,
                                originalTitle: element.results[i].original_title,
                                language: element.results[i].original_language,
                                rating: element.results[i].vote_average
                            }
                            var html = template(movie);
                            $("#movies-list").append(html);
                        };
                    }
                },
                error: function (err) {
                    alert("Errore:" + err);
                }
            })
        }
    }






})

