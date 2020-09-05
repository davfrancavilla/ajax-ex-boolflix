$(document).ready(function(){
  // creazione template handlebars per i risultati
  var source = $("#template").html();
  var template = Handlebars.compile(source);

  var baseSearchUrl = "https://api.themoviedb.org/3/search/"; // url base per la ricerca di film/serie
  var baseImgUrl = "https://image.tmdb.org/t/p/w342"; // url base per visualizzare immagini (nel nostro coso copertine)
  var movieUrl = "movie"; // parte finale url per film
  var seriesUrl = "tv"; // parte finale url per serie

  // ricerca dei film al click sul bottone nella pagina
  $("#search").click(function () {
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
    if (movieName.length > 0) {
      $("#movies-list").empty();
      $("#movie-name").val("");
      $.ajax({
        url: baseSearchUrl + url,
        method: "GET",
        data: {
          api_key: "75a1a0a4142f1e4570128b8bfcc69bbf",
          include_adult: "false",
          language: "it-IT",
          query: movieName,
        },
        success: function (element) {
          createMovies(element, type);
        },
        error: function (err) {
          alert("Errore:" + err);
        },
      });
    }
  }

  // funzione che crea l'oggetto movie/serie e lo appende alla lista dei risultati
  function createMovies(packet, type) {
    if (packet.results.length == 0) {
      // caso in cui vengono restitui 0 risultati
      $("#movies-list").append(
        "<li>Nessun risultato trovato in " + '"' + type + '".</li>'
      );
    } else {
      for (var i = 0; i < packet.results.length; i++) {
        var movie = {
          type: type,
          movieTitle: packet.results[i].title,
          seriesTitle: packet.results[i].name,
          img: getImage(packet.results[i].poster_path),
          movieOriginalTitle: packet.results[i].original_title,
          seriesOriginalTitle: packet.results[i].original_name,
          language: setLanguage(packet.results[i].original_language),
          rating: setStars(packet.results[i].vote_average),
        };
        var html = template(movie);
        $("#movies-list").append(html);
        console.log(baseImgUrl + packet.results[i].poster_path);
      }
    }
  }

  // funzione che controlla se l'api ha restuito il poster del film/serie
  function getImage(img) {
    if (img == null) {
      return "img/no-poster.jpg";
    } else {
      return baseImgUrl + img;
    }
  }

  // funzione che sostituisce le lingue con le relative bandiere
  function setLanguage(lang) {
    var languagesCollection = ["it", "en"];
    if (languagesCollection.includes(lang)){
        return '<img src="img/'+lang+'.png" alt="'+lang+'-flag">';
    } else {
        return lang;
    }
  }

  // funziona che mostra il voto con 5 stelle invece che in numero
  function setStars(apiRating) {
    var rating = Math.floor(apiRating / 2);
    var remainder = apiRating % 2;
    var fullStar = '<i class="fas fa-star"></i>';
    var emptyStar = '<i class="far fa-star"></i>';
    var halfStar = '<i class="fas fa-star-half-alt"></i>';
    var vote = "";
    for (var j = 0; j < 5; j++) {
      if (j < rating) {
        vote += fullStar;
      } else if (remainder != 0) {
        vote += halfStar;
        remainder = 0;
      } else {
        vote += emptyStar;
      }
    }
    return vote;
  }
})

