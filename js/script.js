$(document).ready(function(){

    var source = $("#template").html();
    var template = Handlebars.compile(source);

    var baseSearchUrl = "https://api.themoviedb.org/3/search/";
    var movieUrl = "movie";
    var seriesUrl = "tv";

    // ricerca dei film al click sul bottone nella pagina
    $("#search").click(function(){
        var movieName = $("#movie-name").val();
        getMovies(movieUrl, "movies", movieName);
        getMovies(seriesUrl, "series", movieName);
    });

    // ricerca dei film alla pressione del tasto invio
    $("#movie-name").keydown(function (event) {
        if (event.which == 13 || event.keyCode == 13) {
            var movieName = $("#movie-name").val();
            getMovies(movieUrl, "movies", movieName);
            getMovies(seriesUrl, "series", movieName);
        }
    });


    // FUNZIONI

    // chiamata all'api che restuitisce film o series tv (in base ai parametri passati) con i relativi dettagli
    function getMovies(url, type, movieName) {
        $("#movies-list").empty();
        if (movieName.length > 0) {
            $("#movie-name").val("");
            $.ajax({
                url: baseSearchUrl + url,
                method: "GET",
                data: {
                    api_key: "75a1a0a4142f1e4570128b8bfcc69bbf",
                    include_adult: "false",
                    language: "it-IT",
                    query: movieName
                },
                success: function (element) {
                    createMovies(element, type);
                },
                error: function (err) {
                    alert("Errore:" + err);
                }
            })
        }
    }

    // funzione che crea l'oggetto movie e lo appende alla lista dei film
    function createMovies(packet, type){
        if (packet.results.length == 0) { // caso in cui vengono restitui 0 film
            $("#movies-list").append("Nessun risultato");
        } else {
                console.log("prova");
                for (var i = 0; i < packet.results.length; i++) {
                    var movie = {
                        type : type,
                        movieTitle: packet.results[i].title,
                        seriesTitle: packet.results[i].name,
                        movieOriginalTitle: packet.results[i].original_title,
                        seriesOriginalTitle: packet.results[i].original_name,
                        language: setLanguage(packet.results[i].original_language),
                        rating: setStars(packet.results[i].vote_average)
                    }
                    var html = template(movie);
                    $("#movies-list").append(html);
                };
        };
    };

    // funzione che sostituisce le lingue con le relative bandiere
    function setLanguage(lang){
        switch (lang) {
            case "it":
                return "<img src=\"img/en.png\" alt=\"italian-flag\">";
            case "en":
                return "<img src=\"img/it.png\" alt=\"english-flag\">";
            default:
                return lang;
        }
    };

    // funziona che mostra il voto con 5 stelle invece che in numero
    function setStars(apiRating) {
        var rating = Math.ceil(apiRating / 2);
        var fullStar = "<i class=\"fas fa-star\"></i>";
        var emptyStar = "<i class=\"far fa-star\"></i>";
        var vote = "";
        for (var j = 0; j < rating; j++) {
            vote += fullStar;
        }
        for (var j = 0; j < 5 - rating; j++) {
            vote += emptyStar;
        }
        return vote
    }



})

